import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Architecture } from "@/components/architecture";
import { Contact } from "@/components/contact";
import { StructuredData } from "@/components/structured-data";

export default function Page() {
  return (
    <>
      <StructuredData >
      <main>
        <Nav />
        <Hero />
        <Projects />
        <Architecture />
        <Contact />
      </main>
    </>
  );
}
