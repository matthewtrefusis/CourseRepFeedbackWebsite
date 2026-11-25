const course = "Computer Science Year 1";
const school = "School of Mathematical, Physical & Computational Sciences";

const reps = [
  {
    name: "Alexander Sharpy Sharp",
    email: "a.w.sharp@student.reading.ac.uk",
  },
  {
    name: "Keison Zhou",
    email: "keison.zhou@student.reading.ac.uk",
  },
  {
    name: "Matthew Trefusis",
    email: "m.trefusis@student.reading.ac.uk",
  },
];

export const CourseReps = () => {
  return (
    <section
      id="reps"
      aria-labelledby="reps-heading"
      className="bg-white px-5 py-16 md:px-8 md:py-20"
    >
      <div className="container mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div data-reveal="left">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            People behind the page
          </p>
          <h2
            id="reps-heading"
            className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl"
          >
            Meet your reps.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Your Undergraduate Course Representatives for Computer Science
            Year 1.
          </p>
        </div>

        <div id="rep-emails" className="space-y-4">
          {reps.map(({ name, email }, index) => (
            <article
              key={name}
              data-reveal
              style={{ transitionDelay: `${index * 90}ms` }}
              className="grid gap-4 border-2 border-foreground bg-surface p-5 shadow-[5px_5px_0_var(--color-primary)] sm:grid-cols-[1fr_1.1fr] sm:items-center sm:p-6"
            >
              <div>
                <span className="inline-block -skew-x-12 bg-primary px-2.5 py-1 text-xs font-black text-white">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg font-black">{name}</h3>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-primary">
                  Undergraduate Course Rep
                </p>
              </div>
              <div className="border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="text-sm font-bold text-foreground">{course}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {school}
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 inline-block break-all text-sm font-bold text-primary underline-offset-4 hover:underline"
                >
                  {email}
                </a>
              </div>
            </article>
          ))}

          <div
            className="flex flex-col gap-3 border-l-4 border-primary bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            data-reveal
          >
            <p className="text-sm text-muted-foreground">
              Have a question? Email a rep:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {reps.map(({ name, email }) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="inline-flex w-fit items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary hover:border-foreground hover:text-foreground"
                >
                  Email {name} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
