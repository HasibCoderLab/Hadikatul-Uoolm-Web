import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { Location } from "@/components/site/location";
import { Programs } from "@/components/site/programs";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Stats } from "@/components/site/stats";
import { Team } from "@/components/site/team";
import { WhyUs } from "@/components/site/why-us";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Stats />
        <Programs />
        <WhyUs />
        <Team />
        <Contact />
        <Location />
      </main>
      <SiteFooter />
    </>
  );
}
