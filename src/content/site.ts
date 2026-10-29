export type SectionLink = Readonly<{ href: `#${string}`; label: string }>;
export type ContactLink = Readonly<{ label: string; href: `tel:${string}` | `mailto:${string}` }>;

export const site = {
  name: "হাদিকাতুল উলুম",
  tagline: "বেড়ে ওঠো আমাদের সাথে ।",
  description:
    "চাঁপাইনবাবগঞ্জের ইসলামিক কোচিং সেন্টার — ক্লাস ৩-১২, এসএসসি, এইচএসসি ও অন্যান্য প্রোগ্রামে অভিজ্ঞ মেন্টরদের গাইডলাইন।",
} as const;

/* Every entry below resolves to a section that exists on the page.
   The legacy "আপডেট" / "সকল কোর্স" entries were dropped rather than kept as
   `href="#"` dead links (see docs/DESIGN_AUDIT.md §2 and the no-dead-link rule). */
export const navLinks: readonly SectionLink[] = [
  { href: "#home", label: "হোম" },
  { href: "#courses", label: "একাডেমিক প্রোগ্রাম" },
  { href: "#aboutus", label: "আমাদের সম্পর্কে" },
  { href: "#team", label: "আমাদের টিম" },
  { href: "#contactus", label: "যোগাযোগ" },
];

export const footerLinks: readonly SectionLink[] = [
  { href: "#courses", label: "একাডেমিক প্রোগ্রাম" },
  { href: "#aboutus", label: "আমাদের সম্পর্কে" },
  { href: "#team", label: "আমাদের টিম" },
  { href: "#contactus", label: "যোগাযোগ" },
];

export const contact = {
  emails: [
    { label: "hadikatulatfal@gmail.com", href: "mailto:hadikatulatfal@gmail.com" },
    { label: "abdulzolil1900@gmail.com", href: "mailto:abdulzolil1900@gmail.com" },
  ] satisfies readonly ContactLink[],
  phones: [
    { label: "+ 88 01770291584", href: "tel:+8801770291584" },
    { label: "+ 88 01644657547", href: "tel:+8801644657547" },
  ] satisfies readonly ContactLink[],
  hours: "সকাল ৯ টা - রাত ১০ টা",
  address: "ধান্নুর মোড়, আরামবাগ, চাঁপাইনবাবগঞ্জ ।",
  addressLong: "৭৪৪ ধানুর মোড়, আরামবাগ, চাঁপাইনবাবগঞ্জ",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.0102939164553!2d88.26510027413086!3d24.58884095607482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbb71719bb86b1%3A0xf39413e8b0f76c17!2z4Kan4Ka-4Kao4KeN4Kao4KeB4KawIOCmruCni-CmoeCmvA!5e0!3m2!1sen!2sbd!4v1727011609235!5m2!1sen!2sbd",
} as const;

export const hero = {
  eyebrow: "হাদিকাতুল উলুম .",
  titleLead: "চাঁপাইনবাবগঞ্জের সেরা",
  titleTail: "ইসলামিক কোচিং সেন্টার ।",
  sublines: [
    "নিজের শেখা নিজেই গুছিয়ে নেয়ার যাত্রা শুরু হোক হাদিকাতুল উলুম এর সাথে ।",
    "দেশের সেরা মেন্টরদের গাইডলাইনের সহায়তায় সহজেই শিখে ক্লাসে-পরীক্ষায় এগিয়ে যাও ।",
  ],
  cta: "একাডেমিক প্রোগ্রাম দেখো",
  image: "/assets/images/mashid.jpg",
} as const;

export const stats = [
  { value: "২ শত +", label: "শিক্ষার্থী", tone: "brand" },
  { value: "২০ জন+", label: "অভিজ্ঞ মেন্টর", tone: "blue" },
  { value: "৫ বছর+", label: "এক্সপেরিয়েন্স", tone: "coral" },
  { value: "১০ টি+", label: "অফলাইন ক্লাস", tone: "gold" },
] as const;

export type Program = Readonly<{
  title: string;
  subtitle: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
}>;

export const programs: readonly Program[] = [
  {
    title: "ক্লাস ৩-১২",
    subtitle: "অফলাইন কোচিং",
    icon: "/assets/svgs/three.svg",
    iconWidth: 80,
    iconHeight: 80,
  },
  {
    title: "এসএসসি",
    subtitle: "অফলাইন কোচিং",
    icon: "/assets/svgs/ssc.svg",
    iconWidth: 80,
    iconHeight: 80,
  },
  {
    title: "এইচএসসি",
    subtitle: "অফলাইন কোচিং",
    icon: "/assets/svgs/hsc.svg",
    iconWidth: 80,
    iconHeight: 80,
  },
  {
    title: "অন্যান্য",
    subtitle: "অফলাইন ক্লাস",
    icon: "/assets/svgs/others.svg",
    iconWidth: 80,
    iconHeight: 80,
  },
];

export const whyUs = {
  image: "/assets/images/classroom.jpg",
  paragraphs: [
    "Hadikatul Ulum, ২০১৯ সালে প্রতিষ্ঠিত বাংলাদেশের সর্বাধুনিক শিক্ষা প্রযুক্তি প্রতিষ্ঠান। দেশজুড়ে সবার জন্য মানসম্মত পড়াশোনা নিশ্চিত করতে অভিজ্ঞ মেন্টর এবং অত্যাধুনিক প্রযুক্তির সাহায্যে আমরা গড়ে তুলেছি সহজে শেখার এবং সহজে জেতার এক নতুন দুনিয়া!",
    "তথ্য ও প্রযুক্তি আমাদের দৈনন্দিন জীবনের গুরুত্বপূর্ণ অংশ হয়ে গেছে, কিন্তু শিক্ষা ক্ষেত্রে এখনও গতানুগতিক ধারাটিই রয়ে গেছে। মনে করে বাংলাদেশের শিক্ষা ক্ষেত্রে প্রযুক্তির বিপ্লব ঘটানোর এখনই উপযুক্ত সময়।",
  ],
} as const;

export const team = [
  {
    name: "আব্দুল জলিল",
    role: "পরিচালক, আরবি ব্যাকরণ এবং ইংরেজি ব্যাকরণ বিশেষজ্ঞ",
  },
  {
    name: "রেজাউল করিম",
    role: "উপদেষ্টা, আরবি ব্যাকরণ এবং ইংরেজি ব্যাকরণ বিশেষজ্ঞ",
  },
  {
    name: "মোহাম্মদ আহাদুল্লাহ",
    role: "ভাষা এবং পদার্থ বিজ্ঞান বিশেষজ্ঞ",
  },
  {
    name: "মোজাহিদ ইসলাম",
    role: "রসায়ন বিশেষজ্ঞ",
  },
] as const;
