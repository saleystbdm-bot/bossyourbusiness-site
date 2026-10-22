# Boss Your Business — Deployment and Maintenance Manual

Site of Suresh Balachandar · SB Coaching Services · Chennai
Handover build: Build 28 · August 2026
Last updated: 24 September 2026

---

## 1. What you are holding

A fully static website. There is no build step, no framework, no database, no server side code, and no external dependency of any kind. Fonts are embedded in the CSS, and every page works offline. If you can serve files over HTTP, you can host this site.

```
/                       22 HTML pages (index.html is the home page)
assets/css/sb.css       the single stylesheet (fonts embedded, sections numbered in comments)
                        Sections 29 to 32 are the September corrections. Section 36 is the
                        visual pass by Saras of 24 September. Section 37 corrects the contrast
                        of the offerings matrix that section 36 introduced. Read 36 and 37
                        together, because 37 only exists to answer 36.
assets/js/sb.js         the single script (all behaviour for every page)
assets/img/             general images (webp)
assets/books/           the 100 book covers for Suresh's Deck (webp)
assets/prev/            preview images of the downloadable PDFs (webp)
assets/dl/              the free lead magnet PDFs (served to visitors)
assets/res/             page images of documents on the Resources page (webp)
assets/video/           the monthly reading film (mp4, h264)
assets/audio/           the free audio extracts for the 2 memberships (mp3)
tools/                  build helpers (not served; see section 7)
```

## 2. Deployment

1. Upload the entire folder (except `tools/`, which is optional) to the web root. `index.html` must sit at the root.
2. Serve over HTTPS. The canonical URLs in the pages point to `https://www.sureshbalachandar.in/` — if the domain differs, do a find and replace across the HTML files for that hostname.
3. Confirm your server sends correct MIME types for `.webp` (image/webp), `.mp4` (video/mp4) and `.pdf` (application/pdf). Most hosts do by default.
4. Suggested cache headers: long cache (30 days or more) for `assets/`, short or no cache for `*.html`, because the HTML pages are what change month to month.
5. There is nothing else to configure. No environment variables, no npm, no PHP.

### The join page (`join.html`)

`join.html` is the page that sells both monthly memberships. It carries a Razorpay
Subscription Button, which is a single button that any number of people can use.
Each person who presses it chooses Tamil or English, enters name, phone and email,
and Razorpay creates that person's own subscription automatically. Nothing is made
by hand any more. Five things about it.

1. It is a public page. Its address is given out in WhatsApp groups and on posters,
   so it must be reachable, indexable and fast. It is deliberately NOT in the top
   navigation, because it is reached from the two product pages and from a shared
   link rather than from browsing.
2. The Join Arangam button on `puthaga-paravai.html` and the Join The Table button
   on `readers-guide.html` both link to it. Please do not point them anywhere else.
   In particular, never point them at an `rzp.io` subscription link, because such a
   link belongs to one named person and a second person opening it joins the first
   person's membership.
3. It needs no Razorpay key of any kind. The button carries its own identity, which
   is the reference `pl_TngLYmBAYxDMdU` inside the page. An earlier version of this
   manual asked for a public Key ID. Ignore that. It no longer applies.
4. The Razorpay Key Secret is never put on this site, never in any file you deploy
   and never in a message. This page does not need it and will never ask for it. If
   anyone sends you one, do not use it and tell Suresh the same day.
5. It loads one external script, `https://cdn.razorpay.com/static/widget/subscription-button.js`.
   That is the only third party script on the whole site, so if you run a content
   security policy, that host has to be allowed.

To test it after deployment, open `https://www.sureshbalachandar.in/join.html` in a
browser. You should see a Razorpay card listing both memberships at ₹650 monthly,
with a Subscribe Now button under them. Please do not press Subscribe Now. It creates
a real subscription and takes a real payment. Suresh tests that himself.

With JavaScript switched off the page should say so plainly and show a WhatsApp
button, which is correct behaviour rather than a fault.

### The settings that matter

Everything that changes without touching the rest of the site sits in one block at
the top of `assets/js/sb.js`. Change a value there and every page on the site picks
it up the next time it loads. Do not edit buttons, links or pages individually.

```js
window.SB_BOOK   = '';              /* the Google Calendar booking link */
window.SB_WA     = '919840591014';  /* the WhatsApp number every button opens */
window.SB_GA4    = '';              /* the Google Analytics 4 Measurement ID */
window.SB_PIXEL  = '';              /* the Meta Pixel ID */
window.SB_LEADS  = '';              /* where a download gate posts the lead */
```

`SB_BOOK`. While it is empty every booking button falls back to WhatsApp. The day
there is a Google Calendar link, paste it here and every booking button follows.

`SB_WA`. Country code first, no plus sign and no spaces. 919840591014 is the number the
site runs on and it is the one on the WhatsApp API. 919840591016 sits in Suresh's
own phone, so change this line to
that on the day the API goes live. This single line moves all 131 links on the site.

`SB_GA4` and `SB_PIXEL`. While they are empty, nothing is loaded and nothing is
sent, so an unconfigured site costs the visitor nothing. Fill either one in and the
site starts recording, with these events already wired up: `lead_submit` on every
download gate, `quiz_complete` with the product recommended, `score_complete` with
the score out of 10, `whatsapp_click` with the page and the button, `booking_click`
and `download_click`.

`SB_LEADS`. The endpoint a lead is posted to the moment somebody fills in a gate.
The post is plain text JSON carrying name, number, the document wanted, the page,
the time and the source, and it is sent with `navigator.sendBeacon` so it survives
the page closing. While it is empty the gate still works and nothing is stored.

