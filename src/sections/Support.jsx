import { ArrowUpRight } from "lucide-react";

const supportLinks = [
  {
    title: "Study support",
    description:
      "Find academic skills, study advice, library help, and learning support.",
    href: "https://www.reading.ac.uk/essentials/Welcome/Becoming-a-student/Academic/Study-support",
  },
  {
    title: "Wellbeing and personal support",
    description:
      "Explore University wellbeing services and routes to personal support.",
    href: "https://www.reading.ac.uk/essentials/Support-And-Wellbeing",
  },
  {
    title: "Disability Advisory Service",
    description:
      "Information and guidance for disabled students and students who need adjustments.",
    href: "https://www.reading.ac.uk/essentials/support-and-wellbeing/disability/disability-advisory-service.aspx",
  },
];

export const Support = () => {
  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className="border-y-2 border-foreground bg-surface px-5 py-16 md:px-8 md:py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          data-reveal="left"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              More help at Reading
            </p>
            <h2
              id="support-heading"
              className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl"
            >
              Find the right support.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-foreground/80">
            Course reps can listen and signpost. These University services can
            help with specific study and support needs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {supportLinks.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
              style={{ transitionDelay: `${index * 90}ms` }}
              className="group flex min-h-52 flex-col border-2 border-foreground bg-white p-5 text-foreground transition-all duration-200 hover:-translate-y-1 hover:bg-foreground hover:text-white hover:shadow-[6px_6px_0_var(--color-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="flex items-center justify-between">
                <span className="inline-block -skew-x-12 bg-primary px-3 py-1 text-sm font-black text-white">
                  0{index + 1}
                </span>
                <ArrowUpRight
                  className="text-primary transition-colors group-hover:text-white"
                  size={21}
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-7 text-xl font-black">{link.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground group-hover:text-white/80">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
