import { useCallback, useEffect, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

async function requestFeedback(cursor = null) {
  const query = cursor ? `?before=${encodeURIComponent(cursor)}` : "";
  const response = await fetch(`/api/rep/feedback${query}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The feedback service returned an unexpected response.");
  }

  if (!response.ok) {
    throw new Error(result.error || "Feedback could not be loaded.");
  }
  if (!Array.isArray(result.items)) {
    throw new Error("The feedback service returned an unexpected response.");
  }

  return result;
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Feedback could not be loaded. Please try again.";
}

export const FeedbackDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadFeedback = useCallback(async (cursor = null, append = false) => {
    try {
      const result = await requestFeedback(cursor);

      setFeedback((current) =>
        append ? [...current, ...result.items] : result.items,
      );
      setNextCursor(
        typeof result.nextCursor === "string" ? result.nextCursor : null,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    requestFeedback()
      .then((result) => {
        if (!active) return;
        setFeedback(result.items);
        setNextCursor(
          typeof result.nextCursor === "string" ? result.nextCursor : null,
        );
      })
      .catch((error) => {
        if (active) setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <title>Rep feedback dashboard | Year 1 CS</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="min-h-screen bg-background">
        <header className="border-b-4 border-primary bg-secondary px-5 py-5 text-white md:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a
              href="/#feedback"
              className="text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-primary"
            >
              Year 1 CS <span aria-hidden="true">↗</span>
            </a>
            <span className="border border-white/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]">
              Rep access
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="flex flex-col justify-between gap-6 border-b-2 border-foreground pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Private course-rep dashboard
              </p>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
                Feedback file<span className="text-primary">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Submissions are anonymous to reps. Keep the messages
                confidential and do not share identifying details outside the
                rep team.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setErrorMessage("");
                loadFeedback();
              }}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center border-2 border-foreground px-5 py-2 text-sm font-bold transition-colors hover:bg-foreground hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="mt-8" aria-live="polite" aria-busy={isLoading}>
            {errorMessage && (
              <div className="border-l-4 border-primary bg-surface p-5">
                <p className="font-bold">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setErrorMessage("");
                    loadFeedback();
                  }}
                  className="mt-3 text-sm font-bold text-primary underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {!errorMessage && !isLoading && feedback.length === 0 && (
              <p className="border-2 border-border bg-card p-6 text-sm text-muted-foreground">
                No feedback submissions yet.
              </p>
            )}

            <div className="space-y-5">
              {feedback.map((item) => (
                <article
                  key={item.id}
                  className="border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_var(--color-foreground)] sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                        {item.topic}
                      </span>
                      {item.module && (
                        <span className="border border-border px-3 py-1 text-xs font-bold">
                          {item.module}
                        </span>
                      )}
                    </div>
                    <time
                      className="text-xs text-muted-foreground"
                      dateTime={item.submittedAt}
                    >
                      {dateFormatter.format(new Date(item.submittedAt))}
                    </time>
                  </div>
                  <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7">
                    {item.message}
                  </p>
                </article>
              ))}
            </div>

            {nextCursor && (
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setErrorMessage("");
                  loadFeedback(nextCursor, true);
                }}
                disabled={isLoading}
                className="mt-8 w-full border-2 border-foreground px-5 py-3 text-sm font-bold transition-colors hover:bg-foreground hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? "Loading…" : "Load older feedback"}
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
};
