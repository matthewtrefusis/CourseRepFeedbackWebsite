import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#modules", label: "Modules" },
  { href: "#updates", label: "Updates" },
  { href: "#reps", label: "Reps" },
  { href: "#support", label: "Support" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b-2 bg-background transition-all duration-500 ease-in-out ${
        isScrolled
          ? "border-primary shadow-md"
          : "border-foreground shadow-none"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`container relative mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-500 ease-in-out md:px-8 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="University of Reading Year 1 Computer Science course reps"
          onClick={closeMobileMenu}
        >
          <span className="brand-mark" aria-hidden="true">
            CS
          </span>
          <span className="text-[11px] font-black uppercase leading-[1.2] tracking-[0.12em]">
            Course reps
            <span className="mt-1 block font-medium tracking-[0.08em]">
              Reading · Year 01
            </span>
          </span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                href={link.href}
                key={link.href}
                className="px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <a
            href="#feedback"
            className="speed-button inline-flex items-center bg-foreground px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Have your say <span className="ml-2" aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center border border-foreground text-foreground transition-colors hover:bg-surface lg:hidden"
          type="button"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={23} aria-hidden="true" />
          ) : (
            <Menu size={23} aria-hidden="true" />
          )}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`${isMobileMenuOpen ? "block" : "hidden"} border-t border-foreground bg-background px-5 py-5 lg:hidden`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-6xl flex-col gap-2">
          {navLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              className="border-b border-border py-3 font-bold hover:text-primary"
              onClick={closeMobileMenu}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#feedback"
            className="speed-button mt-3 inline-flex w-fit items-center bg-primary px-5 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-foreground"
            onClick={closeMobileMenu}
          >
            Leave feedback <span className="ml-2" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
