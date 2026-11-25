import { createRemoteJWKSet, jwtVerify } from "jose";

const MAX_BODY_BYTES = 8192;
const MAX_MESSAGE_LENGTH = 3000;
const FEEDBACK_PAGE_SIZE = 50;
const POLL_ID = "workload-2026-27";
const POLL_QUESTION = "How are you finding your workload this term?";
const POLL_OPTIONS = ["Manageable", "About right", "Too much"];
const VOTER_TOKEN_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const accessKeySets = new Map();
const TOPICS = new Set([
  "Lectures and teaching",
  "Labs and practicals",
  "Assessments and feedback",
  "Timetabling and workload",
  "Resources and support",
  "Something else",
]);

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readRequestBody(request) {
  const reader = request.body?.getReader();
  if (!reader) {
    throw new Error("empty_body");
  }

  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("body_too_large");
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new Error("invalid_json");
  }
}

async function submitFeedback(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Request origin not allowed." }, 403);
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return jsonResponse({ error: "Expected a JSON request." }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request is too large." }, 413);
  }

  let payload;
  try {
    payload = await readRequestBody(request);
  } catch (error) {
    if (error.message === "body_too_large") {
      return jsonResponse({ error: "Request is too large." }, 413);
    }
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    typeof payload.website !== "string" ||
    payload.website.length > 0
  ) {
    return jsonResponse({ error: "Please check the form and try again." }, 400);
  }

  const topic = typeof payload.topic === "string" ? payload.topic.trim() : "";
  const module =
    typeof payload.module === "string" ? payload.module.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!TOPICS.has(topic)) {
    return jsonResponse({ error: "Choose a valid topic." }, 400);
  }
  if (module.length > 100) {
    return jsonResponse({ error: "Module must be 100 characters or fewer." }, 400);
  }
  if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: "Message must be between 10 and 3,000 characters." },
      400,
    );
  }

  try {
    const result = await env.FEEDBACK_DB.prepare(
      "INSERT INTO feedback (topic, module, message) VALUES (?, ?, ?)",
    )
      .bind(topic, module || null, message)
      .run();

    if (!result.success) {
      throw new Error("D1 did not confirm the feedback insert.");
    }
  } catch (error) {
    console.error("Feedback submission failed:", error);
    return jsonResponse(
      { error: "Feedback could not be saved. Please try again later." },
      500,
    );
  }

  return jsonResponse({ ok: true }, 201);
}

async function getPollResults(env) {
  try {
    const result = await env.FEEDBACK_DB.prepare(
      "SELECT answer, COUNT(*) AS votes FROM poll_votes WHERE poll_id = ? GROUP BY answer",
    )
      .bind(POLL_ID)
      .all();

    if (!result.success) {
      throw new Error("D1 did not confirm the poll results query.");
    }

    const counts = new Map(POLL_OPTIONS.map((option) => [option, 0]));
    for (const row of result.results) {
      if (counts.has(row.answer)) {
        counts.set(row.answer, Number(row.votes));
      }
    }

    const options = POLL_OPTIONS.map((label) => ({
      label,
      votes: counts.get(label),
    }));

    return jsonResponse({
      question: POLL_QUESTION,
      options,
      totalVotes: options.reduce((total, option) => total + option.votes, 0),
    });
  } catch (error) {
    console.error("Poll results query failed:", error);
    return jsonResponse(
      { error: "Poll results could not be loaded. Please try again later." },
      500,
    );
  }
}

