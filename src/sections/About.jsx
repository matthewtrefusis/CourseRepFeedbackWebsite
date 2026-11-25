const steps = [
  {
    number: "01",
    title: "You tell us",
    description:
      "Share what is going well, raise a concern, or suggest a change. You do not need to have a solution.",
  },
  {
    number: "02",
    title: "We take it to staff",
    description:
      "Course reps bring student feedback to the relevant conversations and meetings.",
  },
  {
    number: "03",
    title: "We follow up",
    description:
      "We look for common themes and keep track of what happens next.",
  },
];

export const About = () => {
  return (
    <section
      id="how-it-works"
      className="border-y border-foreground bg-white px-5 py-16 md:px-8 md:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-foreground pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">
              How representation works
            </p>
            <h2 className="mt-3 text-3xl font-normal leading-tight sm:text-4xl">
              From your message to a conversation.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-foreground/75">
            Course reps connect students with the university. Every view helps
            us represent more of the year.
          </p>
        </div>

        <ol className="grid gap-x-8 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="border-b border-foreground/50 py-5 first:pt-0 sm:border-b-0 sm:border-l sm:py-1 sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <span className="inline-block -skew-x-12 bg-primary px-3 py-1 font-sans text-lg font-black text-white">
                {step.number}
              </span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/75">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-l-4 border-primary pl-4 text-sm leading-6 text-foreground/80">
          Good feedback is useful too. Let us know what should stay just as it
          is.
        </p>
      </div>
    </section>
  );
};
