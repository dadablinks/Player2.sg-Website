# Fuwa website integration

Website: dadablinks/Player2.sg-Website, main. Game: dadablinks/fuonline, fuwa-2.5.
Handoff reviewed: docs/player2-fuwa-handoff.md, Git blob f07a0fe8241f1cacc43b17fafed7cc69d8023a7f (Windows host update).

Cloudflare Pages builds dist using npm run build. Vite copies public/\_worker.js into dist. The Pages advanced-mode Worker serves ordinary paths with ASSETS and handles only /fuwa and /fuwa/\* specially.

## Activate the game

Set these Pages production environment variables only after the game agent completes the gates below, then redeploy:

- FUWA_ORIGIN=https://fuwa.player2.sg (stable named tunnel origin, not a quick tunnel)
- FUWA_READY=true

Without both settings, /fuwa/ returns a branded 503 page; assets, health and multiplayer return JSON 503. No game assets fall through to the website SPA. The homepage checks /fuwa/health and reports observed status.

The proxy strips /fuwa from the upstream path, preserves query strings and forwards the original Origin. Responses pass through without buffering or rewriting compressed bytes, ranges, validators or WebSocket upgrades. Edge caching is disabled until the game has versioned assets. Do not add COOP/COEP for the current single-threaded export.

## Game agent gates (on the Acer Windows host)

1. Update multiplayer.gd to derive the browser WebSocket base from the document directory, supporting /fuwa/ and local root previews. Re-export with matching Godot templates.
2. Add an exact https://player2.sg browser Origin allowlist to the Node backend; retain foreign-origin rejection. The proxy deliberately does not forge Origin. Approve preview origins individually only when testing them.
3. Connect the named tunnel to the existing healthy localhost:8066 service. Preserve localhost binding. The historical tunnel name fuwa-mac-host does not require a Mac.
4. Confirm domain activation and stable upstream DNS. Website domain DNS must target Pages, never the game tunnel.
5. Check redirect with queries, direct reload, compressed WASM, music 206 ranges, health, real WSS upgrade and two devices. Test mobile music/touch. Do not declare multiplayer live from mocked tests.

## Checks

Run npm run build and node --test tests/fuwa-proxy.test.mjs.

The repository does not contain the ignored game export or run the Godot server. Windows power/startup/recovery remain the game host's responsibility. Never store tunnel credentials in this website repository.
