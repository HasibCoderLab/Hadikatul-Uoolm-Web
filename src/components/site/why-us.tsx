import Image from "next/image";
import { whyUs } from "@/content/site";

export function WhyUs() {
  return (
    <section
      id="aboutus"
      aria-labelledby="why-title"
      className="flex w-full flex-wrap items-center justify-center gap-x-[52px] gap-y-9 px-6 py-9"
    >
      <Image
        src={whyUs.image}
        alt="শ্রেণিকক্ষ"
        width={3696}
        height={2448}
        sizes="(min-width: 794px) 600px, 100vw"
        className="h-auto w-full rounded-xl object-cover md:w-[600px]"
      />
      <div className="md:w-[500px]">
        <h2
          id="why-title"
          className="text-section text-brand-700 md:text-section-md lg:text-section-lg font-bold"
        >
          কেন Hadikatul Ulum
        </h2>
        <p className="text-section text-brand-700 md:text-section-md lg:text-section-lg font-bold">
          এ আস্থা রাখবে?
        </p>
        <div className="mt-4 space-y-3">
          {whyUs.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body md:text-body-md leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
