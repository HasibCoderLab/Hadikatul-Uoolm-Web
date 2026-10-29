import { stats } from "@/content/site";
import { cn } from "@/lib/utils";

const toneClass = {
  brand: "text-brand-600",
  blue: "text-stat-blue",
  coral: "text-stat-coral",
  gold: "text-gold-500",
} as const;

export function Stats() {
  return (
    <section aria-label="পরিসংখ্যান" className="w-full py-13">
      {/* audited gaps: 120px desktop, 32px on tablet, 55px on phones */}
      <ul className="hu-container flex flex-wrap items-center justify-center gap-x-[55px] gap-y-8 md:gap-x-8 xl:gap-x-[120px]">
        {stats.map((stat) => (
          <li key={stat.label} className="flex flex-col items-center">
            <p
              className={cn(
                "text-stat md:text-stat-md [text-shadow:var(--hu-shadow-stat-text)]",
                toneClass[stat.tone],
              )}
            >
              {stat.value}
            </p>
            <p className="text-stat-label md:text-stat-label-md [text-shadow:var(--hu-shadow-stat-text)]">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
