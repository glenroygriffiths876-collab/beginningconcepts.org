# Beginning Concepts — Website

Official website: **https://beginningconcepts.org**

## What is in this first version?

- Approved desktop homepage artwork in `assets/home-desktop.png`
- Approved mobile homepage artwork in `assets/home-mobile.png`
- Responsive image selection for phone, tablet, and desktop viewports
- Clickable navigation, featured services, GIA preview, and project areas which show an accessible **Under Construction** overlay until their real functionality is created
- A working **Share** button (system share sheet on supported phones; copy link on supported desktops)
- A visible **Contact Us** button and clickable Contact / Book a Consultation areas
- Provisional favicon; **the final, consistent brand logo has not yet been approved**

## Important: connect the confirmed business Gmail

The exact contact email is intentionally **not guessed**. In `index.html`, find:

```js
const CONTACT_EMAIL = "";
```

Replace the empty string with the confirmed business email, for example `const CONTACT_EMAIL = "verified-business-address@gmail.com";`. Contact Us and Book a Consultation will then open the visitor's email app with a prefilled subject. Until then, those buttons explain that business email setup is underway.

## Publish the root domain using GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**. Choose **main** and **/(root)**; save.
3. In **Custom domain**, enter `beginningconcepts.org` and save. A `CNAME` file has already been provided in this repository.
4. In Cloudflare DNS for `beginningconcepts.org`, configure **four A records** with name `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Do not overwrite existing, unrelated subdomain entries. Avoid conflicting apex records. Start with DNS only (grey-cloud) during GitHub domain validation, then review Cloudflare proxy settings if wanted.
5. After DNS resolves and GitHub issues the certificate, enable **Enforce HTTPS** in Pages.

GitHub reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Notes

This is an **image-based interactive prototype**, not a fully componentized app. The desktop and mobile artwork are the approved visual mockups, with transparent accessible click zones laid over the pictured controls. The logo and GIA video are placeholders pending final branding and working media integration. At a later stage, rebuild each area as responsive semantic HTML elements without sacrificing the approved look.