async function submitPollVote(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Request origin not allowed." }, 403);
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return jsonResponse({ error: "Expected a JSON request." }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request is too large." }, 413);
  }

  let payload;
  try {
    payload = await readRequestBody(request);
  } catch (error) {
    if (error.message === "body_too_large") {
      return jsonResponse({ error: "Request is too large." }, 413);
    }
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    typeof payload.answer !== "string" ||
    !POLL_OPTIONS.includes(payload.answer) ||
    typeof payload.voterToken !== "string" ||
    !VOTER_TOKEN_PATTERN.test(payload.voterToken)
  ) {
    return jsonResponse(
      { error: "Choose a valid poll option and try again." },
      400,
    );
  }

  try {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${POLL_ID}:${payload.voterToken}`),
    );
    const voterTokenHash = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    const result = await env.FEEDBACK_DB.prepare(
      "INSERT OR IGNORE INTO poll_votes (poll_id, answer, voter_token_hash) VALUES (?, ?, ?)",
    )
      .bind(POLL_ID, payload.answer, voterTokenHash)
      .run();

    if (!result.success) {
      throw new Error("D1 did not confirm the poll vote.");
    }
    if (result.meta.changes === 0) {
      return jsonResponse({ error: "You have already voted in this poll." }, 409);
    }
  } catch (error) {
    console.error("Poll vote submission failed:", error);
    return jsonResponse(
      { error: "Your vote could not be saved. Please try again later." },
      500,
    );
  }

  return jsonResponse({ ok: true }, 201);
}

async function authorizeRep(request, env) {
  const teamDomainValue = env.ACCESS_TEAM_DOMAIN?.trim();
  const audience = env.ACCESS_AUD?.trim();
  const allowedEmails = (env.REP_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!teamDomainValue || !audience || allowedEmails.length === 0) {
    return jsonResponse(
      { error: "Dashboard access has not been configured." },
      503,
    );
  }

  let teamDomain;
  try {
    teamDomain = new URL(teamDomainValue);
  } catch {
    return jsonResponse(
      { error: "Dashboard access has not been configured correctly." },
      503,
    );
  }

  if (
    teamDomain.protocol !== "https:" ||
    !teamDomain.hostname.endsWith(".cloudflareaccess.com") ||
    teamDomain.port ||
    teamDomain.pathname !== "/" ||
    teamDomain.search ||
    teamDomain.hash
  ) {
    return jsonResponse(
      { error: "Dashboard access has not been configured correctly." },
      503,
    );
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    return jsonResponse(
      { error: "Sign in with an authorized course rep account." },
      401,
    );
  }

  try {
    let jwks = accessKeySets.get(teamDomain.origin);
    if (!jwks) {
      jwks = createRemoteJWKSet(
        new URL("/cdn-cgi/access/certs", teamDomain.origin),
      );
      accessKeySets.set(teamDomain.origin, jwks);
    }

    const { payload } = await jwtVerify(token, jwks, {
      algorithms: ["RS256"],
      audience,
      issuer: teamDomain.origin,
    });
    const email =
      typeof payload.email === "string" ? payload.email.toLowerCase() : "";

    if (!allowedEmails.includes(email)) {
      return jsonResponse(
        { error: "Your account is not authorized to view submissions." },
        403,
      );
    }
  } catch (error) {
    console.warn(
      "Feedback dashboard Access token rejected:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return jsonResponse(
      { error: "Your sign-in could not be verified. Please sign in again." },
      403,
    );
  }

  return null;
}

async function listFeedback(request, env) {
  const authorizationError = await authorizeRep(request, env);
  if (authorizationError) return authorizationError;

  const beforeValue = new URL(request.url).searchParams.get("before");
  let before;
  if (beforeValue !== null) {
    before = Number(beforeValue);
    if (!Number.isSafeInteger(before) || before < 1) {
      return jsonResponse({ error: "Invalid page cursor." }, 400);
    }
  }

  try {
    const query =
      before === undefined
        ? env.FEEDBACK_DB.prepare(
            "SELECT id, topic, module, message, created_at FROM feedback ORDER BY id DESC LIMIT ?",
          ).bind(FEEDBACK_PAGE_SIZE + 1)
        : env.FEEDBACK_DB.prepare(
            "SELECT id, topic, module, message, created_at FROM feedback WHERE id < ? ORDER BY id DESC LIMIT ?",
          ).bind(before, FEEDBACK_PAGE_SIZE + 1);
    const result = await query.all();

    if (!result.success) {
      throw new Error("D1 did not confirm the feedback query.");
    }

    const hasMore = result.results.length > FEEDBACK_PAGE_SIZE;
    const records = result.results.slice(0, FEEDBACK_PAGE_SIZE);
    const items = records.map((record) => ({
      id: record.id,
      topic: record.topic,
      module: record.module,
      message: record.message,
      submittedAt: new Date(record.created_at * 1000).toISOString(),
    }));

    return jsonResponse({
      items,
      nextCursor:
        hasMore && records.length > 0
          ? String(records[records.length - 1].id)
          : null,
    });
  } catch (error) {
    console.error("Feedback dashboard query failed:", error);
    return jsonResponse(
      { error: "Feedback could not be loaded. Please try again later." },
      500,
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/rep/feedback") {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed." }, 405);
      }
      return listFeedback(request, env);
    }

    if (url.pathname === "/api/feedback") {
      return submitFeedback(request, env);
    }

    if (url.pathname === "/api/poll") {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed." }, 405);
      }
      return getPollResults(env);
    }

    if (url.pathname === "/api/poll/vote") {
      return submitPollVote(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found." }, 404);
    }

    if (url.pathname === "/dashboard" || url.pathname === "/dashboard/") {
      const assetUrl = new URL("/", url);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return new Response(null, { status: 404 });
  },

  async scheduled(_controller, env) {
    const result = await env.FEEDBACK_DB.prepare(
      "DELETE FROM feedback WHERE created_at < unixepoch('now', '-90 days')",
    ).run();

    if (!result.success) {
      throw new Error("D1 did not confirm feedback retention cleanup.");
    }

    console.info(`Deleted ${result.meta.changes} expired feedback records.`);
  },
};
