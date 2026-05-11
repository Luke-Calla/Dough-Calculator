These files are self-hosted font assets for the static site.

What is here:
- `Inter-Regular.woff2`, `Inter-Medium.woff2`, `Inter-SemiBold.woff2`
- `PlayfairDisplay-Latin.woff2`

How they are used:
- `style.css` defines `@font-face` rules for each weight.
- `index.html` and `how-it-works.html` preload the most important above-the-fold fonts.
- Existing CSS keeps using the same `--font-sans` and `--font-serif` variables, so typography rules do not need to change elsewhere.

Source notes:
- Inter files were downloaded from the upstream Inter project.
- The Playfair Display file was downloaded from the Google Fonts CSS manifest for modern browsers and uses the web-optimized `woff2` format.

Why this exists:
- Self-hosting removes the app's runtime dependency on `fonts.googleapis.com` and `fonts.gstatic.com`.
- The site can stay fully static while keeping the same font families.
