# Player2.sg Website

Player2 gaming website, featuring Fuwa, built for Cloudflare Pages.

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
