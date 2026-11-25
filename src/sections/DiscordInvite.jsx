import { FaDiscord } from "react-icons/fa";

const inviteUrl = "https://discord.com/invite/4dtkjgsDpF";

export const DiscordInvite = () => {
  return (
    <section
      aria-labelledby="discord-heading"
      className="bg-white px-5 py-10 md:px-8 md:py-14"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-7 border-2 border-foreground bg-foreground p-6 text-white shadow-[8px_8px_0_var(--color-primary)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 -skew-x-6 items-center justify-center bg-primary text-white">
              <FaDiscord className="h-7 w-7 skew-x-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                Year 1 · Computer Science
              </p>
              <h2
                id="discord-heading"
                className="mt-2 text-2xl font-black sm:text-3xl"
              >
                Keep the conversation going.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                Join your fellow students on Discord and carry on the course
                conversation between lectures.
              </p>
            </div>
          </div>
          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="speed-button inline-flex shrink-0 items-center justify-center gap-3 bg-primary px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          >
            Join the Discord <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};
