import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  navigation,
  process,
  proofCards,
  services,
  whatsappUrl,
  type Service,
} from "./content";

const ease = [0.22, 1, 0.36, 1] as const;

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const activeService = services.find((service) => `/${service.slug}` === path);
  const isHome = path === "/" || !activeService;

  useEffect(() => {
    if (isHome) {
      document.title = "Player2.sg | Listing Media, Reels and Starter Websites";
    }
  }, [isHome]);

  const navigate = (href: string) => {
    window.history.pushState({}, "", href);
    setPath(href);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ScrollProgress />
      <Header
        path={path}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navigate={navigate}
      />
      <AnimatePresence mode="wait">
        {isHome ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Hero navigate={navigate} />
            <MotionServices navigate={navigate} />
            <ProcessRail />
            <ProofSection />
            <WebsiteStarterTease navigate={navigate} />
            <FinalCta />
          </motion.main>
        ) : (
          <ServicePage key={activeService.slug} service={activeService} navigate={navigate} />
        )}
      </AnimatePresence>
    </>
  );
}

function Header({
  path,
  menuOpen,
  setMenuOpen,
  navigate,
}: {
  path: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  navigate: (href: string) => void;
}) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate("/")} aria-label="Player2 home">
        <span className="brand-mark">P2</span>
        <span>player2.sg</span>
      </button>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            key={item.href}
            className={path === item.href ? "active" : ""}
            onClick={() => navigate(item.href)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <a className="header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
        <MessageCircle size={18} />
        WhatsApp
      </a>
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navigation.map((item) => (
              <button key={item.href} onClick={() => navigate(item.href)}>
                {item.label}
              </button>
            ))}
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp Player2
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

function Hero({ navigate }: { navigate: (href: string) => void }) {
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 700], [0, 145]);
  const mediaRotate = useTransform(scrollY, [0, 700], [-5, 3]);
  const titleY = useTransform(scrollY, [0, 500], [0, -70]);

  return (
    <section className="hero">
      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          Listing media for property agents
        </motion.p>
        <motion.h1 style={{ y: titleY }}>Media support for property agents.</motion.h1>
        <motion.p
          className="hero-lede"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease }}
        >
          Player2 helps property agents look prepared, stay visible and move from idea
          to finished media without carrying the whole production load alone.
        </motion.p>
        <div className="hero-actions">
          <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={20} />
            Start on WhatsApp
          </a>
          <button className="secondary-button" onClick={() => navigate("/listing-media")}>
            See services
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <motion.div className="hero-media" style={{ y: mediaY, rotate: mediaRotate }}>
        <img src="/assets/listing.jpg" alt="Interior property media sample" />
        <motion.div
          className="floating-card clip-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease }}
        >
          <span>01</span>
          Photos
        </motion.div>
        <motion.div
          className="floating-card reel-card"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease }}
        >
          Walkthrough
          <span>Reel-ready</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MotionServices({ navigate }: { navigate: (href: string) => void }) {
  return (
    <section className="service-cinema" id="services">
      <div className="section-heading">
        <p className="eyebrow">What Player2 supplies</p>
        <h2>Scroll through the support stack.</h2>
      </div>
      <div className="service-stack">
        {services.map((service, index) => (
          <ServicePanel
            key={service.slug}
            service={service}
            index={index}
            navigate={navigate}
          />
        ))}
      </div>
    </section>
  );
}

