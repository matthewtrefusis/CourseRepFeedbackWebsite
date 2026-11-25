export const Hero = () => {
  return (
    <section
      id="top"
      className="overflow-hidden bg-foreground px-5 py-12 text-white md:px-8 md:py-16"
    >
      <div className="container mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5">
        <div
          className="relative z-10 py-4 sm:py-10"
          data-reveal="left"
        >
          <p className="mb-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white">
            <span className="inline-block h-2.5 w-7 skew-x-[-22deg] bg-primary" />
            Reading CS <span className="text-white/70">//</span> Year 01
          </p>
          <h1 className="text-5xl font-black uppercase italic leading-[0.94] tracking-[-0.045em] sm:text-7xl lg:text-[7rem]">
            Good?
            <br />
            Bad?
            <br />
            <span className="hero-title-accent">Say it.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white sm:text-lg">
            What&apos;s clicking in your first year? What&apos;s not? Send your
            course reps the little stuff, the big stuff, and the{" "}
            <span className="font-bold text-white">“wait, why?”</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#feedback"
              className="speed-button inline-flex items-center gap-3 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              Drop your feedback <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#how-it-works"
              className="border-b border-white/60 py-2 text-sm font-bold text-white hover:border-primary hover:text-primary"
            >
              How it gets heard
            </a>
          </div>
        </div>

        <aside
          className="hero-art mx-auto w-full max-w-xl"
          data-reveal="right"
          style={{ transitionDelay: "120ms" }}
          aria-label="Year one computer science student voice graphic"
        >
          <span className="hero-speed-lines" aria-hidden="true" />
          <div className="hero-art-copy">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Student voice
            </p>
            <span className="hero-number">01</span>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-white">
              No comment too small
            </p>
          </div>
          <span className="hero-sticker" aria-hidden="true">
            CS
            <br />
            rep
          </span>
        </aside>
      </div>
    </section>
  );
};
