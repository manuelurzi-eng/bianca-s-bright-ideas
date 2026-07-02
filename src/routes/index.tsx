import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/bianca-hero.jpg";
import work1 from "@/assets/bianca-work-1.jpg";
import work2 from "@/assets/bianca-work-2.jpg";
import work3 from "@/assets/bianca-work-3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://id-preview--7e5d5d56-1ffd-423d-8f06-6f21c802f7bb.lovable.app/og.jpg" },
    ],
  }),
});

const projects = [
  { n: "01", title: "Maison Argile", tag: "Identity · 2025", img: work1, desc: "A ceramics atelier in Provence — wordmark, packaging, and a slow-burn launch campaign." },
  { n: "02", title: "Casa Lumen", tag: "Art Direction · 2024", img: work2, desc: "Interior styling and print collateral for a boutique guesthouse in Lisbon." },
  { n: "03", title: "Reed & Ivory", tag: "Brand · 2024", img: work3, desc: "Type-led identity for an independent stationery house in Copenhagen." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-5 flex items-center justify-between">
          <a href="#top" className="font-serif text-xl tracking-tight">Bianca<span className="text-accent">.</span></a>
          <nav className="hidden md:flex gap-10 eyebrow text-muted-foreground">
            <a href="#work" className="hover:text-foreground transition">Work</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#journal" className="hover:text-foreground transition">Journal</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <a href="#contact" className="eyebrow px-4 py-2 rounded-full border border-foreground/80 hover:bg-foreground hover:text-background transition">
            Say hello
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7 animate-rise">
            <p className="eyebrow text-muted-foreground mb-8">Portfolio — Est. 2018 · Milan / Remote</p>
            <h1 className="text-display text-[13vw] md:text-[9vw] lg:text-[8.2vw] text-foreground">
              Warm, quiet<br />
              <span className="italic text-accent">design</span> for<br />
              patient brands.
            </h1>
            <p className="mt-10 max-w-md text-lg text-muted-foreground leading-relaxed">
              I&rsquo;m Bianca — an independent designer and art director shaping
              identities, editorial, and interiors for makers who prefer craft
              to noise.
            </p>
          </div>
          <div className="lg:col-span-5 animate-rise" style={{ animationDelay: "150ms" }}>
            <div className="relative">
              <img
                src={heroImg}
                alt="Portrait of Bianca in warm afternoon light"
                width={1280}
                height={1600}
                className="w-full h-[62vh] md:h-[72vh] object-cover rounded-sm shadow-2xl shadow-foreground/10"
              />
              <div className="absolute -bottom-6 -left-6 bg-background border border-border px-5 py-4 shadow-lg">
                <p className="eyebrow text-muted-foreground">Now booking</p>
                <p className="font-serif text-lg mt-1">Autumn &rsquo;26</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border/70 py-6 overflow-hidden bg-card/40">
        <div className="flex gap-16 animate-marquee whitespace-nowrap font-serif text-2xl md:text-4xl text-muted-foreground italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 shrink-0 pr-16">
              <span>Brand Identity</span><span className="text-accent">✦</span>
              <span>Art Direction</span><span className="text-accent">✦</span>
              <span>Editorial</span><span className="text-accent">✦</span>
              <span>Packaging</span><span className="text-accent">✦</span>
              <span>Interior Styling</span><span className="text-accent">✦</span>
              <span>Type Design</span><span className="text-accent">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex items-end justify-between mb-16 md:mb-24">
            <div>
              <p className="eyebrow text-accent mb-4">Selected Work</p>
              <h2 className="text-display text-5xl md:text-7xl max-w-2xl">Projects made slowly, with intention.</h2>
            </div>
            <a href="#" className="hidden md:inline eyebrow text-muted-foreground hover:text-foreground">Full archive →</a>
          </div>

          <div className="space-y-24 md:space-y-32">
            {projects.map((p, i) => (
              <article key={p.n} className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${i % 2 ? "md:[&>figure]:order-2" : ""}`}>
                <figure className="md:col-span-7 group overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="w-full h-[70vh] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </figure>
                <div className="md:col-span-5">
                  <p className="eyebrow text-muted-foreground mb-6">{p.n} — {p.tag}</p>
                  <h3 className="font-serif text-4xl md:text-5xl leading-tight">{p.title}</h3>
                  <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">{p.desc}</p>
                  <a href="#" className="mt-8 inline-flex items-center gap-3 font-serif italic text-lg group/link">
                    <span className="border-b border-foreground/40 group-hover/link:border-accent transition">View case study</span>
                    <span className="text-accent transition-transform group-hover/link:translate-x-1">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 md:py-36 bg-card/50 border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-accent mb-4">About</p>
            <h2 className="text-display text-5xl md:text-6xl">A studio of one.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p className="text-foreground font-serif text-2xl md:text-3xl leading-snug italic">
              &ldquo;I believe the best design leaves a room feeling like the light just changed.&rdquo;
            </p>
            <p>
              Trained at ISIA Urbino and formerly of Studio Fabrica in Milan, I work
              directly with founders and small teams — no account managers, no
              decks-about-decks. Every project passes through my hands from
              first sketch to final proof.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                <p className="font-serif text-4xl text-foreground">08</p>
                <p className="eyebrow mt-2">Years independent</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-foreground">42</p>
                <p className="eyebrow mt-2">Brands shaped</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section id="journal" className="py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow text-accent mb-4">Journal</p>
          <h2 className="text-display text-5xl md:text-6xl mb-16 max-w-2xl">Notes from the studio.</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              { d: "May 2026", t: "On the discipline of the quiet mark.", r: "6 min read" },
              { d: "Mar 2026", t: "Why I still specify paper stock in person.", r: "4 min read" },
              { d: "Jan 2026", t: "Building a client list that outlives the trend.", r: "8 min read" },
            ].map((post) => (
              <a href="#" key={post.t} className="group block border-t border-foreground/80 pt-6">
                <p className="eyebrow text-muted-foreground">{post.d} · {post.r}</p>
                <h3 className="font-serif text-2xl md:text-3xl mt-4 leading-snug group-hover:text-accent transition">{post.t}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-foreground text-background py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow text-accent mb-6">Contact</p>
          <h2 className="text-display text-[12vw] md:text-[8vw] leading-[0.9]">
            Let&rsquo;s make<br />something <span className="italic text-accent">honest.</span>
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-12 border-t border-background/20 pt-10">
            <div>
              <p className="eyebrow text-background/50 mb-3">Email</p>
              <a href="mailto:studio@bianca.co" className="font-serif text-2xl hover:text-accent transition">studio@bianca.co</a>
            </div>
            <div>
              <p className="eyebrow text-background/50 mb-3">Studio</p>
              <p className="font-serif text-2xl">Via Savona 12<br />Milano, IT</p>
            </div>
            <div>
              <p className="eyebrow text-background/50 mb-3">Elsewhere</p>
              <div className="flex flex-col gap-2 font-serif text-2xl">
                <a href="#" className="hover:text-accent transition">Instagram</a>
                <a href="#" className="hover:text-accent transition">Are.na</a>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col md:flex-row justify-between gap-4 text-background/50 eyebrow">
            <p>© 2026 Bianca Studio</p>
            <p>Made slowly, in Milano.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
