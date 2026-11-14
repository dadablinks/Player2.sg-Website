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

The homepage uses a Matrix-inspired black and neon-green gaming direction.
The wordmark is exactly Player2.sg: black Player with a green outline, solid
green 2 and a green .sg suffix. Animated code rain pauses offscreen and in
background tabs; reduced-motion mode draws a static frame. Project filters,
native project dialogs and reduced-motion support are included, with
direct links to the verified TikTok profile @player2.sg. No third-party social
embeds load on the homepage. Contact uses the existing Player2 WhatsApp number.

`node tests/showcase.browser.mjs` checks desktop, phone and narrow-phone layouts,
project filtering/dialogs, absence of video content, and mobile navigation.
It uses the installed Microsoft Edge browser and expects port 5182; override
SHOWCASE_URL for an alternate origin.

Assets: Fuwa loading art from fuonline and a capture of the live Tiny Treasures
site. Nick's video content and thumbnails must not be used on this website.
Keep the live FUWA_ORIGIN and FUWA_READY Pages variables intact on redeployment.
