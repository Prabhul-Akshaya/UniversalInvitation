# Universal Digital Invitation

A complete, production-ready digital invitation website that works for **any celebration** — engagement, wedding, reception, birthday, anniversary, baby shower, bridal shower, housewarming, naming ceremony, graduation, religious ceremony, corporate event, or any other occasion.

The website is a **generic invitation engine**. All event-specific content comes from a single configuration file: `data/invitation.json`. You never need to edit HTML, CSS, or JavaScript to create a new invitation.

---

## How It Works

```
data/invitation.json  (your content & settings)
        ↓
JavaScript Invitation Engine  (reads config, builds the page)
        ↓
HTML + CSS  (structure & presentation)
```

To create a new invitation for a different event, you only:

1. Edit `data/invitation.json`
2. Replace/add images in `assets/images/`
3. Replace/add music in `assets/music/`
4. Upload to GitHub

---

## Project Structure

```
universal-invitation/
├── index.html          ← structural containers only (no event-specific content)
├── README.md
├── .nojekyll           ← tells GitHub Pages to serve files as-is
├── data/
│   └── invitation.json ← single source of truth for everything
├── css/
│   └── style.css       ← theme engine, responsive, animations
├── js/
│   └── script.js       ← invitation engine (loads JSON, renders everything)
└── assets/
    ├── images/          ← hero, gallery, story, host photos, favicon
    ├── music/           ← background music file
    └── icons/           ← SVG decorative icons
```

No build process. No npm, no frameworks, no backend, no database. Just HTML, CSS, vanilla JavaScript, JSON, and SVG.

---

## Setup: Upload to GitHub

1. Create a new repository on GitHub (e.g., `my-invitation`).
2. Upload all files from this project to the repository.
3. Go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder.
5. Click **Save**. Your invitation will be live at `https://yourusername.github.io/my-invitation/`.

---

## Configuration: `data/invitation.json`

This is the **only file you need to edit** to customize your invitation. Below is a guide to every section.

### Meta & Site

```json
"meta": {
  "eventType": "engagement",
  "language": "en",
  "title": "Ananya & Arjun",
  "description": "Join us as we celebrate a beautiful beginning."
}
```

- `eventType` — used for SEO and data attributes only, never for conditional logic.
- `title` — appears in browser tab and social sharing previews.
- `description` — used for SEO meta description.

### Hosts (People)

Works for any number of people — one, two, or more.

```json
"hosts": {
  "enabled": true,
  "people": [
    { "name": "Ananya", "role": "Bride", "image": "assets/images/ananya.jpg" },
    { "name": "Arjun", "role": "Groom", "image": "assets/images/arjun.jpg" }
  ],
  "displayName": "Ananya & Arjun"
}
```

For a birthday, use one person:

```json
"hosts": {
  "people": [
    { "name": "Rahul", "role": "Birthday Star" }
  ]
}
```

For an anniversary:

```json
"hosts": {
  "people": [
    { "name": "John", "role": "" },
    { "name": "Mary", "role": "" }
  ]
}
```

If `image` is empty, a placeholder with the person's initial is shown.

### Invitation Message

```json
"invitation": {
  "enabled": true,
  "eyebrow": "Together with their families",
  "title": "We invite you to celebrate",
  "subtitle": "Our Engagement",
  "message": "With joyful hearts, we invite you to share this beautiful occasion with us.",
  "signature": "With love, Ananya & Arjun"
}
```

### Hero

```json
"hero": {
  "enabled": true,
  "backgroundImage": "assets/images/hero.jpg",
  "eyebrow": "Together with their families",
  "title": "Ananya & Arjun",
  "subtitle": "Our Engagement",
  "description": "A beautiful beginning to a lifetime of togetherness.",
  "button": { "enabled": true, "label": "Explore Invitation", "target": "event" },
  "scrollIndicator": true
}
```

