import { useState } from "react";

const fieldClass =
  "mt-2 w-full rounded-sm border border-border bg-card px-3.5 py-3 text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export const Contact = () => {
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmissionStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formData.get("category"),
          module: formData.get("module"),
          message: formData.get("feedback"),
          website: formData.get("website"),
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The feedback service returned an unexpected response. Please try again later.",
        );
      }

      if (!response.ok) {
        throw new Error(result.error || "Feedback could not be submitted.");
      }

      form.reset();
      setSubmissionStatus("success");
      setStatusMessage(
        "Thanks — your feedback has been submitted. It is automatically deleted after 90 days.",
      );
    } catch (error) {
      setSubmissionStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Feedback could not be submitted. Please try again or email the course rep.",
      );
    }
  };

  return (
    <section id="feedback" className="px-5 py-16 md:px-8 md:py-24">
      <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="self-start lg:sticky lg:top-28">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Your message
          </span>
          <h2 className="mt-4 text-4xl font-normal leading-[1.08] sm:text-5xl">
            What should we know?
          </h2>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">
            Share a thought, concern, or idea with your Year 1 Computer Science
            course reps. A few sentences is plenty.
          </p>
          <div className="mt-8 border-l-4 border-primary bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em]">
              About anonymity
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The form does not ask for your name or email, and submissions are
              not shown publicly. Cloudflare processes connection metadata, so
              avoid details that could identify you. Messages are deleted after
              they pass 90 days old; the cleanup runs daily.
            </p>
          </div>
          <a
            href="#rep-emails"
            className="mt-5 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary hover:border-foreground hover:text-foreground"
          >
            Prefer email? View the course rep emails{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="feedback-panel bg-card p-5 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm font-bold" htmlFor="category">
                Topic{" "}
                <span className="font-normal text-muted-foreground">
                  · required
                </span>
                <select
                  className={fieldClass}
                  id="category"
                  name="category"
                  defaultValue=""
                  required
                  disabled={submissionStatus === "sending"}
                >
                  <option value="" disabled>
                    Choose a topic
                  </option>
                  <option>Lectures and teaching</option>
                  <option>Labs and practicals</option>
                  <option>Assessments and feedback</option>
                  <option>Timetabling and workload</option>
                  <option>Resources and support</option>
                  <option>Something else</option>
                </select>
              </label>

              <label className="block text-sm font-bold" htmlFor="module">
                Module{" "}
                <span className="font-normal text-muted-foreground">
                  · optional
                </span>
                <input
                  className={fieldClass}
                  id="module"
                  name="module"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Programming"
                  disabled={submissionStatus === "sending"}
                />
              </label>
            </div>

            <label
              className="block text-sm font-bold"
              htmlFor="feedback-message"
            >
              Your message{" "}
              <span className="font-normal text-muted-foreground">
                · required
              </span>
              <textarea
                className={`${fieldClass} min-h-44 resize-y`}
                id="feedback-message"
                name="feedback"
                required
                minLength={10}
                maxLength={3000}
                placeholder="What’s going well? What could be improved? Tell us a little more…"
                disabled={submissionStatus === "sending"}
              />
              <span className="mt-2 block text-xs font-normal text-muted-foreground">
                Please avoid including names or other people’s personal details.
              </span>
            </label>

            <input
              className="hidden"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button
              className="inline-flex w-full items-center justify-center gap-3 bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              type="submit"
              disabled={submissionStatus === "sending"}
            >
              {submissionStatus === "sending"
                ? "Sending…"
                : "Send anonymously"}
              {submissionStatus !== "sending" && (
                <span aria-hidden="true">↗</span>
              )}
            </button>
          </form>

          {statusMessage && (
            <p
              className={`mt-5 border-l-4 ${
                submissionStatus === "error"
                  ? "border-red-700"
                  : "border-primary"
              } bg-surface p-4 text-sm leading-6 text-foreground`}
              role="status"
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
