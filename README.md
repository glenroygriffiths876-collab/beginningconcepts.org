# Beginning Concepts — Official Website

Official address: https://beginningconcepts.org/

## Current homepage

The website now uses a responsive, semantic HTML/CSS design inspired by the approved navy-and-gold Beginning Concepts concepts. The same brand-logo.webp artwork is used in the header, hero and Coming Soon dialog on all screen sizes.

- Desktop/landscape: two-column branded introduction and AI Assistant preview.
- Phone/portrait: uncluttered stacked layout, compact mobile menu and mobile-friendly focus cards.
- Navigation, coming-soon dialogs, assistant preview controls and Share website button are interactive.
- Innovation, Technology, Learning, Development and People cards are clickable.
- AI text chat and introduction video are PREVIEWS only. No real AI service, backend or video is connected yet.
- Contact via Gmail will work after a public company email address is confirmed.

## Business email setup

In index.html, search for the JavaScript constant CONTACT_EMAIL and enter the verified, public company email address inside the empty quotation marks. Until then, Contact via Gmail displays an accurate setup message; the website does not collect any email or question data.

## GitHub Pages and DNS

Settings > Pages: deploy from main branch and root folder. The existing CNAME file remains beginningconcepts.org. In Cloudflare DNS, keep the four recommended GitHub Pages A records for the apex and a suitable www CNAME. Do not remove unrelated subdomains. Enable Enforce HTTPS only once the certificate and DNS verification are ready.

## Files and preservation

- index.html: complete new responsive site, CSS and preview interactions.
- assets/brand-logo.webp: consistent B logo cropped from the new approved desktop visual concept.
- assets/home-desktop.png and assets/home-mobile.png: earlier screenshot-based version retained in the repository as a reference; not used in the new page.
- CNAME: unchanged.

Future: integrate the approved AI guide video, connect a secure AI backend (never put private API keys in GitHub Pages), and replace the current compressed logo with a full-resolution transparent master asset when available.