function ServicePanel({
  service,
  index,
  navigate,
}: {
  service: Service;
  index: number;
  navigate: (href: string) => void;
}) {
  const Icon = service.icon;

  return (
    <motion.article
      className="service-panel"
      initial={{ opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.45, once: false }}
      transition={{ duration: 0.7, ease }}
      style={{ "--accent": service.accent } as React.CSSProperties}
    >
      <div className="panel-copy">
        <div className="panel-kicker">
          <span>{String(index + 1).padStart(2, "0")}</span>
          {service.eyebrow}
        </div>
        <Icon size={36} strokeWidth={1.8} />
        <h3>{service.title}</h3>
        <p>{service.intro}</p>
        <button onClick={() => navigate(`/${service.slug}`)}>
          Open service
          <ArrowRight size={18} />
        </button>
      </div>
      <motion.div
        className="panel-image"
        whileInView={{ y: [45, -15], rotate: [-2, 1] }}
        transition={{ duration: 1.2, ease }}
      >
        <img src={service.image} alt={`${service.title} visual`} />
      </motion.div>
    </motion.article>
  );
}

function ProcessRail() {
  return (
    <section className="process-section">
      <div className="section-heading">
        <p className="eyebrow">How the work moves</p>
        <h2>From agent idea to usable media.</h2>
      </div>
      <div className="process-grid">
        {process.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              className="process-card"
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon size={28} />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="proof-section">
      <div className="section-heading">
        <p className="eyebrow">Work slots</p>
        <h2>Case studies will live here.</h2>
        <p>
          These are placeholder structures for now, ready to swap with real projects,
          sample reels and listing media once the portfolio is selected.
        </p>
      </div>
      <div className="proof-grid">
        {proofCards.map((card, index) => (
          <motion.article
            key={card.title}
            className="proof-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: index * 0.1, ease }}
          >
            <span>{card.tag}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function WebsiteStarterTease({ navigate }: { navigate: (href: string) => void }) {
  const frames = useMemo(() => ["Hero", "Services", "Gallery", "WhatsApp"], []);

  return (
    <section className="website-tease">
      <div>
        <p className="eyebrow">Website Starter</p>
        <h2>A small site that makes the agent look real.</h2>
        <p>
          For agents and small brands who need the TinyTreasures-style launch path:
          simple pages, polished visuals, proof slots and direct contact.
        </p>
        <button className="secondary-button" onClick={() => navigate("/website-starter")}>
          View Website Starter
          <ArrowRight size={18} />
        </button>
      </div>
      <motion.div className="site-mockup" whileInView="show" initial="hidden">
        {frames.map((frame, index) => (
          <motion.div
            key={frame}
            variants={{
              hidden: { opacity: 0, x: 80, rotate: 4 },
              show: { opacity: 1, x: 0, rotate: 0 },
            }}
            transition={{ duration: 0.5, delay: index * 0.13, ease }}
          >
            {frame}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ServicePage({
  service,
  navigate,
}: {
  service: Service;
  navigate: (href: string) => void;
}) {
  const Icon = service.icon;

  useEffect(() => {
    document.title = `${service.title} | Player2.sg`;
  }, [service.title]);

  return (
    <motion.main
      className="service-page"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease }}
      style={{ "--accent": service.accent } as React.CSSProperties}
    >
      <section className="service-hero">
        <div>
          <p className="eyebrow">{service.eyebrow}</p>
          <Icon size={42} />
          <h1>{service.title}</h1>
          <p>{service.intro}</p>
          <div className="hero-actions">
            <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
              Ask about {service.title}
            </a>
            <button className="secondary-button" onClick={() => navigate("/")}>
              Back home
            </button>
          </div>
        </div>
        <motion.img
          src={service.image}
          alt={`${service.title} sample visual`}
          initial={{ opacity: 0, y: 50, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.65, ease }}
        />
      </section>
      <section className="service-detail">
        <div>
          <p className="eyebrow">The promise</p>
          <h2>{service.promise}</h2>
        </div>
        <ul>
          {service.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
      <FinalCta />
    </motion.main>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <p className="eyebrow">Ready when the listing is</p>
      <h2>Tell Player2 what you need to launch next.</h2>
      <p>
        Send the property type, content goal or website idea. The first reply can
        narrow the right media package before pricing is added to the site.
      </p>
      <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
        <MessageCircle size={20} />
        WhatsApp 81168100
      </a>
    </section>
  );
}
