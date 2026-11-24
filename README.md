# Beginning Concepts — Official Website

Official address: https://beginningconcepts.org/

## Selected work portfolio (November 22, 2026)

The homepage now includes a responsive **Selected Work / Our Work** section beneath the five focus-area controls. Each card is a direct, accessible external link opening in a new tab; no redirects or placeholder dialogs are used. The section's isolated styling lives in `assets/portfolio.css`.

- **WAPS Communication:** https://waps.beginningconcepts.org/ — Western Autism Parents Support, a free caregiver-guided communication support platform.
- **HSTU Resource Repository:** https://hstu-repository.moh.gov.jm/ — public-health strategic information resources and materials.

The top navigation includes **Our Work**. Gia's browser-based service guide also includes **Our work** suggestions and direct links to both examples when asked for portfolio work, WAPS or HSTU. This change does not alter WAPS, HSTU, Gia's backend model, the cinematic video, DNS or deployment configuration.

Follow-up QA: check both destination URLs in a normal browser and verify the new section visually at desktop/tablet/mobile widths after GitHub Pages publishes this commit. Their live HTTP responses were not independently verified during editing.

## Gia cinematic homepage and business guide (November 22, 2026)

- The original generic robot assistant preview has been replaced by a floating **Ask Gia** bubble, using the official Gia portrait carried into `assets/gia-avatar.jpg`.
- Selecting Ask Gia opens a responsive and accessible conversational panel. It can explain Beginning Concepts' proposed/custom service areas: custom websites, apps, client-specific Gia assistants, educational experiences and practical digital tools. It also provides guidance on pricing enquiries, hosting, timelines, maintenance and contact.
- Gia's current website implementation is **a deterministic, client-side, service-knowledge assistant**, not a live generative AI backend. It does not claim to access private data, answer unrestricted questions, store chat transcripts or send email on behalf of visitors.
- The project-brief conversation collects a user's proposed service, goal, features and target timing into **browser memory only**, then prepares a reviewable `mailto:` email draft addressed to beginningconcepts.org@gmail.com. No backend collection occurs.
- The new cinematic hero uses `assets/beginning-concepts-gia.mp4`, an **optimized 1920×1080 H.264/AAC copy of the Flow video supplied for the homepage**, stored in this repository. The original uploaded source is retained separately by the user. It autoplays muted, loops, supports inline mobile playback, and offers a user-initiated sound toggle. When video playback is unavailable, Gia's local portrait is displayed.
- `assets/gia-business.css` and `assets/gia-business.js` contain the new experience. Old website preview screenshots remain archived in `assets/` but are not displayed as homepage cards.
- No paid hosting, model subscription, server, database or API key is required for the current static-site experience. **A future live generative Gia service would require a secured backend and separately agreed runtime/model setup.**
- Follow-up QA: inspect desktop and mobile in actual browsers, confirm GitHub Pages propagation, verify film autoplay and sound, test the enquiry draft in at least one mail client, keyboard accessibility and service responses.

## Current homepage

The website now uses a responsive, semantic HTML/CSS design inspired by the approved navy-and-gold Beginning Concepts concepts. The same brand-logo-hd.avif artwork is used in the header, hero and Coming Soon dialog on all screen sizes.

- Desktop/landscape: two-column brand introduction and cinematic Gia video showcase.
- Phone/portrait: stacked brand/video layout, compact mobile menu, and floating Gia chat interface.
- Navigation, coming-soon dialogs, assistant preview controls and Share website button are interactive.
- Innovation, Technology, Learning, Development and People cards are clickable.
- Gia's functional local knowledge guide and the supplied cinematic introduction video are connected. No live generative AI backend is connected.
- Contact via Gmail is connected to the public business inbox: beginningconcepts.org@gmail.com.

## Business email connection

All Contact and Contact via Gmail controls use a mailto link addressed to beginningconcepts.org@gmail.com, with subject `Enquiry | Beginning Concepts`. The visitor's default mail application handles composing and sending the message. No emails are collected or sent by GitHub Pages itself.

## GitHub Pages and DNS

Settings > Pages: deploy from main branch and root folder. The existing CNAME file remains beginningconcepts.org. In Cloudflare DNS, keep the four recommended GitHub Pages A records for the apex and a suitable www CNAME. Do not remove unrelated subdomains. Enable Enforce HTTPS only once the certificate and DNS verification are ready.

## Files and preservation

- index.html: complete new responsive site, CSS and preview interactions.
- assets/brand-logo-hd.avif: approved high-resolution transparent B emblem (620 × 511).
- assets/home-desktop.png and assets/home-mobile.png: earlier screenshot-based version retained in the repository as a reference; not used in the new page.
- CNAME: unchanged.

Future: integrate the approved AI guide video, connect a secure AI backend (never put private API keys in GitHub Pages), and replace the current compressed logo with a full-resolution transparent master asset when available.
