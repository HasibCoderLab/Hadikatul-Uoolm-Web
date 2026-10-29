import Image from "next/image";
import { Button } from "@/components/ui/button";
import { contact } from "@/content/site";

/* The legacy section also rendered a Facebook page card and a Facebook group
   card, but both buttons had no destination. Rather than ship fake buttons they
   are omitted until real URLs exist — see docs/IMPLEMENTATION_STATUS.md. */
export function Contact() {
  const primaryPhone = contact.phones[0];

  return (
    <section
      id="contactus"
      aria-labelledby="contact-title"
      className="flex w-full justify-center px-6 py-9"
    >
      <div className="hu-container flex flex-col items-center">
        <div className="shadow-panel flex w-full max-w-[800px] flex-col justify-between gap-4 rounded-lg p-4 sm:h-[300px] sm:flex-row sm:items-center">
          <div className="sm:w-[55%]">
            <h2
              id="contact-title"
              className="text-card-title text-brand-700 md:text-card-title-md font-semibold"
            >
              যেকোনো প্রয়োজনে কল করো এখনই
            </h2>
            <p className="text-card-sub md:text-card-sub-md mt-2">
              অফলাইন কোচিং এ ভর্তি অথবা যেকোনো বিষয় তথ্য পেতে এখনই যোগাযোগ করুণ ।
            </p>
            <p className="text-card-sub mt-4 flex items-center gap-2 font-semibold">
              <span aria-hidden className="bg-brand-700 h-7 w-2 rounded-lg" />
              {contact.hours}
            </p>
            {primaryPhone ? (
              <Button asChild className="mt-4">
                <a href={primaryPhone.href}>
                  <Image
                    src="/assets/svgs/call.svg"
                    alt=""
                    aria-hidden
                    width={26}
                    height={26}
                    className="invert"
                  />
                  {primaryPhone.label}
                </a>
              </Button>
            ) : null}
          </div>

          <Image
            src="/assets/svgs/phonecall.svg"
            alt=""
            aria-hidden
            width={200}
            height={200}
            className="hidden w-[150px] self-end sm:block md:w-[200px]"
          />
        </div>
      </div>
    </section>
  );
}
