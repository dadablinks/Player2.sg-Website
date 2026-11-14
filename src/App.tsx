import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Gamepad2,
  Menu,
  Pause,
  Play,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";

const tikTok = "https://www.tiktok.com/@player2.sg";
const contact =
  "https://wa.me/6581168100?text=Hello%20Player2%2C%20I%20have%20an%20idea%20to%20explore.";
const projects = [
  {
    id: "fuwa",
    category: "Play",
    title: "Fuwa",
    type: "A shared pixel world",
    image: "/assets/fuwa-hall.jpg",
    status: "Ongoing",
    intro: "What if a browser could be a place to slow down?",
    body: "A small temple, a few familiar faces and a moment away from the noise. Fuwa is my experiment in building a shared world with Godot, AI-assisted development and a lot of iteration.",
    learned:
      "The interesting part is making it feel alive: movement, music, shared moments and the little details between them.",
    url: "/fuwa/",
    action: "Enter the temple",
  },
  {
    id: "motion",
    category: "Watch",
    title: "A little more motion",
    type: "Video & creative coding",
    image: "/assets/reel-poster.jpg",
    status: "Experiment",
    intro: "Could code give a video its own rhythm?",
    body: "An exploration of reusable motion graphics for property explainers. A spoken idea becomes a timed visual cue, a comparison or a carefully placed text moment. Built with Remotion and AI-assisted coding.",
    learned:
      "Good automation leaves room for judgment. The challenge is knowing what to emphasise, and when to leave the frame alone.",
    action: "Watch the experiment",
  },
  {
    id: "treasures",
    category: "Build",
    title: "Tiny Treasures",
    type: "From collection to website",
    image: "/assets/tinytreasures.jpg",
    status: "Live site",
    intro: "Small objects. A whole world to organise.",
    body: "A website for Tiny Treasures and its collectors. An ongoing exploration of how AI-assisted development can turn a real collection into a useful, welcoming online experience.",
    learned:
      "A real project needs more than a good first screen. The details, content and day-to-day upkeep matter just as much.",
    url: "https://tinytreasures.sg",
    action: "Visit Tiny Treasures",
  },
];
type Project = (typeof projects)[number];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function App() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [health, setHealth] = useState("Checking the temple");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.24],
    [0, reduced ? 0 : 130],
  );
  const heroRotate = useTransform(
    scrollYProgress,
    [0, 0.24],
    [0, reduced ? 0 : -3],
  );
  const privacy = window.location.pathname === "/privacy/";

  useEffect(() => {
    const controller = new AbortController();
    fetch("/fuwa/health", {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(7000)]),
      cache: "no-store",
    })
      .then(async (r) => {
        const d = await r.json();
        setHealth(
          r.ok && d.status === "ok" ? "Temple is online" : "Temple is resting",
        );
      })
      .catch(() => setHealth("Temple is resting"));
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (selected) {
      lastFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://player2.sg");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Player2 link", "https://player2.sg");
    }
  }

  return (
    <>
      <motion.div
        className="reading-line"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="header">
        <a href="/" className="wordmark" aria-label="Player2 home">
          player2<span className="logo-spark">✳</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/#experiments">The experiments</a>
          <a href="/#about">The person</a>
          <a href={tikTok} target="_blank" rel="noreferrer">
            The TikToks <ArrowUpRight size={14} />
          </a>
        </nav>
        <a className="header-contact" href="/#contact">
          Have a little idea?{" "}
          <span>
            <ArrowUpRight size={18} />
          </span>
        </a>
        <button
          className="menu-toggle icon-button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <a href="/#experiments" onClick={() => setMenu(false)}>
              The experiments <ArrowUpRight />
            </a>
            <a href="/#about" onClick={() => setMenu(false)}>
              The person <ArrowUpRight />
            </a>
            <a href={tikTok} target="_blank" rel="noreferrer">
              The TikToks <ArrowUpRight />
            </a>
            <a href="/#contact" onClick={() => setMenu(false)}>
              Say hello <ArrowUpRight />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
      {privacy ? (
        <main className="privacy">
          <p className="eyebrow">THE SMALL PRINT</p>
          <h1>A little privacy.</h1>
          <p>
            This is a personal showcase. The homepage does not use advertising
            trackers or load TikTok embeds. Videos here are hosted with the
            site. Visiting an external link takes you to that service and its
            privacy policy.
          </p>
          <p>
            Cloudflare hosts and delivers the website and may process technical
            request information for security and delivery. Fuwa is a separate
            multiplayer experience; visitor names, room activity and offering
            state are handled by its game server. Contact messages sent through
            WhatsApp are handled by WhatsApp.
          </p>
          <p>
            Questions about the site or your information?{" "}
            <a href={contact}>Get in touch.</a>
          </p>
          <a className="line-link" href="/">
            Back to the experiments <ArrowRight />
          </a>
        </main>
      ) : (
        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-visual">
              <motion.img
                src="/assets/playground.webp"
                alt="A sculptural chrome number two, game controller and colourful objects in a red experimental studio"
                style={{ y: heroY, rotate: heroRotate }}
                fetchPriority="high"
              />
              <div className="hero-veil" />
            </div>
            <div className="hero-topline">
              <span className="eyebrow">
                <span className="signal" /> AN INDEPENDENT AI PLAYGROUND
              </span>
              <span className="edition">SINGAPORE / ALWAYS IN PROGRESS</span>
            </div>
            <div className="hero-content">
              <motion.h1
                id="hero-title"
                initial={{ opacity: 0, y: reduced ? 0 : 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85 }}
              >
                Player2<span className="hero-period">.</span>
              </motion.h1>
              <div className="hero-bottom">
                <div>
                  <p className="hero-tagline">
                    A little curiosity.
                    <br />A lot of experimenting with AI.
                  </p>
                  <a className="round-link" href="#experiments">
                    <span className="round-arrow">
                      <ArrowDown size={22} />
                    </span>
                    Come have a look
                  </a>
                </div>
                <p className="hero-aside">
                  Things I make.
                  <br />
                  Ideas I chase.
                  <br />
                  Occasionally, a happy accident.
                </p>
              </div>
            </div>
            <span className="hero-index">
              EXPERIMENT NO. 000 / STAY CURIOUS
            </span>
          </section>
          <section className="intro section-pad">
            <Reveal className="intro-grid">
              <p className="eyebrow">
                <span className="mini-cross">+</span> NO BIG MASTER PLAN
              </p>
              <div>
                <h2>
                  Mostly curiosity.
                  <br />
                  Sometimes, <span className="serif">something useful.</span>
                </h2>
                <div className="intro-lower">
                  <ArrowDownLeft size={44} strokeWidth={1} />
                  <p>
                    Player2 is where I share what I’ve been making, learning and
                    occasionally getting carried away with. A game one day. A
                    video the next. A tool that probably started with “what if?”
                  </p>
                </div>
              </div>
            </Reveal>
          </section>
          <section
            className="featured section-pad"
            aria-labelledby="fuwa-heading"
          >
            <div className="section-label">
              <span className="eyebrow">01 / CURRENT RABBIT HOLE</span>
              <span className="small-type">A WORLD WORTH WANDERING INTO</span>
            </div>
            <Reveal className="fuwa-stage">
              <img
                src="/assets/fuwa-hall.jpg"
                alt="The lantern-lit hall inside Fuwa's pixel temple"
                loading="lazy"
              />
              <div className="fuwa-overlay" />
              <div className="fuwa-top">
                <span className="stamp">PLAYABLE EXPERIMENT</span>
                <span className="live-status">
                  <span
                    className={
                      health === "Temple is online" ? "signal" : "signal muted"
                    }
                  />
                  {health}
                </span>
              </div>
              <div className="fuwa-caption">
                <div>
                  <span className="eyebrow">A SMALL PLACE TO SLOW DOWN</span>
                  <h2 id="fuwa-heading">
                    Fuwa<span>福</span>
                  </h2>
                  <p>
                    A pixel temple. A shared moment.
                    <br />
                    And a slightly ambitious side project.
                  </p>
                </div>
                <a className="fuwa-enter" href="/fuwa/" aria-label="Enter Fuwa">
                  <ArrowUpRight size={38} strokeWidth={1.4} />
                  <span>Step inside</span>
                </a>
              </div>
            </Reveal>
            <div className="feature-foot">
              <span>
                <Gamepad2 size={16} /> Godot · Shared world · Browser
              </span>
              <button
                className="bare-link"
                onClick={() => setSelected(projects[0])}
              >
                The story behind it <ArrowUpRight size={16} />
              </button>
            </div>
          </section>
          <section className="projects section-pad" id="experiments">
            <div className="section-label">
              <span className="eyebrow">
                02 / OUT OF MY HEAD, INTO THE WORLD
              </span>
              <span className="small-type">SELECTED EXPERIMENTS</span>
            </div>
            <div className="projects-heading">
              <h2>
                A few things
                <br />I got <span className="serif">carried away with.</span>
              </h2>
              <div
                className="filters"
                role="group"
                aria-label="Filter projects"
              >
                {["All", "Play", "Watch", "Build"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                  >
                    {f}
                    {filter === f && <span className="filter-dot" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="project-grid">
              {projects
                .filter((p) => filter === "All" || p.category === filter)
                .map((p) => (
                  <Reveal key={p.id} className={`project project-${p.id}`}>
                    <button
                      className="project-image"
                      onClick={() => setSelected(p)}
                      aria-label={`Explore ${p.title}`}
                    >
                      <img src={p.image} alt={p.type} loading="lazy" />
                      <span className="project-tag">
                        {p.category} / {p.status}
                      </span>
                      <span className="project-arrow">
                        <ArrowUpRight size={25} />
                      </span>
                      {p.id === "motion" && (
                        <span className="play-disc">
                          <Play size={32} fill="currentColor" />
                        </span>
                      )}
                    </button>
                    <div className="project-caption">
                      <span className="project-number">
                        0{projects.indexOf(p) + 1}
                      </span>
                      <div>
                        <h3>
                          <button onClick={() => setSelected(p)}>
                            {p.title}
                          </button>
                        </h3>
                        <p>{p.type}</p>
                      </div>
                      <ArrowUpRight size={18} />
                    </div>
                  </Reveal>
                ))}
            </div>
          </section>
          <section className="play-section section-pad" id="playground">
            <div className="section-label">
              <span className="eyebrow">03 / YOUR TURN</span>
              <span className="small-type">A TINY COLOUR EXPERIMENT</span>
            </div>
            <div className="play-heading">
              <h2>
                What if we just
                <br />
                <span className="serif">played a little?</span>
              </h2>
              <p>
                No brief. No deliverables.
                <br />
                Just a small detour.
              </p>
            </div>
            <ColourPlayground />
          </section>
          <section className="feed section-pad" id="tiktok">
            <div className="section-label">
              <span className="eyebrow">04 / THE SMALL-SCREEN CHAPTER</span>
              <a
                href={tikTok}
                target="_blank"
                rel="noreferrer"
                className="bare-link"
              >
                @player2.sg <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="feed-grid">
              <Reveal className="feed-copy">
                <span className="scribble">less polished. more process.</span>
                <h2>
                  The experiment
                  <br />
                  doesn’t end
                  <br />
                  <span className="serif">at the website.</span>
                </h2>
                <p>
                  There’s another side to Player2 on TikTok. Shorter stories,
                  moving pictures and a little more of the work along the way.
                </p>
                <a
                  className="dark-button"
                  href={tikTok}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find me on TikTok <ArrowUpRight size={20} />
                </a>
                <span className="feed-note">
                  COME FOR A LOOK. STAY FOR THE NEXT “WHAT IF?”
                </span>
              </Reveal>
              <Reveal className="video-composition">
                <span className="video-margin">REAL WORK / A MOTION STUDY</span>
                <div className="video-frame">
                  <video
                    ref={video}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/assets/reel-poster.jpg"
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                  >
                    <source src="/assets/reel-preview.mp4" type="video/mp4" />
                  </video>
                  <button
                    className="video-control"
                    aria-label={
                      videoPlaying
                        ? "Pause motion preview"
                        : "Play motion preview"
                    }
                    onClick={() => {
                      if (video.current?.paused) void video.current.play();
                      else video.current?.pause();
                    }}
                  >
                    {videoPlaying ? <Pause size={23} /> : <Play size={23} />}
                  </button>
                </div>
                <div className="video-sticker">
                  <Sparkles size={22} />
                  <span>
                    Made with curiosity.
                    <br />
                    And a few iterations.
                  </span>
                </div>
              </Reveal>
            </div>
          </section>
          <section className="about section-pad" id="about">
            <div className="section-label">
              <span className="eyebrow">
                05 / THE PERSON BEHIND THE PROMPTS
              </span>
              <span className="small-type">
                HUMAN CURIOSITY. AI POSSIBILITIES.
              </span>
            </div>
            <Reveal className="about-grid">
              <div className="about-art" aria-hidden="true">
                <span className="about-asterisk">✳</span>
                <span className="about-art-label">
                  STILL FIGURING
                  <br />
                  THINGS OUT.
                </span>
                <span className="about-coordinate">1 HUMAN / MANY TABS</span>
              </div>
              <div className="about-copy">
                <h2>
                  I like seeing
                  <br />
                  <span className="serif">where an idea goes.</span>
                </h2>
                <p>Especially when I don’t quite know how to build it yet.</p>
                <p>
                  AI has made that gap a lot more interesting. I can follow an
                  idea into a game, a video, a website or a tool, and learn
                  something along the way.
                </p>
                <p>
                  This isn’t a catalogue of perfect answers. It’s a growing
                  collection of things I’ve tried, things I’ve made and things
                  I’m still working out.
                </p>
                <div className="signature">
                  The person behind Player2 <ArrowDownLeft size={23} />
                </div>
              </div>
            </Reveal>
          </section>
          <section className="contact section-pad" id="contact">
            <span className="eyebrow">
              SOME EXPERIMENTS FIND THEIR WAY INTO THE REAL WORLD.
            </span>
            <Reveal>
              <h2>
                Got a little
                <br />
                <span className="serif">“what if”?</span>
                <span className="contact-spark">✳</span>
              </h2>
              <div className="contact-bottom">
                <p>
                  Have an idea for your business?
                  <br />
                  Let’s see where it could go.
                </p>
                <a
                  className="contact-link"
                  href={contact}
                  target="_blank"
                  rel="noreferrer"
                >
                  Let’s talk{" "}
                  <span>
                    <ArrowUpRight size={34} />
                  </span>
                </a>
              </div>
            </Reveal>
          </section>
        </main>
      )}
      <footer>
        <div className="footer-top">
          <a className="wordmark" href="/">
            player2<span className="logo-spark">✳</span>
          </a>
          <p>
            A passion project.
            <br />
            An ongoing experiment.
          </p>
          <a href="/fuwa/">
            Visit Fuwa <ArrowUpRight size={15} />
          </a>
          <a href={tikTok} target="_blank" rel="noreferrer">
            TikTok <ArrowUpRight size={15} />
          </a>
          <button onClick={copyLink} className="bare-link">
            {copied ? "Link copied" : "Pass it on"}{" "}
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Player2.sg</span>
          <span>MADE IN SINGAPORE. STILL IN PROGRESS.</span>
          <a href="/privacy/">Privacy</a>
          <a href="#" aria-label="Back to top">
            Back to top ↑
          </a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="project-dialog"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="project-title"
      >
        <button
          autoFocus
          className="dialog-close icon-button"
          aria-label="Close project"
          onClick={() => setSelected(null)}
        >
          <X />
        </button>
        {selected && (
          <div className="dialog-content">
            <p className="eyebrow">
              {selected.category.toUpperCase()} /{" "}
              {selected.status.toUpperCase()}
            </p>
            <h2 id="project-title">{selected.title}</h2>
            {selected.id === "motion" ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={selected.image}
                src="/assets/reel-preview.mp4"
              />
            ) : (
              <img src={selected.image} alt={selected.type} />
            )}
            <h3>{selected.intro}</h3>
            <p>{selected.body}</p>
            <p>{selected.learned}</p>
            {selected.url && (
              <a
                className="dark-button"
                href={selected.url}
                target={selected.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {selected.action} <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

const palettes = [
  {
    name: "After hours",
    colors: ["#f24c32", "#c5f36b", "#eadcf5", "#f7f7f2", "#242422"],
  },
  {
    name: "Electric garden",
    colors: ["#166343", "#cefa78", "#f6b8c7", "#f8ef51", "#fbfaf5"],
  },
  {
    name: "Daydream",
    colors: ["#8259db", "#ffc4a7", "#e5ff9a", "#f8f7f4", "#33323a"],
  },
];
function ColourPlayground() {
  const [palette, setPalette] = useState(0);
  const [seed, setSeed] = useState(4);
  const [hover, setHover] = useState(-1);
  return (
    <div className="colour-tool">
      <div className="colour-toolbar">
        <span>
          <Sparkles size={15} /> HAPPY ACCIDENT NO.{" "}
          {String(seed).padStart(3, "0")}
        </span>
        <div>
          <div
            className="palette-options"
            role="group"
            aria-label="Colour palette"
          >
            {palettes.map((p, i) => (
              <button
                key={p.name}
                title={p.name}
                aria-label={p.name}
                aria-pressed={palette === i}
                style={{ background: p.colors[0] }}
                onClick={() => setPalette(i)}
              >
                {palette === i && <Check size={14} />}
              </button>
            ))}
          </div>
          <button
            className="icon-button"
            title="Shuffle composition"
            aria-label="Shuffle composition"
            onClick={() => setSeed((s) => s + 1)}
          >
            <Shuffle size={19} />
          </button>
        </div>
      </div>
      <div className="colour-grid" onPointerLeave={() => setHover(-1)}>
        {Array.from({ length: 48 }, (_, i) => {
          const n = (i * 17 + seed * 23 + Math.floor(i / 8) * seed) % 5;
          return (
            <button
              key={i}
              tabIndex={i === 0 ? 0 : -1}
              aria-label={`Change tile ${i + 1}`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => setSeed((s) => s + 1)}
              style={{
                backgroundColor:
                  palettes[palette].colors[(n + (hover === i ? 1 : 0)) % 5],
                color: palettes[palette].colors[(n + 2) % 5],
              }}
            >
              <span
                className={`tile-shape shape-${(i + seed) % 4}`}
                style={{
                  transform: `rotate(${((seed + i) % 4) * 90 + (hover === i ? 90 : 0)}deg)`,
                }}
              >
                {(i + seed) % 7 === 0 ? "✳" : (i + seed) % 9 === 0 ? "2" : ""}
              </span>
            </button>
          );
        })}
      </div>
      <div className="colour-bottom">
        <span>NO RIGHT ANSWER. THAT’S THE POINT.</span>
        <span>
          {palettes[palette].name} <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
