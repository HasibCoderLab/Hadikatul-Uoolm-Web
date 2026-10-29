import { contact } from "@/content/site";

export function Location() {
  return (
    <section aria-labelledby="location-title" className="bg-tint-gray w-full px-0 py-9">
      <div className="hu-container flex flex-col items-center text-center">
        <h2
          id="location-title"
          className="text-section md:text-section-md lg:text-section-lg font-semibold"
        >
          তবে আর দেরি কিসের?
        </h2>
        <h2 className="text-section md:text-section-md lg:text-section-lg font-semibold">
          এখনই চলে এসো হাদিকাতুল উলুম এ ।
        </h2>
        <p className="text-body md:text-body-md mb-3">{contact.address}</p>

        <iframe
          title="হাদিকাতুল উলুম এর অবস্থান — গুগল ম্যাপ"
          src={contact.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-[40vh] w-full rounded-xl border-0 sm:w-[90%]"
        />
      </div>
    </section>
  );
}
