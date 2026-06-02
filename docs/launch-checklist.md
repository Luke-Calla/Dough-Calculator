# Launch Checklist

Work through these in order. Later phases depend on earlier ones (you need the real domain before you can fill in URLs, and URLs before you can verify social share cards, etc.).

---

## Phase 1 — Domain & Hosting

Prerequisite for everything else.

- [ ] Purchase or confirm your domain name
- [ ] Set up static hosting (Netlify, GitHub Pages, Cloudflare Pages, etc.)
- [ ] Confirm HTTPS is enabled on the live URL
- [ ] Note your final canonical URL (e.g. `https://pizzadoughcalculator.com/`) — you'll need it in Phase 2

---

## Phase 2 — Replace All Placeholder URLs

There are 11 `LAUNCH-TODO` comments across the two HTML files. Do these in one pass once your domain is confirmed.

**Domain placeholders — both files**

- [ ] `index.html` line 11 — canonical URL
- [ ] `index.html` line 16 — `og:url`
- [ ] `index.html` line 18 — `og:image` (full URL to `assets/og-cover.png`)
- [ ] `how-it-works.html` line 9 — canonical URL
- [ ] `how-it-works.html` line 14 — `og:url`
- [ ] `how-it-works.html` line 16 — `og:image`

**Affiliate & support links — decide and fill in or remove**

- [ ] `index.html` line 625 — precision scale affiliate link (or remove the paragraph)
- [ ] `index.html` line 656 — Buy Me a Coffee handle (or remove the link)
- [ ] `index.html` line 658 — Recommended scale footer link (or remove)
- [ ] `how-it-works.html` line 426 — check and replace any remaining placeholder URL
- [ ] `how-it-works.html` line 428 — check and replace any remaining placeholder URL

> If you're not using affiliate links or Buy Me a Coffee at launch, just remove those elements — dead placeholder links will hurt trust.

---

## Phase 3 — Technical SEO (High Impact, Low Effort)

These changes are the ones discussed before creating this checklist.

- [x] **Improve the `<title>` on `index.html`**
  Now: `Pizza Dough Calculator – Ratios, Yeast & Fermentation Schedule`

- [x] **Add `FAQPage` JSON-LD schema to `index.html`**
  All 7 FAQ questions wrapped in schema markup. Eligible for rich snippets in search results.

- [x] **Add `WebApplication` JSON-LD schema to `index.html`**
  Signals to Google that this is an interactive tool, not just a content page.

- [x] **Create `sitemap.xml`** in the project root
  Two URLs indexed. Remember to update the placeholder domain in Phase 2.

- [x] **Create `robots.txt`** in the project root
  Allow all, points to sitemap. Remember to update the placeholder domain in Phase 2.

---

## Phase 4 — Content & Wording

- [x] **Surface the "no tracking" angle in hero copy**
  Appended "No accounts, no tracking." to the header subheading — visible immediately below the h1.

- [x] **Review FAQ question wording for searchability**
  Three questions lacked "pizza dough" context and would have been ambiguous as standalone search queries. Updated:
  - "What hydration should I start with?" → "What hydration should I use for pizza dough?"
  - "Can I use sourdough instead of yeast?" → "Can I use sourdough starter instead of yeast for pizza dough?"
  - "Why does fridge time matter?" → "Why does cold fermentation matter for pizza dough?"
  JSON-LD schema updated to match all three.

---

## Phase 5 — Pre-Launch Verification

Run through these before announcing anywhere.

- [ ] Run the full `docs/testing/manual-test-checklist.md` — all leavener modes, preset/custom overrides, unit toggle, schedule output, warm-up, sourdough mode
- [ ] Check mobile layout on a real device (not just browser devtools)
- [ ] Test both pages in Firefox and Safari as well as Chrome
- [ ] Validate social share cards using [opengraph.xyz](https://www.opengraph.xyz) or the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — paste your live URL and confirm the OG image, title, and description display correctly
- [ ] Click every link in the footer and nav — especially the ones you just replaced in Phase 2
- [ ] Submit to **Google Search Console** — verify ownership and request indexing for both pages

---

## Phase 6 — Launch

Do these in order. Don't spread across weeks; a cluster of activity in a short window signals relevance.

- [ ] **r/pizza** — Post with a genuine recipe you made using the calculator. Show the result, mention the tool naturally. Don't lead with "I built a thing."
- [ ] **r/ArtisanPizza** — Same approach, lean into the Neapolitan/sourdough angle if that's your personal style
- [ ] **r/Breadit** — Good audience for the sourdough mode specifically
- [ ] **Hacker News "Show HN"** — Keep it short: what it does, why you built it, what makes it different (static, no tracking, no accounts). Post on a weekday morning US time for visibility.
- [ ] **PizzaMaking.com forum** — Niche but highly targeted; the community there actually cares about baker's percentages and fermentation math

---

## Post-Launch

- [ ] Check Search Console after 1–2 weeks to see which queries are driving impressions
- [ ] Note any user feedback and add actionable items to `docs/roadmap/backlog.md`
- [ ] Update `docs/changelog.md` with the launch entry