- `backgroundImage` — full-bleed background photo.
- `button.target` — the section ID to scroll to (e.g., `event`, `rsvp`, `story`).
- If the background image fails to load, the theme's primary color is used as fallback.

### Event Details

```json
"event": {
  "enabled": true,
  "type": "Engagement Ceremony",
  "date": {
    "iso": "2026-12-20"
  },
  "time": {
    "display": "11:00 AM",
    "timezone": "Asia/Kolkata",
    "utcOffset": "+05:30"
  },
  "venue": {
    "name": "Grand Celebration Hall",
    "address": "123 MG Road, Statue Junction",
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "country": "India"
  }
}
```

- If `date.display` and `date.day` are left empty, the engine automatically derives the day name and formatted date from `date.iso`.
- To override the auto-derived format, set `date.displayOverride`.

### Countdown

```json
"countdown": {
  "enabled": true,
  "target": "2026-12-20T11:00:00+05:30",
  "beforeMessage": "The celebration begins in",
  "completedMessage": "The celebration has begun",
  "showDays": true,
  "showHours": true,
  "showMinutes": true,
  "showSeconds": true,
  "labels": {
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds"
  }
}
```

- `target` must include the timezone offset (e.g., `+05:30`) so the countdown is calculated correctly regardless of the visitor's local timezone.
- When the countdown reaches zero, the `completedMessage` is shown.

### Location

```json
"location": {
  "enabled": true,
  "title": "Find Us",
  "description": "We look forward to celebrating with you.",
  "name": "Grand Celebration Hall",
  "address": "123 MG Road, Statue Junction, Thiruvananthapuram, Kerala, India",
  "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=...",
  "buttonText": "Open in Google Maps"
}
```

- If `googleMapsUrl` is empty, the Maps button is hidden but the address is still shown.

### Story / Timeline

```json
"story": {
  "enabled": true,
  "title": "Our Story",
  "items": [
    {
      "title": "How It Began",
      "date": "Spring 2022",
      "text": "Our story began...",
      "image": "assets/images/story-01.jpg"
    }
  ]
}
```

- The title is fully configurable — use "Our Journey", "How We Met", "The Story", etc.
- Each item supports an optional image. If the image is missing, the text still displays.
- If `items` is empty, the section is not rendered.

### Gallery

```json
"gallery": {
  "enabled": true,
  "title": "Beautiful Moments",
  "layout": "masonry",
  "lightbox": true,
  "images": [
    { "src": "assets/images/photo-01.jpg", "alt": "Couple", "caption": "Forever" }
  ]
}
```

- Supports any number of images.
- Lightbox with keyboard navigation (arrow keys, Escape), swipe-friendly on mobile.
- If `images` is empty, the gallery is not rendered.

### RSVP / Contact

```json
"rsvp": {
  "enabled": true,
  "title": "RSVP",
  "message": "We would love to know if you can join us.",
  "whatsapp": {
    "enabled": true,
    "number": "919999999999",
    "messageTemplate": "Hello! I would like to confirm my attendance for {{eventTitle}} on {{eventDate}} at {{venue}}."
  },
  "phone": { "enabled": true, "number": "+919999999999" },
  "email": { "enabled": true, "address": "rsvp@example.com", "subject": "RSVP: {{eventTitle}}" },
  "googleForm": { "enabled": false, "url": "" }
}
```

- Any method that is disabled or empty is simply not rendered.
- WhatsApp and email support template placeholders (see below).

### Music

```json
"music": {
  "enabled": true,
  "source": "assets/music/background.mp3",
  "autoplay": false,
  "loop": true,
  "volume": 0.5,
  "buttonLabel": "Music"
}
```

- Browsers block autoplay until user interaction. If `autoplay` is `true`, music starts on the first click/tap.
- If the music file is missing, the music control is hidden and the invitation continues normally.

### Theme