The order inside a gate is deliberate. The lead is posted first, WhatsApp opens
second, and the document downloads last, so a visitor has no reason to stop before
the message reaches Suresh.

### The top navigation

The header carries 7 items: Home, About me, Business Machine, CEO Coaching,
Puthaga Paravai, Reader's Guide and Resources. Both flagship engagements and
both memberships are in it by deliberate choice.

7 items need 1170 pixels of width before they stop wrapping onto a second line,
measured at every width from 1110 upward. The menu button therefore takes over
below 1220 pixels, which is section 32 of the stylesheet. If an eighth item is
ever added, measure again before shipping it, because 8 items wrap at 1280 and
at 1440 and the header breaks visibly.

Suresh's Deck is not in the header. It is reached from Resources, from the
footer and from 61 links across the site, so nothing is unreachable.

## 3. Monthly changes — Suresh's Deck (`deck.html`)

This page changes most often. It has 3 living sections.

### 3a. "Last month" (section 01, `#lastmonth`)

Each new month, Suresh supplies a film, the book covers, and one line per book.

1. **The film.** Encode to h264 mp4, 720p is enough (the current file is 5.5 MB for a 4 minute 45 second film — keep roughly that budget). Place it in `assets/video/` and update the `<video ... src="assets/video/...">` reference in `deck.html`. Extract a poster frame, save as webp in `assets/img/`, update the `poster` attribute.
2. **The heading.** Update the `h2` ("July 2026. 12 books, and the film where I talk them through.") with the new month and count.
3. **The book cards.** Inside `<div class="jgrid">` each book is one `<article class="jb">` with a cover image (webp in `assets/img/`, roughly 440 px wide), title, author, and a one line essence. Copy an existing card and edit. Cover images should be webp, quality about 85.

### 3b. "On my desk now" (section 02, `#deskday`)

Two holders, two current books. To change: replace the 2 cover images (`assets/img/now-*.webp`), and edit the title (`holder__h`), author (`holder__a`) and date line (`holder__since`) in the markup. 5 minute job.

### 3c. The Top 100 wall (section 03)

All 100 books live as JSON inside `deck.html` in one line: `window.SB_BOOKS = [...]`. Each entry:

| field | meaning |
|---|---|
| `n`, `k` | the book's number (1 to 100) |
| `t`, `a` | title, author |
| `s` | shelf (must match a filter chip exactly) |
| `c` | category label shown on the card |
| `g` | the gist (roughly 150 words, Suresh's own words) |
| `i` | cover filename inside `assets/books/` |
| `w` | 1 = the 8 page operator's note is written, 0 or absent = not yet |

When Suresh writes a new operator's note, set that book's `w` to 1 and update the count ("97 notes written") in the offer section if it changes. When a new year's 100 begins, this JSON and `assets/books/` are what get replaced.

## 4. Regular changes — Resources (`resources.html`)

The wall is designed to grow. Every piece on it is 2 things in the same file:

1. **A card** inside `<div class="rwall">` — copy an existing `<article class="rc rc--essay|rc--note|rc--case|rc--doc">` and edit. The card's `data-p` attribute points to the id of its full text. `data-t` is the type used by the filter chips (`essay`, `note`, `case`, `doc`).
2. **The full piece** inside `<div class="rlib" hidden>` — a hidden `<article id="rp-...">` holding the complete text (or, for documents, the page images). Copy an existing one and edit.

When you add pieces, update the counts on the filter chips ("Essays 5" and so on).

### Adding a designed document (carousel PDF)

Convert each PDF page to a webp image about 720 px wide (any tool works; with poppler + ImageMagick: `pdftoppm -png -r 72 doc.pdf page` then convert to webp at quality 80). Place the images in `assets/res/`, then create a card (`rc--doc`, using page 1 as the cover) and a hidden article whose `<div class="rp__pages">` lists all pages in order.

### House rules for any new copy (these are deliberate, please keep them)

Complete sentences. Numerals, never number words (3, not three). No dashes of any kind in copy — restructure the sentence instead. Plain English a non native reader follows easily. No emojis, no hashtags. Client names never appear; use roles ("a founder from Kerala"). No growth promises anywhere. Product names carry their full forms where they lead: RAAG is Revenue Architecture Audit and Guidance, SPRINT is Specific Problem Recognition and Implementation of Next level Transformation.

## 5. Things that must not change

The hero copy on the home page, the "What it changes" lines in the offerings table, the entry bar "between ₹1 crore and ₹100 crore", and the claim line "There are many business coaches, but there is only one SB." are locked wording. The site deliberately never states how many frameworks Suresh has, never names the 27 processes of the Business Machine, the 25 dimensions of CEO Coaching, the rung names in RAAG, or the personality system behind Profiling. That concealment is a design decision, not an omission.

## 6. Testing after any change

Open the changed page in a browser and check: the console shows 0 errors, no image is broken, the page reads correctly at phone width (390 px), and with the OS "reduce motion" setting on, nothing is invisible. That is the acceptance standard the site shipped with.

## 7. The tools folder (optional)

`tools/onefile.py` (Python 3, no libraries beyond Pillow-free stdlib) builds the entire site into ONE self contained HTML file with everything embedded — useful as an offline review copy to send to Suresh after changes. Run `python3 tools/onefile.py` from anywhere; it writes the file to the parent of the site folder. `tools/tenprinciples.py` regenerates one of the lead magnet PDFs. Neither is needed for hosting.

## 8. Contact

Content owner: Suresh Balachandar · the_coach@sureshbalachandar.in · +91 98405 91018.
All copy changes should be approved by him before going live; the words on this site are part of the product.
