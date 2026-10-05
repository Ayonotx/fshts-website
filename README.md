# Forces Senior High Technical School (FSHTS) — Website

Website for **Forces Senior High Technical School, Burma Camp, Accra, Ghana**.

- **Motto:** Knowledge, Service and Discipline
- **Slogan:** "Comrade!"
- **Crest dates the school:** 1982 (established 1978 as a JSS within the barracks)

Built with plain **HTML + CSS + JS** (no frameworks) plus Three.js (CDN) for the 3D hero.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — 3D hero, stats, programmes, why Forces, news, gallery preview |
| `about.html` | History timeline, motto/mission/vision, values, leadership |
| `academics.html` | All six programmes + facilities + portal callout |
| `admissions.html` | CSSPS application steps, requirements, FAQ |
| `gallery.html` | Filterable gallery with lightbox |
| `contact.html` | Contact info, enquiry form, map |

## Content sources

Facts were taken from the school's public listings and the Ghana Armed Forces
Education Directorate's post about FSHTS (motto & slogan), SHS Select / Ghana
High Schools listings (programmes, category, contacts) and the crest supplied
by the school. **News items on the home page are examples** — replace them with
real announcements before launch.

## Replace the placeholder gallery photos

Gallery tiles with a small icon are placeholders. To add a real photo:

1. Copy the photo into `assets/` (e.g. `assets/assembly.jpg`).
2. In `gallery.html`, replace a placeholder `<figure>` with:

```html
<figure class="gal-item has-photo" data-cat="campus" data-caption="Your caption">
  <img class="gal-photo" src="assets/assembly.jpg" alt="Caption">
  <figcaption>Your caption <span class="tag">Campus</span></figcaption>
</figure>
```

`data-cat` can be `campus`, `academics`, `events` or `sports`.

## Connect the contact form (before launch)

The form is a demo handler. Easiest real option: create a free form at
[formspree.io](https://formspree.io), then in `contact.html` set
`<form id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">`
and remove the demo submit handler in `js/main.js`.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Go live (GitHub Pages)

1. Push this folder to a GitHub repository.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / root → Save.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.

## Credits

- Photos and crest supplied by the school.
- Fonts: Space Grotesk & Inter (Google Fonts). Icons: inline SVG. 3D: Three.js r128.
