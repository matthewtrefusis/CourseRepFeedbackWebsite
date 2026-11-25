const updateStages = [
  {
    number: "01",
    title: "You said",
    description:
      "Students appreciated clear teaching, Blackboard materials available ahead of time, and resources like NotebookLM, focus timers, peer study, and Rocketbook. Concerns included commuter costs and motivation around a single Thursday lecture, long Monday sessions, and some explanations feeling hard to follow. Students also asked about past papers; the University archive was shared, though its collection is limited.",
    label: "Student feedback themes",
  },
  {
    number: "02",
    title: "We raised",
    description:
      "The course chair said he would raise concerns about the Thursday lecture and a Monday with four hours of lectures; the Monday concern had already been raised. There was also a commitment to speak with Hong Wei about creating a cheat sheet for CS1CA.",
    label: "Course meeting update",
  },
  {
    number: "03",
    title: "What changed",
    description:
      "Confirmed responses and actions will be shared here.",
    label: "Update to be added",
  },
];

export const Updates = () => {
  return (
    <section
      id="updates"
      aria-labelledby="updates-heading"
      className="bg-foreground px-5 py-16 text-white md:px-8 md:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className="mb-9 flex flex-col gap-4 border-b border-white/40 pb-7 sm:flex-row sm:items-end sm:justify-between"
          data-reveal="left"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
              Follow the feedback
            </p>
            <h2
              id="updates-heading"
              className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl"
            >
              You said. We did.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/85">
            We&apos;ll share anonymised themes, what we raise with staff, and
            any confirmed outcomes here.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {updateStages.map((stage, index) => (
            <li
              key={stage.number}
              data-reveal
              style={{ transitionDelay: `${index * 100}ms` }}
              className="border border-white/40 bg-white/[0.04] p-5"
            >
              <span className="inline-block -skew-x-12 bg-primary px-3 py-1 text-sm font-black text-white">
                {stage.number}
              </span>
              <h3 className="mt-5 text-xl font-black">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">
                {stage.description}
              </p>
              <p className="mt-5 border-t border-white/25 pt-3 text-[11px] font-black uppercase tracking-[0.14em] text-white/60">
                {stage.label}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