```json
"theme": {
  "primary": "#7A1838",
  "secondary": "#C8A24A",
  "background": "#FBF7EF",
  "surface": "#FFFDF8",
  "text": "#35251F",
  "muted": "#75655D",
  "accent": "#9B6A2E",
  "fonts": {
    "heading": "'Playfair Display', Georgia, serif",
    "body": "'Inter', sans-serif"
  },
  "googleFonts": "Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600"
}
```

- All colors are converted to CSS custom properties (`--primary`, `--secondary`, etc.) and applied dynamically.
- No hard-coded colors in CSS — everything references the theme variables.
- `googleFonts` is optional. If omitted or if fonts fail to load, system-safe fallbacks are used.

### Navigation

```json
"navigation": {
  "enabled": true,
  "items": [
    { "label": "Home", "target": "hero" },
    { "label": "Story", "target": "story" },
    { "label": "RSVP", "target": "rsvp" }
  ]
}
```

- Navigation links are generated entirely from JSON.
- On mobile, navigation collapses into a hamburger menu.

### Section Visibility & Order

```json
"sections": {
  "hero": true,
  "invitation": true,
  "hosts": true,
  "countdown": true,
  "story": true,
  "gallery": true,
  "event": true,
  "location": true,
  "rsvp": true,
  "footer": true
}
```

Set any section to `false` to hide it.

```json
"sectionOrder": [
  "hero", "invitation", "hosts", "countdown",
  "story", "gallery", "event", "location", "rsvp", "footer"
]
```

Reorder sections simply by rearranging this array. No code changes needed.

### Content Blocks (Custom Sections)

Add arbitrary informational sections without touching code:

```json
"contentBlocks": [
  {
    "enabled": true,
    "id": "dress-code",
    "title": "Dress Code",
    "text": "Elegant traditional attire in shades of maroon and gold.",
    "image": ""
  },
  {
    "enabled": true,
    "id": "special-note",
    "title": "A Special Note",
    "text": "Your presence means the world to us.",
    "image": ""
  }
]
```

Content blocks are automatically inserted before the footer.

### Decorations & Animations

```json
"decorations": {
  "enabled": true,
  "style": "elegant",
  "elements": ["sparkles", "flowers", "rings"]
}
```

Available elements: `sparkles`, `hearts`, `flowers`, `rings`, `stars`, `confetti`, `leaves`, `ornaments`.

```json
"animations": {
  "ring": { "enabled": true, "style": "luxury", "speed": "normal" },
  "revealOnScroll": true
}
```

- Set `ring.enabled` to `false` for non-engagement events (birthdays, etc.).
- `revealOnScroll` controls the fade-in-up animation as sections enter the viewport.

### Footer

```json
"footer": {
  "enabled": true,
  "message": "Made with love",
  "hashtag": "#AnanyaAndArjun"
}
```

### Social Links (Optional)

```json
"social": {
  "enabled": true,
  "links": [
    { "platform": "instagram", "url": "https://instagram.com/..." }
  ]
}
```

Supported platforms: `instagram`, `facebook`, `twitter`. If empty or disabled, the social section is hidden.

---

## Template Placeholders

The engine supports placeholders in RSVP messages, email subjects, and other text fields:

| Placeholder | Replaced with |
|---|---|
| `{{eventTitle}}` | `event.type` (e.g., "Engagement Ceremony") |
| `{{eventDate}}` | Auto-derived or configured date display |
| `{{eventTime}}` | `event.time.display` |
| `{{venue}}` | `event.venue.name` |
| `{{hostNames}}` | `hosts.displayName` or all host names joined |
| `{{site.title}}` | `site.title` |
| `{{meta.title}}` | `meta.title` |

---

## Photos

Place all images in `assets/images/`. Reference them in `invitation.json` using relative paths:

```json
"backgroundImage": "assets/images/hero.jpg"
```

You can also use external URLs (e.g., Pexels stock photos) directly in the JSON.

For the favicon, set `site.favicon` to your icon path.

---

## Music

Place your music file at `assets/music/background.mp3` (or update the path in `invitation.json`).

