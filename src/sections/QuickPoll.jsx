import { useEffect, useState } from "react";

const VOTER_TOKEN_KEY = "year1-cs-workload-poll-token";
const VOTED_KEY = "year1-cs-workload-poll-voted";

async function fetchPollResults() {
  const response = await fetch("/api/poll", { cache: "no-store" });
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Poll results returned an unexpected response.");
  }

  if (!response.ok) {
    throw new Error(result.error || "Poll results could not be loaded.");
  }

  return result;
}

export const QuickPoll = () => {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        try {
          setHasVoted(localStorage.getItem(VOTED_KEY) === "true");
        } catch {
          setStorageAvailable(false);
          setStatusIsError(true);
          setStatusMessage(
            "Your browser must allow local storage to take part in this poll.",
          );
        }

        return fetchPollResults();
      })
      .then((result) => {
        if (isActive) setPoll(result);
      })
      .catch((error) => {
        if (isActive) {
          setStatusIsError(true);
          setStatusMessage(
            error instanceof Error
              ? error.message
              : "Poll results could not be loaded. Please try again later.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const markAsVoted = () => {
    setHasVoted(true);
    try {
      localStorage.setItem(VOTED_KEY, "true");
    } catch {
      setStorageAvailable(false);
    }
  };

  const handleVote = async (answer) => {
    setIsSubmitting(true);
    setStatusMessage("");
    setStatusIsError(false);

    try {
      let voterToken = localStorage.getItem(VOTER_TOKEN_KEY);
      if (!voterToken) {
        voterToken = window.crypto.randomUUID();
        localStorage.setItem(VOTER_TOKEN_KEY, voterToken);
      }

      const response = await fetch("/api/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, voterToken }),
      });
      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("The poll service returned an unexpected response.");
      }

      if (response.status === 409) {
        markAsVoted();
        setStatusMessage(
          "A vote from this browser was already counted. Here are the current results.",
        );
      } else if (!response.ok) {
        throw new Error(result.error || "Your vote could not be saved.");
      } else {
        markAsVoted();
        setStatusMessage("Thanks for voting. Here are the current results.");
      }

      setPoll(await fetchPollResults());
    } catch (error) {
      setStatusIsError(true);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Your vote could not be saved. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="quick-poll"
      aria-labelledby="poll-heading"
      className="bg-primary px-5 py-14 text-white md:px-8"
    >
      <div className="container mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1fr] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">
            Quick pulse
          </p>
          <h2
            id="poll-heading"
            className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl"
          >
            One question. Your say.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/90">
            Share how the workload feels this term. Results show the combined
            responses from the year.
          </p>
        </div>

        <div className="border-2 border-foreground bg-white p-5 text-foreground sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-black uppercase">Current poll</p>
            <span className="bg-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">
              {hasVoted ? "Vote recorded" : "Open"}
            </span>
          </div>
          <p className="mt-4 text-lg font-bold">
            {poll?.question ?? "Loading poll…"}
          </p>

          {isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground" role="status">
              Loading poll results…
            </p>
          ) : poll ? (
            hasVoted ? (
              <div className="mt-4 space-y-4" aria-label="Poll results">
                {poll.options.map((option) => {
                  const percentage =
                    poll.totalVotes === 0
                      ? 0
                      : Math.round((option.votes / poll.totalVotes) * 100);

                  return (
                    <div key={option.label}>
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="font-bold">{option.label}</span>
                        <span className="text-muted-foreground">
                          {percentage}% ({option.votes})
                        </span>
                      </div>
                      <div
                        className="mt-2 h-2 bg-surface"
                        role="progressbar"
                        aria-label={`${option.label}: ${percentage}%`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                      >
                        <div
                          className="h-full bg-primary transition-[width] duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                  {" · "}results update when you vote
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {poll.options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    disabled={isSubmitting || !storageAvailable}
                    onClick={() => handleVote(option.label)}
                    className="border border-border px-3 py-3 text-left text-sm font-bold transition-colors hover:border-primary hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting…" : option.label}
                  </button>
                ))}
                <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">
                  {poll.totalVotes} {poll.totalVotes === 1 ? "response" : "responses"}
                  {" so far · "}vote to see the breakdown.
                </p>
              </div>
            )
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              The poll is temporarily unavailable.
            </p>
          )}

          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
            No name or email is collected. A hash of a random browser token is
            stored with your vote to help prevent repeat voting from this
            browser.
          </p>
          {statusMessage && (
            <p
              className={`mt-3 text-sm leading-5 ${
                statusIsError ? "text-red-700" : "text-muted-foreground"
              }`}
              role={statusIsError ? "alert" : "status"}
              aria-live="polite"
            >
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
