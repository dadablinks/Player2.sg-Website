# Player2.sg Website

Player2's personal AI playground: experiments, games, creative coding, video and
web projects. Built with React, Framer Motion and Cloudflare Pages.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Cloudflare Pages settings:

- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`

## Fuwa

The permanent game route is `/fuwa/`. See [integration notes](docs/fuwa-integration.md)
for proxy settings and game-host acceptance gates. It returns an explicit offline
page until the upstream is ready. The homepage uses the game's existing loading
artwork from dadablinks/fuonline, branch fuwa-2.5, godot-temple/web/loading-hall.jpg.

Proxy checks: `node --test tests/fuwa-proxy.test.mjs`.

## Showcase

The homepage includes project filters, accessible native project dialogs, local
video previews, an interactive colour experiment, reduced-motion support and
direct links to the verified TikTok profile @player2.sg. No third-party social
embeds load on the homepage. Contact uses the existing Player2 WhatsApp number.

`node tests/showcase.browser.mjs` checks desktop, phone and narrow-phone layouts,
project filtering/dialogs, video playback, mobile navigation and reduced motion.
It uses the installed Microsoft Edge browser and expects port 5182; override
SHOWCASE_URL for an alternate origin.

Assets: Fuwa loading art from fuonline; the local Remotion output supplies the
muted motion excerpt and poster; Tiny Treasures is captured from its live site.
The chrome numeral artwork was generated specifically for this showcase.
Keep the live FUWA_ORIGIN and FUWA_READY Pages variables intact on redeployment.
