import { team } from "@/content/site";

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="bg-tint-blue w-full px-6 py-12">
      <div className="hu-container flex flex-col items-center">
        <h2
          id="team-title"
          className="text-section text-brand-700 md:text-section-md lg:text-section-lg w-full text-center font-semibold"
        >
          আমাদের টিম
        </h2>
        <h3 className="text-section-sub md:text-section-sub-md mt-2 text-center font-semibold">
          প্রতিভাবান এবং দক্ষ একটি ডাইন্যামিক টিমের নেতৃত্ব,
        </h3>
        <h3 className="text-section-sub md:text-section-sub-md text-center font-semibold">
          Hadikatul Ulum - বাংলাদেশের সেরা ইসলামিক কোচিং সেন্টার।
        </h3>

        {/* The legacy cards carried 12 social icons pointing at "#". They are
            intentionally absent until real profile URLs exist. The legacy
            "portraits" were one mosque photo reused four times, so they are
            replaced by honest initials until real photos are supplied. */}
        <ul className="mt-6 grid w-full grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <li
              key={member.name}
              className="hu-reveal shadow-card flex h-[400px] w-full max-w-[280px] flex-col rounded-xl bg-white"
            >
              <div className="flex h-1/2 items-center justify-center pt-6">
                <span
                  aria-hidden
                  className="border-surface-muted bg-brand-50 text-brand-700 flex size-[130px] items-center justify-center rounded-full border-8 text-4xl font-bold select-none"
                >
                  {Array.from(member.name)[0]}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center px-4 text-center">
                <h3 className="text-card-title md:text-card-title-md font-bold">{member.name}</h3>
                <p className="text-card-sub mt-3">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
