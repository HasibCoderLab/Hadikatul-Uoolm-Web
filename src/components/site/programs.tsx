import Image from "next/image";
import { programs } from "@/content/site";

export function Programs() {
  return (
    <section
      id="courses"
      aria-labelledby="programs-title"
      className="bg-brand-50 relative w-full px-6 py-12"
    >
      <div className="hu-container flex flex-col items-center gap-6">
        <h2
          id="programs-title"
          className="text-section text-ink-700 md:text-section-md lg:text-section-lg text-center font-semibold"
        >
          Hadikatul Ulum একাডেমিক প্রোগ্রামে যা যা থাকছে,
        </h2>
        <h3 className="text-section-sub md:text-section-sub-md text-center font-semibold">
          সেরা শিক্ষকদের পরিচর্যায় অব্যাহত থাকুক পড়াশুনার অগ্রযাত্রা
        </h3>

        <ul className="grid w-full max-w-[1072px] grid-cols-1 gap-9 py-6 md:grid-cols-2">
          {programs.map((program) => (
            <li key={program.title}>
              {/* Real destination: the section that actually offers enrolment
                  guidance. The legacy cards were inert divs. */}
              <a
                href="#contactus"
                className="border-line hover:border-brand-500 hover:bg-surface-muted flex h-[120px] items-center justify-between rounded-md border bg-white p-3 transition-colors md:h-[150px]"
              >
                <span className="flex items-center gap-3">
                  <Image
                    src={program.icon}
                    alt=""
                    aria-hidden
                    width={program.iconWidth}
                    height={program.iconHeight}
                    className="size-[60px] md:size-20"
                  />
                  <span className="flex flex-col">
                    <span className="text-card-title md:text-card-title-md font-semibold">
                      {program.title}
                    </span>
                    <span className="text-card-sub">{program.subtitle}</span>
                  </span>
                </span>
                <Image
                  src="/assets/svgs/right.svg"
                  alt=""
                  aria-hidden
                  width={25}
                  height={25}
                  className="me-3 size-5 md:size-[25px]"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* decorative, hidden below 794px exactly as in the legacy stylesheet */}
      <Image
        src="/assets/svgs/teaching.svg"
        alt=""
        aria-hidden
        width={150}
        height={150}
        className="absolute start-4 bottom-0 hidden w-[150px] md:block"
      />
    </section>
  );
}
