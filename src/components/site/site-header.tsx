"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { contact, navLinks } from "@/content/site";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const primaryEmail = contact.emails[0];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header className="shadow-nav sticky top-0 z-[var(--hu-z-header)] bg-white">
      {/* Utility bar — legacy hides it below 1100px */}
      <div className="h-topbar hidden items-center bg-[image:var(--hu-gradient-topbar)] px-4 text-white xl:flex">
        <div className="hu-container flex items-center justify-between">
          <div className="flex items-center gap-9">
            {primaryEmail ? (
              <a
                className="text-micro flex items-center gap-1.5 hover:underline"
                href={primaryEmail.href}
              >
                <Image
                  src="/assets/svgs/gmail.svg"
                  alt=""
                  width={19}
                  height={19}
                  aria-hidden
                  className="invert"
                />
                <span>{primaryEmail.label}</span>
              </a>
            ) : null}
            <span className="text-micro flex items-center gap-1.5">
              <Image
                src="/assets/svgs/location.svg"
                alt=""
                width={19}
                height={19}
                aria-hidden
                className="invert"
              />
              <span>{contact.addressLong}</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            {contact.phones.map((phone) => (
              <a
                key={phone.href}
                className="text-micro flex items-center gap-1.5 hover:underline"
                href={phone.href}
              >
                <Image
                  src="/assets/svgs/call.svg"
                  alt=""
                  width={19}
                  height={19}
                  aria-hidden
                  className="invert"
                />
                <span>{phone.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="hu-container h-nav flex items-center justify-between gap-4">
        <Brand className="ms-3" />

        <nav aria-label="প্রধান" className="hidden items-center gap-9 lg:flex">
          <ul className="flex items-center gap-[18px]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="text-nav text-ink-700 hover:text-brand-700 xl:text-nav-lg transition-colors"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild>
            <a href="#contactus">এখনই যোগাযোগ কর</a>
          </Button>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <Button asChild className="hidden sm:inline-flex">
            <a href="#contactus">যোগাযোগ</a>
          </Button>
          <button
            ref={triggerRef}
            type="button"
            aria-label="মেনু খুলুন"
            aria-expanded={open}
            aria-controls="site-drawer"
            onClick={() => setOpen(true)}
            className="rounded-sm p-2"
          >
            <Image src="/assets/svgs/hamburger.svg" alt="" width={28} height={28} aria-hidden />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[var(--hu-z-drawer)] lg:hidden">
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            className="absolute inset-0 bg-black/40"
            onClick={close}
          />
          <nav
            id="site-drawer"
            aria-label="মোবাইল মেনু"
            className="shadow-nav absolute inset-y-0 end-0 flex w-[85vw] max-w-sm flex-col gap-2 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="মেনু বন্ধ করুন"
                onClick={close}
                className="rounded-sm p-2"
              >
                <Image src="/assets/svgs/close.svg" alt="" width={28} height={28} aria-hidden />
              </button>
            </div>

            <ul className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "bg-surface-menu flex min-h-12 items-center justify-center rounded-lg",
                      "text-nav text-ink-700 hover:text-brand-700",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-2">
              <a href="#contactus" onClick={() => setOpen(false)}>
                এখনই যোগাযোগ কর
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
