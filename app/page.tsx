import Hero from "@/components/hero/Hero";
import Craftsmanship from "@/components/craftsmanship/Craftsmanship";
import Footer from "@/components/footer/Footer";

const PLACEHOLDERS = [
  {
    id: "collection",
    index: "01",
    title: "The Collection",
    line: "Rings · Necklaces · Bracelets · Earrings",
  },
  {
    id: "story",
    index: "02",
    title: "The Story",
    line: "Born from craft. Defined by detail.",
  },
  {
    id: "gallery",
    index: "03",
    title: "Gallery",
    line: "An editorial study in light and form.",
  },
  {
    id: "contact",
    index: "04",
    title: "Contact",
    line: "Create something timeless.",
  },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <Craftsmanship />

      {PLACEHOLDERS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex min-h-[70vh] flex-col items-center justify-center border-t border-line bg-ink px-6 text-center"
        >
          <p className="eyebrow text-gold">{section.index}</p>
          <h2 className="font-display text-ivory mt-6 leading-[1.02] text-[clamp(2.25rem,6vw,5rem)]">
            {section.title}
          </h2>
          <p className="mt-6 text-sm tracking-[0.2em] uppercase text-mist">
            {section.line}
          </p>
        </section>
      ))}

      <Footer />
    </main>
  );
}
