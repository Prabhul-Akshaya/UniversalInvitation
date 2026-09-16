/* ============================================================
   Universal Digital Invitation Engine
   Loads invitation.json, validates, applies theme, and
   dynamically renders all sections. No event-specific logic.
   ============================================================ */
console.log("SCRIPT.JS IS RUNNING");
(function () {
  "use strict";

  /* ---------- Tiny helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k === "dataset") Object.assign(node.dataset, v);
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else node.setAttribute(k, v);
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  };
  const icon = (name, size = 24) => {
    const paths = {
      calendar: '<path d="M7 2v3M17 2v3M3 7h18M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      pin: '<path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="11" r="2.2" fill="currentColor"/>',
      whatsapp: '<path d="M12 2a10 10 0 00-8.6 15l-1.4 5 5.1-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.4c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.4.1-.8-.1a9.6 9.6 0 01-2.8-1.8c-.5-.5-.9-1.1-1-1.3s0-.3.1-.4l.4-.4.2-.4v-.4c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.8 2.8 0 006 11a4.9 4.9 0 001 2.5 11 11 0 004.3 3.8c.6.3 1.1.4 1.5.5a3.6 3.6 0 001.6.1c.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1z" fill="currentColor"/>',
      phone: '<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.5.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3a1 1 0 011 1 11 11 0 00.6 3.5 1 1 0 01-.25 1z" fill="currentColor"/>',
      mail: '<path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      form: '<path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zM8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      map: '<path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      heart: '<path d="M12 21s-6.5-4.35-9-8.5C1 9 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 9 21 12.5 18.5 16.65 12 21 12 21z" fill="currentColor"/>',
      star: '<path d="M12 2l1.6 4.9h5.1l-4.1 3 1.6 4.9-4.2-3-4.2 3 1.6-4.9-4.1-3h5.1z" fill="currentColor"/>',
      sparkle: '<path d="M12 2l1 6 6 1-6 1-1 6-1-6-6-1 6-1z" fill="currentColor"/>',
      flower: '<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 4c2 3 2 5 0 7M12 20c-2-3-2-5 0-7M4 12c3-2 5-2 7 0M20 12c-3 2-5 2-7 0" fill="none" stroke="currentColor" stroke-width="1.5"/>',
      ring: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
      close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      chevronLeft: '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      chevronRight: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      arrowDown: '<path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>',
      facebook: '<path d="M14 9h3V6h-3a4 4 0 00-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z" fill="currentColor"/>',
      twitter: '<path d="M22 5.8a8.3 8.3 0 01-2.4.7A4.2 4.2 0 0021.5 4a8.4 8.4 0 01-2.7 1A4.2 4.2 0 0011.5 9a12 12 0 01-8.7-4.4 4.2 4.2 0 001.3 5.6A4.1 4.1 0 013 9.7v.1a4.2 4.2 0 003.4 4.1 4.2 4.2 0 01-1.9.1 4.2 4.2 0 003.9 2.9A8.5 8.5 0 012 18.4a12 12 0 006.4 1.9c7.7 0 12-6.4 12-12v-.5A8.5 8.5 0 0022 5.8z" fill="currentColor"/>',
      music: '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/>',
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = paths[name] || "";
    return svg;
  };

  /* ---------- Safe template replacement ---------- */
  function getNested(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }
  function fillTemplate(str, data) {
    if (typeof str !== "string") return str;
    return str.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const val = getNested(data, key.trim());
      return val !== undefined && val !== null ? String(val) : "";
    });
  }

  /* ---------- Defaults ---------- */
  const DEFAULTS = {
    meta: { language: "en", version: "1.0" },
    site: { loadingScreen: true },
    loading: { enabled: true, text: "Loading…" },
    hosts: { enabled: false, people: [] },
    invitation: { enabled: false },
    hero: { enabled: false, scrollIndicator: true, button: { enabled: false } },
    event: { enabled: false, date: {}, time: {}, venue: {} },
    countdown: { enabled: false, showDays: true, showHours: true, showMinutes: true, showSeconds: true, labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" } },
    location: { enabled: false, buttonText: "Open in Google Maps" },
    story: { enabled: false, items: [] },
    gallery: { enabled: false, images: [], lightbox: true },
    rsvp: { enabled: false, whatsapp: {}, phone: {}, email: {}, googleForm: {} },
    music: { enabled: false, autoplay: false, loop: true, volume: 0.5, buttonLabel: "Music" },
    theme: { primary: "#7A1838", secondary: "#C8A24A", background: "#FBF7EF", surface: "#FFFDF8", text: "#35251F", muted: "#75655D", accent: "#9B6A2E", fonts: { heading: "serif", body: "sans-serif" } },
    navigation: { enabled: false, items: [] },
    sections: {},
    sectionOrder: ["hero", "invitation", "hosts", "countdown", "story", "gallery", "event", "location", "rsvp", "footer"],
    contentBlocks: [],
    buttons: [],
    social: { enabled: false, links: [] },
    decorations: { enabled: false, elements: [] },
    animations: { ring: { enabled: false }, revealOnScroll: true },
    footer: { enabled: false },
  };

  function deepMerge(base, override) {
    const out = Array.isArray(base) ? [...base] : { ...base };
    if (override && typeof override === "object" && !Array.isArray(override)) {
      for (const k of Object.keys(override)) {
        if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && override[k] && typeof override[k] === "object") {
          out[k] = deepMerge(base[k], override[k]);
        } else {
          out[k] = override[k];
        }
      }
    }
    return out;
  }

  /* ---------- Validation ---------- */
  const REQUIRED = ["meta", "site", "invitation", "event", "theme", "sections"];
  function validate(d) {
    for (const key of REQUIRED) {
      if (!d || typeof d !== "object" || !(key in d)) return false;
    }
    if (!d.meta || !d.meta.title) return false;
    return true;
  }

  /* ---------- Theme application ---------- */
  function applyTheme(theme) {
    const root = document.documentElement;
    const map = {
      "--primary": theme.primary,
      "--secondary": theme.secondary,
      "--background": theme.background,
      "--surface": theme.surface,
      "--text": theme.text,
      "--muted": theme.muted,
      "--accent": theme.accent || theme.secondary,
      "--font-heading": theme.fonts && theme.fonts.heading ? theme.fonts.heading : "serif",
      "--font-body": theme.fonts && theme.fonts.body ? theme.fonts.body : "sans-serif",
    };
    for (const [prop, val] of Object.entries(map)) {
      if (val) root.style.setProperty(prop, val);
    }
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme && theme.primary) metaTheme.setAttribute("content", theme.primary);
    if (theme.googleFonts) {
      const link = $("#google-fonts-link");
      if (link) link.href = `https://fonts.googleapis.com/css2?family=${theme.googleFonts}&display=swap`;
    }
  }

  /* ---------- SEO / meta ---------- */
  function applyMeta(d) {
    const t = d.meta.title || d.site.title || "Invitation";
    const desc = d.meta.description || "";
    document.title = t;
    $('meta[name="description"]')?.setAttribute("content", desc);
    $('meta[property="og:title"]')?.setAttribute("content", t);
    $('meta[property="og:description"]')?.setAttribute("content", desc);
    $('meta[name="twitter:title"]')?.setAttribute("content", t);
    $('meta[name="twitter:description"]')?.setAttribute("content", desc);
    const ogImage = d.hero && d.hero.backgroundImage ? d.hero.backgroundImage : "";
    if (ogImage) {
      $('meta[property="og:image"]')?.setAttribute("content", ogImage);
      $('meta[name="twitter:image"]')?.setAttribute("content", ogImage);
    }
    if (d.site && d.site.favicon) {
      $('link[rel="icon"]')?.setAttribute("href", d.site.favicon);
    }
    if (d.meta && d.meta.language) {
      document.documentElement.lang = d.meta.language;
    }
    if (d.meta && d.meta.eventType) {
      document.documentElement.dataset.eventType = d.meta.eventType;
    }
  }

  /* ---------- Date helpers ---------- */
  function deriveDateDisplay(eventData) {
    const date = eventData.date || {};
    if (date.displayOverride) return { display: date.displayOverride, day: date.day || "" };
    if (date.display && date.day) return { display: date.display, day: date.day };
    if (!date.iso) return { display: date.display || "", day: date.day || "" };
    try {
      const dt = new Date(date.iso + "T00:00:00");
      if (isNaN(dt.getTime())) return { display: date.display || "", day: date.day || "" };
      const dayName = dt.toLocaleDateString("en-US", { weekday: "long" });
      const fullDate = dt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      return { display: fullDate, day: dayName };
    } catch {
      return { display: date.display || "", day: date.day || "" };
    }
  }

  /* ---------- Image error handler ---------- */
  function safeImg(src, alt, cls) {
    const img = el("img", { src, alt: alt || "", loading: "lazy", class: cls || "" });
    img.addEventListener("error", () => {
      const parent = img.parentElement;
      if (parent) {
        img.remove();
        if (parent.classList.contains("gallery-item")) parent.classList.add("hidden");
        else if (parent.classList.contains("hero-bg")) {
          parent.style.background = "var(--primary)";
        } else if (parent.classList.contains("timeline-image") || parent.classList.contains("content-block-image")) {
          parent.classList.add("hidden");
        } else if (parent.classList.contains("host-image-wrap")) {
          const ph = el("div", { class: "host-image-placeholder" }, (alt || "?").charAt(0).toUpperCase());
          parent.append(ph);
          img.remove();
        }
      }
    });
    return img;
  }

  /* ---------- Section builders ---------- */
  const builders = {};

  builders.hero = function (d) {
    const h = d.hero;
    const sec = el("section", { id: "hero", class: "hero section", "aria-label": "Hero" });
    if (h.backgroundImage) {
      const bg = el("div", { class: "hero-bg" });
      bg.append(safeImg(h.backgroundImage, h.title || "", "hero-bg-img"));
      sec.append(bg);
    } else {
      sec.style.background = "var(--primary)";
    }
    const content = el("div", { class: "hero-content reveal" });
    if (h.eyebrow) content.append(el("p", { class: "hero-eyebrow", text: h.eyebrow }));
    if (h.title) content.append(el("h1", { class: "hero-title", text: h.title }));
    if (h.subtitle) content.append(el("p", { class: "hero-subtitle", text: h.subtitle }));
    if (h.description) content.append(el("p", { class: "hero-description", text: h.description }));
    if (h.button && h.button.enabled && h.button.target) {
      const btn = el("a", { class: "hero-button", text: h.button.label || "Explore", role: "button", href: `#${h.button.target}` });
      content.append(btn);
    }
    if (h.foregroundImage) {
      content.append(safeImg(h.foregroundImage, "", "hero-foreground"));
    }
    sec.append(content);
    if (h.scrollIndicator) {
      sec.append(el("div", { class: "hero-scroll", "aria-hidden": "true" },
        el("span", { text: "Scroll" }),
        el("div", { class: "hero-scroll-arrow" })
      ));
    }
    return sec;
  };

  builders.invitation = function (d) {
    const inv = d.invitation;
    const sec = el("section", { id: "invitation", class: "invitation section", "aria-label": "Invitation" });
    const inner = el("div", { class: "section-inner reveal" });
    if (inv.eyebrow) inner.append(el("p", { class: "invitation-eyebrow", text: inv.eyebrow }));
    if (inv.title) inner.append(el("h2", { class: "invitation-title", text: inv.title }));
    if (inv.subtitle) inner.append(el("p", { class: "invitation-subtitle", text: inv.subtitle }));
    if (inv.message) inner.append(el("p", { class: "invitation-message", text: inv.message }));
    if (inv.signature) inner.append(el("p", { class: "invitation-signature", text: inv.signature }));
    sec.append(inner);
    return sec;
  };

  builders.hosts = function (d) {
    const hosts = d.hosts;
    const sec = el("section", { id: "hosts", class: "hosts section", "aria-label": "Hosts" });
    const inner = el("div", { class: "section-inner reveal" });
    inner.append(el("div", { class: "section-divider" },
      el("div", { class: "section-divider-line" }),
      el("span", { html: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-6.5-4.35-9-8.5C1 9 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 9 21 12.5 18.5 16.65 12 21 12 21z" fill="currentColor"/></svg>' }),
      el("div", { class: "section-divider-line" })
    ));
    const grid = el("div", { class: "hosts-grid" });
    (hosts.people || []).forEach((person) => {
      const card = el("div", { class: "host-card" });
      const wrap = el("div", { class: "host-image-wrap" });
      if (person.image) {
        wrap.append(safeImg(person.image, person.name || "", ""));
      } else {
        wrap.append(el("div", { class: "host-image-placeholder", text: (person.name || "?").charAt(0).toUpperCase() }));
      }
      card.append(wrap);
      if (person.name) card.append(el("h3", { class: "host-name", text: person.name }));
      if (person.role) card.append(el("p", { class: "host-role", text: person.role }));
      grid.append(card);
    });
    inner.append(grid);
    if (hosts.displayName) inner.append(el("p", { class: "hosts-display-name", text: hosts.displayName }));
    sec.append(inner);
    return sec;
  };

  builders.countdown = function (d) {
    const cd = d.countdown;
    const sec = el("section", { id: "countdown", class: "countdown section", "aria-label": "Countdown" });
    const inner = el("div", { class: "section-inner reveal" });
    if (cd.beforeMessage) inner.append(el("p", { class: "countdown-message", text: cd.beforeMessage }));
    const grid = el("div", { class: "countdown-grid", id: "countdown-grid" });
    const units = [
      { key: "days", show: cd.showDays, label: cd.labels.days },
      { key: "hours", show: cd.showHours, label: cd.labels.hours },
      { key: "minutes", show: cd.showMinutes, label: cd.labels.minutes },
      { key: "seconds", show: cd.showSeconds, label: cd.labels.seconds },
    ];
    units.forEach((u) => {
      if (u.show === false) return;
      grid.append(el("div", { class: "countdown-item" },
        el("span", { class: "countdown-number", id: `cd-${u.key}`, text: "00" }),
        el("span", { class: "countdown-label", text: u.label })
      ));
    });
    inner.append(grid);
    const completed = el("p", { class: "countdown-completed hidden", id: "countdown-completed", text: cd.completedMessage || "The celebration has begun" });
    inner.append(completed);
    sec.append(inner);
    return sec;
  };

  builders.story = function (d) {
    const story = d.story;
    const sec = el("section", { id: "story", class: "story section", "aria-label": "Story" });
    const inner = el("div", { class: "section-inner reveal" });
    if (story.title) inner.append(el("h2", { class: "section-title", text: story.title }));
    const timeline = el("div", { class: "timeline" });
    (story.items || []).forEach((item, i) => {
      const tItem = el("div", { class: "timeline-item reveal" });
      tItem.append(el("div", { class: "timeline-marker" }, icon("heart", 18)));
      const content = el("div", { class: "timeline-content" });
      if (item.image) {
        const imgWrap = el("div", { class: "timeline-image" });
        imgWrap.append(safeImg(item.image, item.title || "", ""));
        content.append(imgWrap);
      }
      if (item.title) content.append(el("h3", { class: "timeline-title", text: item.title }));
      if (item.date) content.append(el("p", { class: "timeline-date", text: item.date }));
      if (item.text) content.append(el("p", { class: "timeline-text", text: item.text }));
      tItem.append(content);
      timeline.append(tItem);
    });
    inner.append(timeline);
    sec.append(inner);
    return sec;
  };

  builders.gallery = function (d) {
    const g = d.gallery;
    const sec = el("section", { id: "gallery", class: "gallery section", "aria-label": "Gallery" });
    const inner = el("div", { class: "section-inner reveal" });
    if (g.title) inner.append(el("h2", { class: "section-title", text: g.title }));
    const grid = el("div", { class: "gallery-grid", id: "gallery-grid" });
    (g.images || []).forEach((img, i) => {
      const item = el("figure", { class: "gallery-item", dataset: { index: String(i) }, tabindex: "0", role: "button", "aria-label": img.alt || `Photo ${i + 1}` });
      item.append(safeImg(img.src, img.alt || "", ""));
      if (img.caption) item.append(el("figcaption", { class: "gallery-caption", text: img.caption }));
      grid.append(item);
    });
    inner.append(grid);
    sec.append(inner);
    return sec;
  };

  builders.event = function (d) {
    const ev = d.event;
    const sec = el("section", { id: "event", class: "event-section section", "aria-label": "Event details" });
    const inner = el("div", { class: "section-inner reveal" });
    const card = el("div", { class: "event-card" });
    if (ev.type) card.append(el("p", { class: "event-type", text: ev.type }));
    const dateInfo = deriveDateDisplay(ev);
    if (dateInfo.display) {
      card.append(el("div", { class: "event-detail-icon" }, icon("calendar", 24)));
      card.append(el("p", { class: "event-date", text: dateInfo.display }));
    }
    if (dateInfo.day) card.append(el("p", { class: "event-day", text: dateInfo.day }));
    if (ev.time && ev.time.display) {
      card.append(el("div", { class: "event-detail-icon", style: { marginTop: "16px" } }, icon("clock", 24)));
      card.append(el("p", { class: "event-time", text: ev.time.display }));
    }
    if (ev.venue && (ev.venue.name || ev.venue.address)) {
      card.append(el("div", { class: "event-detail-icon", style: { marginTop: "16px" } }, icon("pin", 24)));
      if (ev.venue.name) card.append(el("p", { class: "event-venue-name", text: ev.venue.name }));
      const addrParts = [ev.venue.address, ev.venue.city, ev.venue.state, ev.venue.country].filter(Boolean);
      if (addrParts.length) card.append(el("p", { class: "event-venue-address", text: addrParts.join(", ") }));
    }
    inner.append(card);
    sec.append(inner);
    return sec;
  };

  builders.location = function (d) {
    const loc = d.location;
    const sec = el("section", { id: "location", class: "location section", "aria-label": "Location" });
    const inner = el("div", { class: "section-inner reveal" });
    if (loc.title) inner.append(el("h2", { class: "section-title", text: loc.title }));
    if (loc.description) inner.append(el("p", { class: "section-subtitle", text: loc.description }));
    const card = el("div", { class: "location-card" });
    card.append(el("div", { class: "event-detail-icon" }, icon("map", 28)));
    if (loc.name) card.append(el("p", { class: "location-name", text: loc.name }));
    if (loc.address) card.append(el("p", { class: "location-address", text: loc.address }));
    if (loc.googleMapsUrl) {
      card.append(el("a", { class: "location-button", href: loc.googleMapsUrl, target: "_blank", rel: "noopener noreferrer" },
        icon("map", 18),
        el("span", { text: loc.buttonText || "Open in Google Maps" })
      ));
    }
    inner.append(card);
    sec.append(inner);
    return sec;
  };

  builders.rsvp = function (d) {
    const r = d.rsvp;
    const sec = el("section", { id: "rsvp", class: "rsvp section", "aria-label": "RSVP" });
    const inner = el("div", { class: "section-inner reveal" });
    if (r.title) inner.append(el("h2", { class: "section-title", text: r.title }));
    if (r.message) inner.append(el("p", { class: "rsvp-message", text: r.message }));
    const buttons = el("div", { class: "rsvp-buttons" });

    const ctx = {
      eventTitle: d.event && d.event.type ? d.event.type : "",
      eventDate: deriveDateDisplay(d.event).display,
      eventTime: d.event && d.event.time ? d.event.time.display : "",
      venue: d.event && d.event.venue ? d.event.venue.name : "",
      hostNames: d.hosts && d.hosts.displayName ? d.hosts.displayName : (d.hosts && d.hosts.people ? d.hosts.people.map((p) => p.name).join(" & ") : ""),
    };

    if (r.whatsapp && r.whatsapp.enabled && r.whatsapp.number) {
      const msg = fillTemplate(r.whatsapp.messageTemplate || r.whatsapp.message || "", { ...d, ...ctx });
      const url = `https://wa.me/${r.whatsapp.number}?text=${encodeURIComponent(msg)}`;
      buttons.append(el("a", { class: "rsvp-button", href: url, target: "_blank", rel: "noopener noreferrer" },
        icon("whatsapp", 20), el("span", { text: "WhatsApp" })
      ));
    }
    if (r.phone && r.phone.enabled && r.phone.number) {
      buttons.append(el("a", { class: "rsvp-button", href: `tel:${r.phone.number}` },
        icon("phone", 20), el("span", { text: "Call" })
      ));
    }
    if (r.email && r.email.enabled && r.email.address) {
      const subject = fillTemplate(r.email.subject || "RSVP", { ...d, ...ctx });
      buttons.append(el("a", { class: "rsvp-button", href: `mailto:${r.email.address}?subject=${encodeURIComponent(subject)}` },
        icon("mail", 20), el("span", { text: "Email" })
      ));
    }
    if (r.googleForm && r.googleForm.enabled && r.googleForm.url) {
      buttons.append(el("a", { class: "rsvp-button", href: r.googleForm.url, target: "_blank", rel: "noopener noreferrer" },
        icon("form", 20), el("span", { text: "RSVP Form" })
      ));
    }
    inner.append(buttons);
    sec.append(inner);
    return sec;
  };

  builders.footer = function (d) {
    const f = d.footer;
    const sec = el("footer", { id: "footer", class: "footer", "aria-label": "Footer" });
    if (f.message) sec.append(el("p", { class: "footer-message", text: f.message }));
    if (f.hashtag) sec.append(el("p", { class: "footer-hashtag", text: f.hashtag }));
    if (d.social && d.social.enabled && d.social.links && d.social.links.length) {
      const socialWrap = el("div", { class: "footer-social" });
      d.social.links.forEach((link) => {
        const ic = icon(link.platform || "instagram", 22);
        socialWrap.append(el("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", "aria-label": link.platform || "Social link" }, ic));
      });
      sec.append(socialWrap);
    }
    return sec;
  };

  builders.contentBlock = function (block) {
    const sec = el("section", { id: `block-${block.id}`, class: "content-block section", "aria-label": block.title || block.id });
    const inner = el("div", { class: "section-inner reveal" });
    const card = el("div", { class: "content-block-card" });
    if (block.image) {
      const imgWrap = el("div", { class: "content-block-image" });
      imgWrap.append(safeImg(block.image, block.title || "", ""));
      card.append(imgWrap);
    }
    if (block.title) card.append(el("h3", { class: "content-block-title", text: block.title }));
    if (block.text) card.append(el("p", { class: "content-block-text", text: block.text }));
    inner.append(card);
    sec.append(inner);
    return sec;
  };

  /* ---------- Countdown logic ---------- */
  function startCountdown(d) {
    const cd = d.countdown;
    if (!cd || !cd.enabled || !cd.target) return;
    let target;
    try { target = new Date(cd.target); } catch { return; }
    if (isNaN(target.getTime())) return;
    const grid = $("#countdown-grid");
    const completed = $("#countdown-completed");
    if (!grid) return;

    function tick() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        grid.classList.add("hidden");
        if (completed) completed.classList.remove("hidden");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      const setVal = (id, val) => { const e = $(id); if (e) e.textContent = val; };
      if (cd.showDays !== false) setVal("#cd-days", pad(days));
      if (cd.showHours !== false) setVal("#cd-hours", pad(hours));
      if (cd.showMinutes !== false) setVal("#cd-minutes", pad(mins));
      if (cd.showSeconds !== false) setVal("#cd-seconds", pad(secs));
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Navigation ---------- */
  function buildNav(d) {
    const nav = $("#nav");
    const toggle = $("#nav-toggle");
    if (!d.navigation || !d.navigation.enabled || !d.navigation.items || !d.navigation.items.length) {
      nav.hidden = true;
      toggle.hidden = true;
      return;
    }
    nav.hidden = false;
    toggle.hidden = false;
    d.navigation.items.forEach((item) => {
      const link = el("a", { class: "nav-link", href: `#${item.target}`, text: item.label, "data-target": item.target });
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(item.target);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
      nav.append(link);
    });

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Scrolled state + active link
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
      const links = $$(".nav-link", nav);
      let active = null;
      for (const link of links) {
        const target = document.getElementById(link.dataset.target);
        if (target) {
          const rect = target.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) { active = link; break; }
        }
      }
      links.forEach((l) => l.classList.toggle("active", l === active));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Music ---------- */
  function buildMusic(d) {
    const m = d.music;
    const ctrl = $("#music-control");
    if (!m || !m.enabled || !m.source) { ctrl.hidden = true; return; }
    ctrl.hidden = false;
    const audio = new Audio(m.source);
    audio.loop = !!m.loop;
    audio.volume = m.volume != null ? m.volume : 0.5;
    let playing = false;

    const bars = el("div", { class: "music-icon-bars", "aria-hidden": "true" },
      el("span"), el("span"), el("span")
    );
    const label = el("span", { class: "sr-only", text: m.buttonLabel || "Music" });
    ctrl.append(bars, label);
    ctrl.setAttribute("role", "button");
    ctrl.setAttribute("tabindex", "0");
    ctrl.setAttribute("aria-label", `${m.buttonLabel || "Music"} — click to play/pause`);

    function toggle() {
      if (playing) {
        audio.pause();
        playing = false;
        ctrl.classList.remove("playing");
        ctrl.setAttribute("aria-label", `${m.buttonLabel || "Music"} — click to play`);
      } else {
        audio.play().then(() => {
          playing = true;
          ctrl.classList.add("playing");
          ctrl.setAttribute("aria-label", `${m.buttonLabel || "Music"} — click to pause`);
        }).catch(() => {
          // Autoplay blocked or file missing — silently ignore
        });
      }
    }
    ctrl.addEventListener("click", toggle);
    ctrl.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });

    audio.addEventListener("error", () => { ctrl.hidden = true; });

    if (m.autoplay) {
      audio.play().then(() => { playing = true; ctrl.classList.add("playing"); }).catch(() => {
        // Try on first interaction
        const tryPlay = () => {
          audio.play().then(() => { playing = true; ctrl.classList.add("playing"); }).catch(() => {});
          document.removeEventListener("click", tryPlay);
          document.removeEventListener("touchstart", tryPlay);
        };
        document.addEventListener("click", tryPlay, { once: true });
        document.addEventListener("touchstart", tryPlay, { once: true });
      });
    }
  }

  /* ---------- Lightbox ---------- */
  function buildLightbox(d) {
    const g = d.gallery;
    if (!g || !g.enabled || !g.lightbox || !g.images || !g.images.length) return;
    const lb = $("#lightbox");
    let current = 0;
    const images = g.images;

    function open(index) {
      current = index;
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add("open"));
      render();
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      setTimeout(() => { lb.hidden = true; }, 350);
      document.body.style.overflow = "";
    }
    function render() {
      const img = images[current];
      lb.innerHTML = "";
      lb.append(el("button", { class: "lightbox-close", "aria-label": "Close", onclick: close }, icon("close", 24)));
      lb.append(el("span", { class: "lightbox-counter", text: `${current + 1} / ${images.length}` }));
      lb.append(safeImg(img.src, img.alt || "", "lightbox-image"));
      if (img.caption) lb.append(el("p", { class: "lightbox-caption", text: img.caption }));
      if (images.length > 1) {
        lb.append(el("button", { class: "lightbox-prev", "aria-label": "Previous", onclick: () => { current = (current - 1 + images.length) % images.length; render(); } }, icon("chevronLeft", 24)));
        lb.append(el("button", { class: "lightbox-next", "aria-label": "Next", onclick: () => { current = (current + 1) % images.length; render(); } }, icon("chevronRight", 24)));
      }
    }
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (lb.hidden || !lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" && images.length > 1) { current = (current - 1 + images.length) % images.length; render(); }
      else if (e.key === "ArrowRight" && images.length > 1) { current = (current + 1) % images.length; render(); }
    });

    // Attach to gallery items
    document.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item) {
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx)) open(idx);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.target.classList && e.target.classList.contains("gallery-item") && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        const idx = parseInt(e.target.dataset.index, 10);
        if (!isNaN(idx)) open(idx);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function setupReveal(d) {
    if (!d.animations || d.animations.revealOnScroll === false) {
      $$(".reveal").forEach((e) => e.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((e) => observer.observe(e));
  }

  /* ---------- Back to top ---------- */
  function setupBackToTop() {
    const btn = $("#back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Decorations ---------- */
  function addDecorations(d) {
    const dec = d.decorations;
    if (!dec || !dec.enabled || !dec.elements || !dec.elements.length) return;
    const decoIcons = { sparkles: "sparkle", hearts: "heart", flowers: "flower", rings: "ring", stars: "star", confetti: "star", leaves: "flower", ornaments: "flower" };
    // Add to a few sections
    const sections = $$(".section");
    sections.forEach((sec, i) => {
      if (i % 2 !== 0) return;
      const elem = dec.elements[i % dec.elements.length];
      const iconName = decoIcons[elem] || "sparkle";
      const deco = el("div", { class: `decoration deco-${elem === "sparkles" ? "sparkle" : "float"}`, style: { top: "10%", right: "5%", width: "40px", height: "40px" } }, icon(iconName, 40));
      sec.append(deco);
      const deco2 = el("div", { class: `decoration deco-${elem === "sparkles" ? "sparkle" : "float"}`, style: { bottom: "10%", left: "5%", width: "32px", height: "32px" } }, icon(iconName, 32));
      sec.append(deco2);
    });
  }

  /* ---------- Ring animation ---------- */
  function addRingAnimation(d) {
    if (!d.animations || !d.animations.ring || !d.animations.ring.enabled) return;
    // Insert near invitation or hero
    const target = $("#invitation") || $("#hero");
    if (!target) return;
    const ringWrap = el("div", { class: "ring-animation", "aria-hidden": "true" });
    ringWrap.innerHTML = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--secondary)"/><stop offset="1" stop-color="var(--accent)"/>
      </linearGradient></defs>
      <circle cx="60" cy="60" r="44" fill="none" stroke="url(#ringGrad)" stroke-width="6"/>
      <circle cx="60" cy="60" r="30" fill="none" stroke="url(#ringGrad)" stroke-width="4" opacity="0.7"/>
      <circle cx="60" cy="16" r="5" fill="var(--secondary)"/>
      <circle cx="60" cy="104" r="5" fill="var(--secondary)"/>
      <circle cx="16" cy="60" r="5" fill="var(--secondary)"/>
      <circle cx="104" cy="60" r="5" fill="var(--secondary)"/>
    </svg>`;
    target.append(ringWrap);
  }

  /* ---------- Main render ---------- */
  function render(d) {
    applyTheme(d.theme);
    applyMeta(d);

    const main = $("#main");
    const order = d.sectionOrder || DEFAULTS.sectionOrder;
    const sections = d.sections || {};

    order.forEach((key) => {
      // Check section visibility (default true if not in sections object)
      if (key in sections && sections[key] === false) return;
      if (key === "contentBlocks") return; // handled separately
      if (builders[key]) {
        const sectionData = d[key];
        // For sections that have their own "enabled" flag, respect it
        if (sectionData && typeof sectionData === "object" && "enabled" in sectionData && sectionData.enabled === false) return;
        // For gallery/story, also check non-empty
        if (key === "gallery" && (!sectionData.images || !sectionData.images.length)) return;
        if (key === "story" && (!sectionData.items || !sectionData.items.length)) return;
        if (key === "hosts" && (!sectionData.people || !sectionData.people.length)) return;
        if (key === "countdown" && !sectionData.target) return;
        main.append(builders[key](d));
      }
    });

    // Content blocks (inserted before footer if present, else at end)
    if (d.contentBlocks && d.contentBlocks.length) {
      const footer = $("#footer");
      d.contentBlocks.forEach((block) => {
        if (!block.enabled) return;
        const blockEl = builders.contentBlock(block);
        if (footer) footer.before(blockEl);
        else main.append(blockEl);
      });
    }

    buildNav(d);
    buildMusic(d);
    buildLightbox(d);
    addDecorations(d);
    addRingAnimation(d);
    setupReveal(d);
    setupBackToTop();
    startCountdown(d);

    // Show app
    const app = $("#app");
    app.hidden = false;
    requestAnimationFrame(() => app.classList.add("ready"));

    // Hide loading screen
    const loading = $("#loading-screen");
    if (loading) {
      setTimeout(() => loading.classList.add("hidden"), 400);
    }

    // Ensure page starts at top
    window.scrollTo(0, 0);
  }

  /* ---------- Boot ---------- */
  async function boot() {
     console.log("BOOT STARTED");
    try {
       console.log("BOOT fetch");
      const res = await fetch("data/invitation.json", { cache: "no-store" });
       console.log("fetch completed");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
       console.log("data json loaded",data);
      data = deepMerge(DEFAULTS, data);
      if (!validate(data)) {
        throw new Error("Invalid configuration");
      }
       console.log("RENDER STARTED");
      render(data);
       console.log("RENDER FINISHED");
    } catch (err) 
    {
     console.error("INVITATION BOOT ERROR:", err);
   
     const loading = $("#loading-screen");
     if (loading) loading.hidden = true;
   
     const errorScreen = $("#error-screen");
     if (errorScreen) errorScreen.hidden = false;
   }
  }

  if (document.readyState === "loading") {
     console.log("WAITING FOR DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
