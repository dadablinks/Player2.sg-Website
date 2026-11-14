import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Gamepad2,
  Menu,
  X,
} from "lucide-react";

const tiktok = "https://www.tiktok.com/@player2.sg";
const contact =
  "https://wa.me/6581168100?text=Hello%20Player2%2C%20I%20have%20an%20idea%20to%20explore.";
const projects = [
  {
    id: "fuwa",
    category: "Play",
    title: "FUWA",
    subtitle: "A shared pixel world",
    image: "/assets/fuwa-hall.jpg",
    tag: "GODOT / MULTIPLAYER",
    url: "/fuwa/",
    action: "Enter Fuwa",
    description:
      "A browser-based temple built around exploration and shared moments. An ongoing experiment in game development, multiplayer systems and AI-assisted creation.",
    lesson:
      "Building a world means getting the small things right: movement, atmosphere, sound and the feeling of sharing a space.",
  },
  {
    id: "treasures",
    category: "Build",
    title: "TINY TREASURES",
    subtitle: "A collection, brought online",
    image: "/assets/tinytreasures.jpg",
    tag: "WEB / REAL-WORLD PROJECT",
    url: "https://tinytreasures.sg",
    action: "Visit the website",
    description:
      "An online home for Tiny Treasures and its collectors. An exploration of how AI-assisted development can turn a real collection into a useful digital experience.",
    lesson:
      "The test is whether something works beyond its first impression. Content, clarity and everyday usefulness matter.",
  },
];
type Project = (typeof projects)[number];
function Wordmark() {
  return (
    <>
      <span className="matrix-player">Player</span>
      <span className="matrix-two">2</span>
      <span className="matrix-domain">.sg</span>
    </>
  );
}
function MatrixRain() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      visible = true;
    let drops: number[] = [];
    const glyphs = "0123456789PLAYER2SG";
    function resize() {
      const bounds = element!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      element!.width = width * ratio;
      element!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array.from(
        { length: Math.ceil(width / 25) },
        () => (Math.random() * height) / 21,
      );
      context!.clearRect(0, 0, width, height);
      paint();
    }
    function paint() {
      context!.fillStyle = "rgba(0, 8, 2, .09)";
      context!.fillRect(0, 0, width, height);
      context!.font = "13px monospace";
      drops.forEach((drop, i) => {
        context!.fillStyle = i % 5 === 0 ? "#b5ffc6" : "#26ae4d";
        context!.fillText(
          glyphs[Math.floor(Math.random() * glyphs.length)],
          i * 25,
          drop * 21,
        );
        drops[i] =
          drop * 21 > height && Math.random() > 0.97
            ? -Math.random() * 20
            : drop + 0.38;
      });
    }
    function tick(time: number) {
      if (!visible || document.hidden || reduced) {
        frame = 0;
        return;
      }
      if (time - last > 50) {
        paint();
        last = time;
      }
      frame = requestAnimationFrame(tick);
    }
    function resume() {
      if (!frame && visible && !document.hidden && !reduced)
        frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else resume();
    });
    intersection.observe(element);
    document.addEventListener("visibilitychange", resume);
    resize();
    resume();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };
  }, [reduced]);
  return <canvas ref={canvas} className="matrix-rain" aria-hidden="true" />;
}
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
      initial={{ opacity: 0, y: reduced ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
export function App() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const pointerX = useMotionValue(0);
  const sceneX = useSpring(pointerX, { stiffness: 65, damping: 25 });
  const sceneY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0, reduced ? 0 : 110],
  );
  const privacy = window.location.pathname.startsWith("/privacy");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/fuwa/health", {
      cache: "no-store",
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(7000)]),
    })
      .then(async (r) => {
        const d = await r.json();
        setOnline(r.ok && d.status === "ok");
      })
      .catch(() => setOnline(false));
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (selected) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  useEffect(() => {
    if (!menu) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menu]);
  async function copy() {
    try {
      await navigator.clipboard.writeText("https://player2.sg");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Player2 link", "https://player2.sg");
    }
  }
  const status =
    online === null
      ? "CHECKING SERVER"
      : online
        ? "SERVER ONLINE"
        : "SERVER OFFLINE";
  return (
    <>
      <motion.div
        className="reading-line"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="header">
        <a className="brand" href="/" aria-label="Player2 home">
          <Wordmark />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/#projects">Projects</a>
          <a href="/#approach">The approach</a>
          <a href={tiktok} target="_blank" rel="noreferrer">
            TikTok <ArrowUpRight size={13} />
          </a>
        </nav>
        <a className="header-play" href="/fuwa/">
          PLAY FUWA <ArrowUpRight size={16} />
        </a>
        <button
          className="icon-button menu-button"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {[
              ["Projects", "/#projects"],
              ["The approach", "/#approach"],
              ["About", "/#about"],
              ["TikTok", tiktok],
            ].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenu(false)}>
                {label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      {privacy ? (
        <main className="privacy">
          <span className="eyebrow">PLAYER2 / PRIVACY</span>
          <h1>THE SMALL PRINT.</h1>
          <p>
            This personal showcase does not use advertising trackers or load
            social media embeds. External links take you to the named service
            and its privacy policy.
          </p>
          <p>
            Cloudflare delivers and protects the website and may process
            technical request information. Fuwa is a separate multiplayer
            experience; visitor names, rooms and offering state are handled by
            its game server. WhatsApp handles messages sent through the contact
            link.
          </p>
          <p>
            Questions about your information?{" "}
            <a href={contact}>Contact Player2.</a>
          </p>
          <a className="button" href="/">
            Back to Player2 <ArrowRight size={17} />
          </a>
        </main>
      ) : (
        <main>
          <section
            className="hero"
            onPointerMove={(e) => {
              if (reduced || e.pointerType !== "mouse") return;
              const bounds = e.currentTarget.getBoundingClientRect();
              pointerX.set(
                ((e.clientX - bounds.left) / bounds.width - 0.5) * -20,
              );
              e.currentTarget.style.setProperty(
                "--glow-power",
                String(
                  0.3 +
                    0.4 *
                      (1 -
                        Math.abs(
                          (e.clientX - bounds.left) / bounds.width - 0.3,
                        )),
                ),
              );
            }}
            onPointerLeave={(e) => {
              pointerX.set(0);
              e.currentTarget.style.removeProperty("--glow-power");
            }}
          >
            <motion.img
              className="hero-scene"
              src="/assets/fuwa-hall.jpg"
              alt="Fuwa's temple hall, a multiplayer world built with Godot"
              fetchPriority="high"
              style={{
                y: sceneY,
                x: reduced ? 0 : sceneX,
                scale: reduced ? 1 : 1.035,
              }}
            />
            <div className="hero-shade" />
            <MatrixRain />
            <div className="hero-scan" aria-hidden="true" />
            <div className="hero-layout">
              <div className="hero-label">
                <span className="red-rule" /> INDEPENDENT MIND. OPEN
                POSSIBILITIES.
              </div>
              <motion.div
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                <h1 aria-label="Player2.sg">
                  <Wordmark />
                </h1>
                <p className="hero-lead">
                  CURIOSITY IS
                  <br />
                  THE STARTING POINT.
                </p>
                <p className="hero-description">
                  A personal collection of AI experiments.
                  <br />
                  Games, digital worlds and ideas put to the test.
                </p>
                <div className="hero-actions">
                  <a className="button primary" href="#projects">
                    EXPLORE THE PROJECTS <ArrowDown size={17} />
                  </a>
                  <a className="hero-secondary" href="/fuwa/">
                    Enter Fuwa <ArrowUpRight size={17} />
                  </a>
                </div>
              </motion.div>
              <div className="hero-feature">
                <span className="eyebrow">FEATURED WORLD / 001</span>
                <span className="hero-feature-name">FUWA</span>
                <span className="hero-feature-caption">
                  A shared pixel world.
                </span>
              </div>
            </div>
            <div className="hero-bottom">
              <span className="status">
                <span
                  className={online ? "status-light live" : "status-light"}
                />{" "}
                FUWA / {status}
              </span>
              <span>BUILT IN SINGAPORE</span>
              <a href="#projects">
                SCROLL TO EXPLORE <ArrowDown size={12} />
              </a>
            </div>
          </section>
          <div className="activity-rail" aria-hidden="true">
            <div className="activity-track">
              {[0, 1].map((n) => (
                <span className="activity-group" key={n}>
                  <span>EXPERIMENT</span>
                  <i /> <span>BUILD</span>
                  <i />
                  <span>PLAY</span>
                  <i />
                  <span>REPEAT</span>
                  <i />
                  <span>Player2.sg</span>
                  <i />
                </span>
              ))}
            </div>
          </div>
          <section className="intro section-pad">
            <Reveal className="intro-layout">
              <span className="eyebrow section-index">01 / THE MINDSET</span>
              <h2>
                EXPERIMENT.
                <br />
                BUILD. <span className="muted-text">GO FURTHER.</span>
              </h2>
              <div className="intro-copy">
                <p>
                  I love experimenting with AI and seeing where an idea can go.
                </p>
                <p>
                  Player2 is where I share what I’ve been making, learning and
                  working out along the way. Some projects are useful. Others
                  start with a simple “what if?”
                </p>
                <a className="text-link" href="#about">
                  Behind Player2 <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          </section>
          <section className="projects section-pad" id="projects">
            <div className="section-top">
              <div>
                <span className="eyebrow section-index">
                  02 / SELECTED WORK
                </span>
                <h2>
                  THE PROJECTS<span className="red-text">.</span>
                </h2>
              </div>
              <div
                className="filters"
                role="group"
                aria-label="Filter projects"
              >
                {["All", "Play", "Build"].map((f) => (
                  <button
                    key={f}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    <span>{f === "All" ? "02" : "01"}</span>
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
                      aria-label={`Explore ${p.title}`}
                      onClick={() => setSelected(p)}
                    >
                      <img src={p.image} alt={p.subtitle} loading="lazy" />
                      <span className="image-corner">
                        <ArrowUpRight size={23} />
                      </span>
                      <span className="image-category">{p.tag}</span>
                    </button>
                    <div className="project-info">
                      <div>
                        <span className="project-index">
                          PROJECT / 00{projects.indexOf(p) + 1}
                        </span>
                        <h3>
                          <button onClick={() => setSelected(p)}>
                            {p.title}
                          </button>
                        </h3>
                        <p>{p.subtitle}</p>
                      </div>
                      <button
                        className="icon-button"
                        aria-label={`Read about ${p.title}`}
                        onClick={() => setSelected(p)}
                      >
                        <ArrowUpRight size={23} />
                      </button>
                    </div>
                    <div className="project-footer">
                      <span>
                        {p.category === "Play" ? (
                          <>
                            <span
                              className={
                                online ? "status-light live" : "status-light"
                              }
                            />
                            {status}
                          </>
                        ) : (
                          "LIVE WEBSITE"
                        )}
                      </span>
                      <a
                        href={p.url}
                        target={p.url.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {p.action}
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </Reveal>
                ))}
            </div>
          </section>
          <section className="fuwa-feature">
            <img
              src="/assets/fuwa-hall.jpg"
              alt="Explore the hall inside Fuwa"
              loading="lazy"
            />
            <div className="feature-shade" />
            <div className="feature-content">
              <span className="eyebrow">A WORLD BEYOND THE HOMEPAGE</span>
              <h2>
                STEP INTO
                <br />
                SOMETHING <span>DIFFERENT.</span>
              </h2>
              <p>
                A temple to explore. Other people to meet.
                <br />
                An ongoing experiment in shared experiences.
              </p>
              <a className="button primary" href="/fuwa/">
                <Gamepad2 size={18} /> ENTER FUWA <ArrowUpRight size={18} />
              </a>
            </div>
            <span className="feature-coordinate">
              PLAYER2 / FUWA / MULTIPLAYER
            </span>
          </section>
          <section className="approach section-pad" id="approach">
            <div className="section-top">
              <div>
                <span className="eyebrow section-index">03 / THE APPROACH</span>
                <h2>
                  NOT JUST A PROMPT.
                  <br />
                  <span className="muted-text">A PROCESS.</span>
                </h2>
              </div>
              <p className="section-aside">
                AI opens the door.
                <br />
                The work is in what comes next.
              </p>
            </div>
            <div className="process-list">
              {[
                [
                  "01",
                  "FOLLOW THE QUESTION",
                  "Start with something worth exploring. A problem, a possibility or an idea that won’t leave me alone.",
                ],
                [
                  "02",
                  "BUILD. TEST. REPEAT.",
                  "Use AI to get moving, then question the output. Try it, break it and refine what matters.",
                ],
                [
                  "03",
                  "PUT IT INTO THE WORLD",
                  "A working experiment says more than a perfect plan. Share it, learn from it and keep going.",
                ],
              ].map(([n, title, description]) => (
                <Reveal key={n} className="process-row">
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ArrowUpRight size={22} />
                </Reveal>
              ))}
            </div>
          </section>
          <section className="social section-pad" id="tiktok">
            <div className="social-mark" aria-hidden="true">
              P2<span>IN PROGRESS</span>
            </div>
            <Reveal className="social-copy">
              <span className="eyebrow section-index">
                04 / FOLLOW THE PROCESS
              </span>
              <h2>
                THE NEXT IDEA
                <br />
                IS ALREADY <span className="muted-text">IN PLAY.</span>
              </h2>
              <p>
                Experiments, work in progress and another side of Player2.
                <br />
                Follow along on TikTok.
              </p>
              <a
                className="button"
                href={tiktok}
                target="_blank"
                rel="noreferrer"
              >
                @PLAYER2.SG <ArrowUpRight size={18} />
              </a>
            </Reveal>
            <span className="social-edge">KEEP EXPLORING / KEEP BUILDING</span>
          </section>
          <section className="about section-pad" id="about">
            <Reveal className="about-layout">
              <div>
                <span className="eyebrow section-index">
                  05 / BEHIND PLAYER2
                </span>
                <h2>
                  ONE PERSON.
                  <br />
                  PLENTY OF
                  <br />
                  <span className="muted-text">WHAT IFS.</span>
                </h2>
              </div>
              <div className="about-copy">
                <p className="large-copy">
                  I’m interested in what happens when curiosity meets the tools
                  to act on it.
                </p>
                <p>
                  A game. A website. A different way to solve an everyday
                  problem. AI makes it possible to follow those ideas further,
                  and learn by actually building them.
                </p>
                <p>
                  Player2 is a passion project. An ongoing record of things I’ve
                  tried, things I’ve made and things I’m still figuring out.
                </p>
                <span className="about-signoff">
                  <span className="red-rule" /> HUMAN CURIOSITY. AI
                  POSSIBILITIES.
                </span>
              </div>
            </Reveal>
          </section>
          <section className="contact section-pad" id="contact">
            <span className="eyebrow section-index">
              SOME EXPERIMENTS FIND THEIR WAY INTO THE REAL WORLD.
            </span>
            <div className="contact-layout">
              <div>
                <h2>
                  HAVE SOMETHING
                  <br />
                  <span className="outline-text">IN MIND?</span>
                </h2>
                <p>
                  Have an idea for your business?
                  <br />
                  Let’s see where it could go.
                </p>
              </div>
              <a
                className="contact-action"
                href={contact}
                target="_blank"
                rel="noreferrer"
              >
                <span>LET’S TALK</span>
                <ArrowUpRight size={48} strokeWidth={1.3} />
              </a>
            </div>
          </section>
        </main>
      )}
      <footer>
        <div className="footer-main">
          <a className="brand" href="/">
            <Wordmark />
          </a>
          <p>
            A passion project.
            <br />
            An ongoing experiment.
          </p>
          <div>
            <a href="/fuwa/">
              Fuwa <ArrowUpRight size={14} />
            </a>
            <a href={tiktok} target="_blank" rel="noreferrer">
              TikTok <ArrowUpRight size={14} />
            </a>
            <button onClick={copy}>
              {copied ? "Copied" : "Share"}
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Player2.sg</span>
          <span>INDEPENDENT / SINGAPORE</span>
          <a href="/privacy/">Privacy</a>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-title"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
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
            <span className="eyebrow">{selected.tag}</span>
            <h2 id="project-title">{selected.title}</h2>
            <img src={selected.image} alt={selected.subtitle} />
            <h3>{selected.subtitle}</h3>
            <p>{selected.description}</p>
            <p>{selected.lesson}</p>
            <a
              className="button primary"
              href={selected.url}
              target={selected.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {selected.action}
              <ArrowUpRight size={17} />
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
