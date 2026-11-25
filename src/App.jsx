import { useEffect } from "react";
import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero";
import { Modules } from "@/sections/Modules";
import { About } from "@/sections/About";
import { Updates } from "@/sections/Updates";
import { QuickPoll } from "@/sections/QuickPoll";
import { CourseReps } from "@/sections/CourseReps";
import { DiscordInvite } from "@/sections/DiscordInvite";
import { Support } from "@/sections/Support";
import { Contact } from "@/sections/Contact";
import { FeedbackDashboard } from "@/sections/FeedbackDashboard";
import { Footer } from "@/sections/Footer";

function App() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const revealTargets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -24px 0px" },
    );

    document.documentElement.classList.add("motion-ready");
    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  if (
    typeof window !== "undefined" &&
    ["/dashboard", "/dashboard/"].includes(window.location.pathname)
  ) {
    return <FeedbackDashboard />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Modules />
        <About />
        <Updates />
        <QuickPoll />
        <CourseReps />
        <DiscordInvite />
        <Support />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
