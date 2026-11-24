# Indie Legends Arcade Island — Premium Architecture Starter

**create by [LamberthRumpaidus](https://github.com/lamberthrumpaidus)**

## Scope and status

This is a modular migration starter, not a claim that all 100 games have been converted to premium WebGL. `legacy/` contains the available local snapshot of the previous 100 games; this snapshot is not guaranteed to match every later commit on GitHub. They are preserved as a compatibility library, loaded one at a time inside a same-origin iframe. Spirit Arena is a separate playable technical demonstration of the new architecture: it does not replace or duplicate an original catalogue entry. Its primary renderer is native WebGL2; if initialization fails it explicitly switches to SVG compatibility mode. `ThreeRenderer.js` and Crystal Garden provide an optional Three.js adapter and build example. The npm dependencies could not be retrieved in the preparation environment, so the Three.js example has been syntax-checked but not bundled or visually tested. No live GitHub/Netlify files were replaced.

## 1. Run and build

Node.js 20+ recommended. The primary portal and native WebGL demo do not need npm packages, a CDN or API. Use HTTP localhost or HTTPS; double-clicking `index.html` via `file://` is not a supported way to run ES modules or a PWA.

```bash
# Source folder, no dependencies required for the primary build:
node tools/build-dist.mjs
npm test
# Start a static development server:
python -m http.server 8080 --directory dist
# Open http://localhost:8080/
```

For Netlify: use the ready-to-deploy ZIP with `index.html` at its root, or keep source in GitHub with the included `netlify.toml` (build command `node tools/build-dist.mjs`, publish `dist`). Install Python only for the example local server; it is not required on Netlify. To use the Three.js adapter:

```bash
npm install
npm run build:three
python -m http.server 8080 --directory dist
# Open http://localhost:8080/optional/three.html
```

The optional renderer is bundled locally, and the generated release manifest includes its JS and HTML only when the bundle exists. Pin and commit the npm lockfile after installation, and use `npm ci` in CI. Version pins are a concrete baseline, not a claim that they are the latest available.

## 2. Architecture

```
index.html                        semantic app shell and install/settings dialogs
assets/style.css                  responsive portal, safe-area aware controls
assets/brand/                     existing application and creator identity
assets/covers/                    100 lightweight category-based SVG cover illustrations
src/main.js                       catalog, filters, lazy pagination, hash SPA, lifecycle
src/core/GameFeel.js               fixed timestep, interpolation, hit-stop, trauma
src/core/Input.js                  keyboard, multi-pointer capture, release/cleanup
src/core/ParticlePool.js           bounded typed-array particle pool
src/core/Quality.js                quality presets and measured frame-time adaptation
src/core/SensoryManager.js         audio buffers, SFX/BGM buses, ducking, haptics
src/renderers/WebGLRenderer.js      WebGL2 scene, instanced sprites and post-processing
src/renderers/SvgFallbackRenderer.js compatibility renderer (no GPU effects)
src/renderers/ThreeRenderer.js      optional Three.js adapter
src/games/catalog.json            100 real game IDs and compatibility URLs
src/games/SpiritArena.js           reference game using shared modules
src/ui/Offline.js                 install prompt, offline progress and status
legacy/                           snapshot of 100 existing games
optional/three-entry.js           optional Three.js crystal garden example
optional/three.html               optional entry page
sw.js                             release-scoped service worker
manifest.json                     install metadata and app icons
 offline-manifest.js              generated asset paths, sizes, SHA-256 hashes
 tools/build-manifest.mjs          deterministic release manifest generator
 tools/build-dist.mjs              creates static dist/ without node_modules
 tools/*.test.mjs                  unit and service worker mock tests
 netlify.toml                     static deployment configuration
```

Portal → game registry → dynamic module or legacy adapter → lifecycle `mount / setOptions / destroy`. Every migrated module owns its game logic, art and sounds; core owns the event timing, input, audio buses and frame policy. One active game and one WebGL context at a time. No renderer on catalogue cards. Legacy iframe removal unloads game and its audio/animation loops. Native renderer cleanup removes programs, buffers, framebuffer textures and event listeners. DOM controls remain keyboard-accessible; keyboard and pointer release are handled separately. A visibility handler suspends audio and resets the physics clock.

## 3. Rendering and art production

Primary reference: WebGL2 renders a procedural scene into an RGBA8 framebuffer, with a dynamic local light, one instanced sprite/particle batch, bloom extraction, quarter-resolution separable Gaussian blur, and a compositing shader with chromatic offsets and subtle CRT scanlines. This is an LDR glow approximation, not an HDR PBR engine. For 3D, the optional ThreeRenderer uses real scene lights, ACES tone mapping, MeshStandardMaterial, UnrealBloomPass, a custom ShaderPass and OutputPass. `InstancedMesh` batches particle quads. PixiJS v8 is recommended for future sprite-atlas-based 2D games; use `Application.init({ preference: 'webgl' })`, custom GLSL filters and a batch of sprites/particles, with the same core lifecycle. Do not include Pixi and Three in every game bundle; load the needed renderer on demand.

For premium production quality, create bespoke character silhouettes, background layers, animation state machines (idle/move/attack/hurt/death), texture atlases, art direction and lighting per genre. Use WebP for cover images, PNG/WebP texture atlases for alpha art, glTF for 3D models and KTX2/Basis where supported. These require original or licensed artwork; the sample SVG covers are design illustrations, not screenshots. Do not apply excessive bloom or chromatic aberration to puzzle text or HUD. Keep HUD outside the shader and leave safe margins. Do not use the SVG fallback as a claim of GPU quality.

Quality presets are starting points:

| Tier | DPR cap | Bloom | Chromatic | Particle budget |
|---|---:|---|---|---:|
| Low | 1.0 | Off | Off | 400 |
| Medium | 1.35 | On | Off | 900 |
| High | 1.75 | On | On | 1600 |

At 60 FPS a frame is 16.7 ms. Aim for p95 < 16.7 ms on a defined mid-range Android test device, with simulation < 3 ms and rendering < 9–11 ms; the remaining budget is browser and UI work. These are design budgets, not measured results. Keep 2D sprites in atlases, cull offscreen objects, cap draw calls and texture memory, preallocate pools, avoid per-frame texture creation. For 3D, use LODs, instancing, baked ambient lighting, a small number of dynamic lights, no costly mobile shadow passes by default. AdaptiveQuality uses smoothed frame time and hysteresis, not device names. Test frame timing with real hardware and battery/thermal throttling.

## 4. GameFeel and module contract

```js
import { GameFeel } from '../core/GameFeel.js';
const feel = new GameFeel({ hz: 60 });
// Impact only after a confirmed gameplay event, never on every frame.
feel.impact(0.6, 65);
// RAF timestamp in milliseconds, simulation dt in seconds.
feel.frame(now, dt => {
  player.vx = GameFeel.velocity(player.vx, targetVX, dt);
  player.x += player.vx * dt;
}, ({ alpha, shake }) => {
  // Interpolate previous/current positions, then apply shake to camera only.
  renderer.render({ alpha, shake });
});
```

The actual runnable implementation is in SpiritArena.js, where fixed updates handle collisions and points, hit-stop stops simulation without blocking rendering, and the screen shake is applied in the renderer. Hit-stop is capped at 180 ms and trauma decays over time. Reduced-motion disables shake. Do not modify gameplay coordinates for visual shake. `requestAnimationFrame` is cancelled on destroy.

To migrate a game, create `src/games/<id>.js` with `export async function mount(host,{sensory,settings,onExit})` returning `{setOptions(next), destroy()}`. Add a per-game loader in `src/main.js`, update the registry to `engine:'webgl'`/`'pixi'`/`'three'`, and keep its original ID, score semantics, and controls. The sample loader is deliberately limited to the Spirit Arena module: for production use a static map of `id: () => import(...)`, not arbitrary user-controlled URLs. Test game state transitions, restart, collision, win/lose, and keyboard/multitouch. Migrate in batches of 5–10 and remove legacy entries only after parity.

## 5. Portal and sensory design

The CSS floating island uses layered mountains/mist/hero art, scroll-driven transform via requestAnimationFrame, and a reduced-motion mode. Cards load in groups of 16, use lazy image decoding and one delegated hover/click handler. Filtering works across all metadata, including unloaded cards. Infinite loading uses IntersectionObserver and an explicit Load More fallback. Routing uses hash history and a retained dark splash/overlay rather than a full page navigation. Legacy games run in a separate compatibility iframe so their global scripts cannot collide. The existing brand remains on the portal and creator credit at the footer, not in gameplay.

The shared `SensoryManager` uses one AudioContext, precomputed AudioBuffers and separate SFX/BGM gain buses. Audio starts only after user activation, as required by browsers; hover bloops work after the first gesture. Actual latency depends on browser/device/audio hardware. SFX have a 24-voice limit and rate limiting. Ducking briefly lowers BGM using a scheduled gain ramp and recovers smoothly. Call `sensory.play('explosion',{important:true})` and `sensory.vibrate([45,30,60])` on real impact events; `sensory.vibrate(12)` is for subtle interaction. Vibration is optional, may be unsupported (notably iOS Safari), and can be disabled. Browser storage stores sound/haptic preferences. The current migrated demo has eight original synthesized SFX and an original ambient loop. Each legacy game keeps its existing audio code; full event-driven, per-title sound migration is a separate workstream. For commercial quality, use original/ licensed Foley, varied samples, spatial cues, loopable ambient beds and loudness normalization. Add decoded samples lazily and release large buffers when the game closes.

## 6. Offline and install

`build-manifest.mjs` records path, size and SHA-256 for every runtime file. The service worker pre-caches the app shell at install; an explicit user action downloads the full library with four concurrent downloads, rejects wrong-size/hash assets, and resumes a partial pack on retry. It only caches allowlisted same-origin release files and does not substitute HTML for missing JS or image requests. The current manifest includes the old game scripts, covers, native modules and branding. Cache keys are release-specific; old caches are deleted after the new worker activates. No unconditional `skipWaiting`, to avoid breaking active sessions. Cache-first serves immutable verified release data. A new deployment should use content-hashed filenames for large independent asset packs; this starter still uses fixed URLs plus version checks. If the old client needs a newly deployed but not-yet-cached old-version file, redownload the new release after closing old tabs.

Install button opens a custom dialog. Browser-native installation confirmation is still controlled by browser/OS. On iOS, show instructions for Safari Add to Home Screen. The full offline download does not depend on the browser's install prompt. Status is calculated from actual cache keys and only says ready when all release entries are present. `navigator.storage.persist()` is requested where supported; it is not a guarantee. Full downloads require the app to stay alive; background sync support is not universal. Airplane mode: connect once, download all, wait for ready, reload while still online to ensure the worker controls the page, then turn network off and check launch from the home-screen shortcut. For a literal native installation with stronger control over packaged assets, use Capacitor or a native build pipeline; platform storage clearing still removes data.

## 7. Migration and release gates

- Phase 1: native reference demo and shared modules (included).
- Phase 2: pilot PixiJS migration of 2D action/puzzle titles, Three.js for SHINRIN and appropriate 3D titles. Art packs and actual SFX per game, not cosmetic reskins. Keep distinct gameplay.
- Phase 3: complete all 100, replace compatibility adapter only when parity is verified. Add IndexedDB save layer, accessibility options, asset licensing inventory, and automated end-to-end tests. IndexedDB is recommended, not implemented here beyond existing legacy storage.
- Phase 4: run desktop Chrome/Edge and Android Chrome, Samsung Internet, iOS Safari, installed PWA, portrait/landscape, mid-range devices, 10–20 minute thermal runs. Check cold launch and offline all games, multiple mount/unmount cycles, game progress, audio after resume, touch cancellation, failed downloads, storage quota, update recovery and context loss.

### Verification of this starter

Eight automated Node tests pass (core clock, hit-stop, damping, bounded particle pool, adaptive quality, unique catalog and covers, manifest paths and sizes, and simulated service worker checksum failure/retry/offline fetch). Browser inline harness with the same source modules tested desktop 1280×800 and mobile 390×844: portal renders 100 metadata records in pages of 16, Spirit Arena starts in explicitly labelled SVG fallback, keyboard and touch action work, original audio buffers have nonzero sample amplitude. No JS page errors were observed in that harness. The environment denies HTTP navigation and WebGL2, so the true WebGL rendering, Three.js bundle, real browser SW lifecycle, physical-device haptics, full legacy replay and sustained 60 FPS are not certified. The included mocked SW test is not a replacement for real browser offline testing. No GitHub deployment was made.

## Documentation references

- PixiJS v8 application: https://pixijs.com/8.x/guides/components/application
- PixiJS filters: https://pixijs.com/8.x/guides/components/filters
- Three.js post-processing: https://threejs.org/manual/pages/post-processing.html
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- PWA caching: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching