export const Footer = () => {
  return (
    <footer className="border-t border-foreground bg-background px-5 py-6 md:px-8">
      <div className="container mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="#top"
          className="font-serif text-lg font-bold text-primary"
        >
          Year 1{" "}
          <span className="font-sans text-sm font-bold text-foreground">
            / CS course reps
          </span>
        </a>
        <p className="text-sm text-muted-foreground">
          University of Reading · Your views, represented.
        </p>
        <a
          href="#top"
          aria-label="Back to top"
          className="self-start border-b border-primary pb-1 text-sm font-bold text-primary hover:border-foreground hover:text-foreground sm:self-auto"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};
