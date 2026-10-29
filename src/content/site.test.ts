import { describe, expect, it } from "vitest";
import { contact, footerLinks, navLinks } from "@/content/site";

const sectionIds = new Set(["#home", "#courses", "#aboutus", "#team", "#contactus"]);

describe("site content links", () => {
  it("does not contain placeholder links", () => {
    for (const link of [...navLinks, ...footerLinks]) {
      expect(link.href).not.toBe("#");
    }
  });

  it("points every in-page link at a section that exists", () => {
    for (const link of [...navLinks, ...footerLinks]) {
      expect(sectionIds.has(link.href)).toBe(true);
    }
  });

  it("exposes only dialable phone links", () => {
    expect(contact.phones.length).toBeGreaterThan(0);
    for (const phone of contact.phones) {
      expect(phone.href).toMatch(/^tel:\+880\d{9,10}$/);
    }
  });

  it("exposes only valid mailto links", () => {
    expect(contact.emails.length).toBeGreaterThan(0);
    for (const email of contact.emails) {
      expect(email.href).toMatch(/^mailto:[^@\s]+@[^@\s]+$/);
    }
  });
});
