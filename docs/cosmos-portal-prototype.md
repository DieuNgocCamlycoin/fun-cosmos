# Cosmos Portal 2.5D prototype

Scope: /cosmos arrival only. Existing original background and transparent traveler are preserved; portal.jpg supplies the world inside a native CSS arch. DOM headings and CTAs remain independent of motion. No generated images, WebGL, R3F or package changes.

Desktop enhancement: scroll-derived bounded translations and scales, scheduled only by scroll/resize using one pending requestAnimationFrame. IntersectionObserver removes listeners offscreen; hidden tabs and shell/local pause stop updates. Reduced-motion changes reset depth; mobile <=900px uses a static vertical composition. No scroll interception, pinning, persistent render loop or pointer tracking.

Validation: typecheck and production build pass. Lint 0 errors, six existing warnings. Chrome at 1440/1024/768/390/320: no horizontal overflow; desktop/mobile screenshots visually reviewed. Scroll depth, local/global pause, reduced motion and no-JavaScript heading/CTA/anchor checked. No physical-device thermal/FPS measurements performed.

Preview: http://127.0.0.1:8083/cosmos
Next proposed step: review composition and scroll amplitude with user, then connect the portal's light path to the five pillars using DOM/SVG. WebGL remains deferred. Not pushed or deployed.