The music control appears as a floating button. Click to play/pause. If `autoplay` is enabled, playback starts on the first user interaction (browsers block autoplay otherwise).

---

## Changing the Event Type

To switch from an engagement to a birthday, wedding, anniversary, etc., only edit `invitation.json`:

### Engagement → Birthday

| Field | Change |
|---|---|
| `meta.eventType` | `"birthday"` |
| `meta.title` | `"Rahul's 30th Birthday"` |
| `hosts.people` | One person with `role: "Birthday Star"` |
| `event.type` | `"30th Birthday Celebration"` |
| `event.date.iso` | New date |
| `countdown.target` | New date-time with offset |
| `animations.ring.enabled` | `false` |
| `invitation.subtitle` | `"Rahul's 30th Birthday"` |
| `footer.hashtag` | `"#Rahul30"` |

### Engagement → Anniversary

| Field | Change |
|---|---|
| `meta.eventType` | `"anniversary"` |
| `meta.title` | `"John & Mary"` |
| `hosts.people` | Two people, roles can be empty |
| `event.type` | `"25th Wedding Anniversary"` |
| `story.title` | `"Our Journey"` |
| `animations.ring.enabled` | `true` (optional) |

No source-code changes needed for any of these.

---

## GitHub Pages

1. Push your repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to `main` branch, `/ (root)` folder.
4. Save. Your site is live at `https://yourusername.github.io/repository-name/`.

The `.nojekyll` file ensures GitHub Pages serves all files as-is (no Jekyll processing).

### Updating

```
Edit data/invitation.json
  ↓
Commit changes
  ↓
GitHub Pages automatically redeploys
```

Changes appear within a minute or two.

---

## Custom Domain

To use a custom domain (e.g., `invitation.yourname.com`):

1. Go to **Settings → Pages → Custom domain**.
2. Enter your domain and click **Save**.
3. Configure DNS with your domain provider:
   - For an apex domain: add an A record pointing to GitHub Pages IPs (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
   - For a subdomain: add a CNAME record pointing to `yourusername.github.io`.
4. Check **Enforce HTTPS** once the domain is verified.

---

## Local Testing

Because browsers block `fetch()` when opening `index.html` directly via `file://`, use a simple local server for testing:

**Option 1: VS Code Live Server extension**
- Install the "Live Server" extension in VS Code.
- Right-click `index.html` → **Open with Live Server**.

**Option 2: Python**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

**Option 3: Node**
```bash
npx serve
```

On GitHub Pages, the site works directly with no server needed.

---

## Features

- Fully data-driven — all content from `invitation.json`
- Works for any event type (engagement, wedding, birthday, anniversary, baby shower, etc.)
- Configurable theme (colors, fonts)
- Configurable section visibility and order
- Countdown timer with timezone support
- Gallery with lightbox (keyboard + touch)
- RSVP via WhatsApp, phone, email, or Google Form
- Background music with autoplay handling
- Ring animation (optional, for engagement/wedding)
- Decorative SVG elements (sparkles, hearts, flowers, etc.)
- Mobile-first responsive design (320px to 1440px+)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, reduced-motion support
- SEO and social sharing meta tags
- Lazy-loaded images
- Graceful error handling (missing images, missing music, invalid config)
- No build process, no frameworks, no dependencies
- GitHub Pages compatible with relative paths

---

## Technical Notes

- All paths in `invitation.json` must be **relative** (e.g., `assets/images/hero.jpg`, not `/assets/images/hero.jpg`) so the site works under `https://username.github.io/repository-name/`.
- The engine uses `textContent` for all user-visible text (safe against XSS). HTML is only used for internal SVG icons.
- External links use `target="_blank"` with `rel="noopener noreferrer"`.
- Images use `loading="lazy"` for performance.
- The loading screen disappears after content is ready.
- If `invitation.json` fails to load or is invalid, a friendly error message is shown (no technical stack trace).
