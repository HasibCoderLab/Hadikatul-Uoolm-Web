import Image from "next/image";
import { Button } from "@/components/ui/button";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex h-[50vh] items-center justify-center overflow-hidden sm:h-[60vh] 2xl:h-[80vh]"
    >
      <Image
        src={hero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* legacy scrim: black at 20% */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="hu-container relative text-center lg:text-start">
        <div className="lg:w-[80vw] lg:max-w-4xl">
          <p className="text-hero-eyebrow font-semibold text-white [text-shadow:var(--hu-shadow-hero-text)]">
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-hero md:text-hero-md lg:text-hero-lg mt-3 font-bold text-white [text-shadow:var(--hu-shadow-hero-text)]"
          >
            <span className="block">{hero.titleLead}</span>
            <span className="block">{hero.titleTail}</span>
          </h1>
          <div className="mt-4 space-y-2">
            {hero.sublines.map((line) => (
              <p
                key={line}
                className="text-hero-sub md:text-hero-sub-md lg:text-hero-sub-lg font-semibold text-white [text-shadow:var(--hu-shadow-hero-text)]"
              >
                {line}
              </p>
            ))}
          </div>
          <Button asChild variant="gold" className="mt-6">
            <a href="#courses">{hero.cta}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
