import Image from "next/image";
import { contact, footerLinks, site } from "@/content/site";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="w-full px-6 py-6">
      <div className="hu-container flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <Brand variant="footer" />
          <p className="text-footer-heading mt-2 font-semibold">{site.tagline}</p>
        </div>

        <nav aria-label="ফুটার">
          <h2 className="text-footer-heading text-brand-700 font-semibold">লিঙ্ক</h2>
          <ul className="mt-2 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-footer-link text-ink-700 hover:text-brand-700 md:text-footer-link-md"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-footer-heading text-brand-700 font-semibold">যোগাযোগ</h2>
          <ul className="mt-2 space-y-3">
            <li className="flex items-start gap-2">
              <Image
                src="/assets/images/call.png"
                alt=""
                aria-hidden
                width={90}
                height={90}
                className="mt-1 h-6 w-6 shrink-0 object-contain"
              />
              <span className="text-footer-link md:text-footer-link-md">
                {contact.phones.map((phone) => (
                  <a key={phone.href} className="hover:text-brand-700 block" href={phone.href}>
                    {phone.label}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Image
                src="/assets/images/inbox.png"
                alt=""
                aria-hidden
                width={90}
                height={90}
                className="mt-1 h-6 w-6 shrink-0 object-contain"
              />
              <span className="text-footer-link md:text-footer-link-md">
                {contact.emails.map((email) => (
                  <a
                    key={email.href}
                    className="hover:text-brand-700 block break-all"
                    href={email.href}
                  >
                    {email.label}
                  </a>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-footer-heading text-brand-700 font-semibold">অবস্থান</h2>
          <p className="text-footer-link md:text-footer-link-md mt-2 flex items-start gap-2">
            <Image
              src="/assets/images/place.png"
              alt=""
              aria-hidden
              width={90}
              height={90}
              className="mt-1 h-6 w-6 shrink-0 object-contain"
            />
            {contact.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
