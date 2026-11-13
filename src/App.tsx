import {
  ArrowDown,
  ArrowUpRight,
  Gamepad2,
  Radio,
  RefreshCw,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function App() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const reducedMotion = useReducedMotion();
  async function checkStatus() {
    setStatus("checking");
    try {
      const response = await fetch("/fuwa/health", {
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
      const data = await response.json();
      setStatus(response.ok && data.status === "ok" ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  }
  useEffect(() => {
    void checkStatus();
  }, []);
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Player2 home">
          <Gamepad2 size={26} />
          <span>
            player2<span className="brand-dot">.sg</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#games">Games</a>
          <a href="/fuwa/">
            Fuwa <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <img
            className="hero-art"
            src="/assets/fuwa-hall.jpg"
            alt="Fuwa's pixel-art temple hall with red pillars and warm lanterns"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">
              <span className="small-line" /> PLAYER2 PRESENTS
            </p>
            <h1>
              Player2<span className="title-period">.</span>
            </h1>
            <p className="hero-lede">A little world. A shared moment.</p>
            <p className="hero-description">
              Step into Fuwa, a pixel temple made for wandering, meeting and
              taking a moment together.
            </p>
            <a className="play-button" href="/fuwa/">
              Enter Fuwa
              <ArrowUpRight size={22} />
            </a>
          </motion.div>
          <div className="hero-caption">
            <span>01 / FUWA</span>
            <span>A shared pixel world</span>
          </div>
          <a className="scroll-link" href="#games" aria-label="Explore games">
            <ArrowDown size={20} />
          </a>
        </section>
        <section className="games-section" id="games">
          <div className="section-top">
            <div>
              <p className="eyebrow">THE COLLECTION / 01</p>
              <h2>Find your next little escape.</h2>
            </div>
            <Gamepad2 className="section-icon" size={38} strokeWidth={1.3} />
          </div>
          <motion.article
            className="game-row"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a className="game-image" href="/fuwa/" aria-label="Open Fuwa">
              <img
                src="/assets/fuwa-hall.jpg"
                alt="Inside the Fuwa temple"
                loading="lazy"
              />
              <span className="image-label">FUWA / BROWSER WORLD</span>
            </a>
            <div className="game-copy">
              <div className="game-meta">
                <span>01</span>
                <span>EXPLORATION / MULTIPLAYER</span>
              </div>
              <h3>Fuwa</h3>
              <p>
                A quiet place to cross paths. Explore the hall, meet other
                visitors and leave an incense offering.
              </p>
              <div className="tags">
                <span>Pixel world</span>
                <span>Browser game</span>
              </div>
              <div className={`server-status ${status}`} role="status">
                <Radio size={16} />
                <span>
                  {status === "online"
                    ? "Temple is online"
                    : status === "checking"
                      ? "Checking temple status"
                      : "Temple is offline"}
                </span>
                <button
                  onClick={() => void checkStatus()}
                  disabled={status === "checking"}
                  title="Refresh temple status"
                  aria-label="Refresh temple status"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
              <a className="text-link" href="/fuwa/">
                Visit Fuwa <ArrowUpRight size={20} />
              </a>
            </div>
          </motion.article>
        </section>
        <section className="closing">
          <p className="eyebrow">ROOM FOR ONE MORE</p>
          <h2>Better with a Player2.</h2>
          <a href="/fuwa/">
            See you in Fuwa <ArrowUpRight size={22} />
          </a>
        </section>
      </main>
      <footer>
        <a className="brand" href="/">
          player2.sg
        </a>
        <span>Small worlds. Shared experiences.</span>
        <a href="/fuwa/">
          /fuwa <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  );
}
