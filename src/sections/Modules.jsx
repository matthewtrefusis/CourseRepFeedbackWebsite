import { ArrowUpRight } from "lucide-react";

const moduleResourcesUrl = "https://www.bb.reading.ac.uk/ultra/course";

const modules = [
  {
    code: "CS1CA",
    semester: 1,
    title: "Computer Systems Architecture",
  },
  {
    code: "CS1IP",
    semester: 1,
    title: "Imperative Programming",
  },
  {
    code: "CS1MA",
    semester: 1,
    title: "Mathematics and Computation",
  },
  {
    code: "CS1AC",
    semester: 2,
    title: "Applications of Computer Science",
  },
  {
    code: "CS1DB",
    semester: 2,
    title: "Databases",
  },
  {
    code: "CS1OP",
    semester: 2,
    title: "Object-Oriented Programming",
  },
];

export const Modules = () => {
  return (
    <section
      id="modules"
      aria-labelledby="modules-heading"
      className="border-b-2 border-foreground bg-surface px-5 py-16 md:px-8 md:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          data-reveal="left"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Year 1 · Course resources
            </p>
            <h2
              id="modules-heading"
              className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl"
            >
              Pick a module.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-foreground/80">
            Module codes and semesters are listed here. Cards open the shared
            Reading Ultra course area; direct module links can be added when
            available.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <a
              key={module.code}
              href={moduleResourcesUrl}
              target="_blank"
              rel="noreferrer"
              data-reveal
              style={{ transitionDelay: `${index * 80}ms` }}
              aria-label={`Open ${module.title} resources in Reading Ultra`}
              className="group flex min-h-48 flex-col justify-between border-2 border-foreground bg-white p-5 text-foreground transition-all duration-200 hover:-translate-y-1 hover:bg-foreground hover:text-white hover:shadow-[6px_6px_0_var(--color-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="flex items-start justify-between">
                <span className="inline-block -skew-x-12 bg-primary px-3 py-1 text-sm font-black text-white">
                  0{index + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center border border-foreground transition-colors group-hover:border-white group-hover:bg-white group-hover:text-foreground">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </span>
              <span className="mt-8">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground group-hover:text-white/70">
                  {module.code} · Semester {module.semester}
                </span>
                <span className="block text-xl font-black leading-tight">
                  {module.title}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
