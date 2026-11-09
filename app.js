/* alya.os: a small desktop that renders everything in content.js */
(() => {
  "use strict";

  const S = window.SITE;
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const isPhone = () => window.matchMedia("(max-width: 760px)").matches;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MENUBAR = 28;

  /* ---------------------------------------------------------------- icons */
  const TINTS = {
    blue: ["#3d8ae0", "#62a8f2", "#8cc2f7"],
    saffron: ["#d9862a", "#f0a94a", "#f7c77e"],
    rose: ["#c4566c", "#e27a8c", "#f0a3b0"],
    green: ["#3f8f5a", "#5fb177", "#8ccc9d"],
    plum: ["#6d4f9c", "#8f72c0", "#b59ddc"],
  };
  const ICON = {
    folder(tint = "blue") {
      const [back, front, hi] = TINTS[tint] || TINTS.blue;
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M5 15a4 4 0 0 1 4-4h14.5l5 5H55a4 4 0 0 1 4 4v6H5z" fill="${back}"/>
        <rect x="4" y="20" width="56" height="37" rx="4.5" fill="${front}"/>
        <rect x="4" y="20" width="56" height="3" rx="1.5" fill="${hi}" opacity=".9"/>
      </svg>`;
    },
    doc(ext = "TXT", band = "#7a7f8c", glyph = "") {
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 5h26l12 12v40a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill="#fdfcf9" stroke="rgba(0,0,0,.18)"/>
        <path d="M40 5v9a3 3 0 0 0 3 3h9" fill="#ecebe6" stroke="rgba(0,0,0,.18)"/>
        ${glyph || `<g stroke="#c9c6be" stroke-width="2" stroke-linecap="round"><path d="M18 24h22M18 30h26M18 36h18"/></g>`}
        <rect x="11" y="44" width="41" height="11" fill="${band}"/>
        <text x="31.5" y="52.3" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="7.5" font-weight="700" fill="#fff" letter-spacing=".5">${ext}</text>
      </svg>`;
    },
    video() {
      return ICON.doc("MP4", "#c4566c", `<path d="M26 22v16l13-8z" fill="#c4566c"/>`);
    },
    finderApp() {
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#3b7fe0"/>
        <rect x="3" y="3" width="58" height="29" rx="14" fill="#5b9cf0"/><rect x="3" y="20" width="58" height="12" fill="#5b9cf0"/>
        <path d="M16 22a3 3 0 0 1 3-3h8l3 3h15a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
      </svg>`;
    },
    terminalApp() {
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#1b1e24"/>
        <rect x="3.5" y="3.5" width="57" height="57" rx="13.5" fill="none" stroke="rgba(255,255,255,.14)"/>
        <path d="M15 22l9 8-9 8" fill="none" stroke="#f0b35b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M29 40h18" stroke="#d6dbe3" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`;
    },
    playerApp() {
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#2a1b2c"/>
        <circle cx="32" cy="32" r="17" fill="none" stroke="#f0a94a" stroke-width="3"/>
        <path d="M28 24v16l13-8z" fill="#f7ede0"/>
      </svg>`;
    },
    booksApp() {
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#f4ede1"/>
        <rect x="15" y="16" width="8" height="33" rx="1.5" fill="#28465e"/>
        <rect x="25" y="13" width="8" height="36" rx="1.5" fill="#d9862a"/>
        <rect x="36" y="18" width="8" height="31" rx="1.5" fill="#8a3b2e" transform="rotate(-12 40 33)"/>
        <rect x="12" y="49" width="40" height="3" rx="1.5" fill="#b9ad98"/>
      </svg>`;
    },
    linkApp(kind) {
      const bg = { github: "#24292f", youtube: "#c4302b", instagram: "#b8487a", linkedin: "#0a66c2", tiktok: "#111" }[kind] || "#555";
      const glyph = {
        github: `<path d="M24 25l-7 7 7 7M40 25l7 7-7 7M35 21l-6 22" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`,
        youtube: `<rect x="15" y="20" width="34" height="24" rx="7" fill="#fff"/><path d="M29 26v12l10-6z" fill="${bg}"/>`,
        instagram: `<rect x="17" y="17" width="30" height="30" rx="9" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="32" cy="32" r="7" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="41" cy="23" r="2" fill="#fff"/>`,
        linkedin: `<text x="32" y="41" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="24" fill="#fff">in</text>`,
        tiktok: `<path d="M34 16v22a6 6 0 1 1-6-6M34 16c1 5 4 8 9 8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`,
      }[kind] || "";
      return `<svg class="icon" viewBox="0 0 64 64" aria-hidden="true"><rect x="3" y="3" width="58" height="58" rx="14" fill="${bg}"/>${glyph}</svg>`;
    },
    small(kind) {
      const paths = {
        folder: `<path d="M1.5 4.5a1 1 0 0 1 1-1h3.5l1.3 1.3h6.2a1 1 0 0 1 1 1v6.7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
        link: `<path d="M6.5 9.5l3-3M7 4.8l1.3-1.3a2.4 2.4 0 0 1 3.4 3.4L10.4 8.2M9 11.2l-1.3 1.3a2.4 2.4 0 0 1-3.4-3.4L5.6 7.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>`,
      };
      return `<svg viewBox="0 0 16 16" aria-hidden="true" style="color:var(--select)">${paths[kind]}</svg>`;
    },
    ctl(kind) {
      const p = {
        prev: `<path d="M4 3v10M13 3L6 8l7 5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>`,
        next: `<path d="M12 3v10M3 3l7 5-7 5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>`,
        out: `<path d="M9 2h5v5M14 2L7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
        x: `<path d="M2 2l4 4M6 2L2 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
        min: `<path d="M1.5 4h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
        zoom: `<path d="M2 2h3.2L2 5.2zM6 6H2.8L6 2.8z" fill="currentColor"/>`,
      }[kind];
      const vb = ["x", "min", "zoom"].includes(kind) ? "0 0 8 8" : "0 0 16 16";
      return `<svg viewBox="${vb}" aria-hidden="true">${p}</svg>`;
    },
  };
  const COVER_COLORS = ["#28465e", "#8a3b2e", "#3d5a3a", "#5b3f6e", "#a8652a", "#2f4f4f", "#7a2f4c"];
  const coverHTML = (b, i) =>
    `<div class="cover" style="background:${COVER_COLORS[i % COVER_COLORS.length]}"><b>${esc(b.title)}</b><i>${esc(b.author)}</i></div>`;
  const linkKind = (label) => {
    const l = label.toLowerCase();
    return ["github", "youtube", "instagram", "linkedin", "tiktok"].find((k) => l.includes(k)) || "link";
  };
  const liveLinks = () => S.links.filter((l) => l.url);
  /* Small Markdown renderer for blog posts: headings, paragraphs, lists, quotes, code, links, images. */
  function md(src) {
    const safeUrl = (u) => (/^\s*javascript:/i.test(u) ? "#" : u);
    const inline = (t) =>
      esc(t)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${safeUrl(u)}" alt="${a}" loading="lazy">`)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, u) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">${a}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
    const out = [];
    let para = [], list = null, quote = [], code = null;
    const flushPara = () => { if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`); para = []; };
    const flushList = () => { if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`); list = null; };
    const flushQuote = () => { if (quote.length) out.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`); quote = []; };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };
    for (const line of src.replace(/\r/g, "").split("\n")) {
      if (code) {
        if (/^```/.test(line)) { out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`); code = null; }
        else code.push(line);
        continue;
      }
      let m;
      if (/^```/.test(line)) { flushAll(); code = []; }
      else if (!line.trim()) flushAll();
      else if ((m = line.match(/^(#{1,4})\s+(.*)/))) { flushAll(); const n = Math.min(4, m[1].length + 1); out.push(`<h${n}>${inline(m[2])}</h${n}>`); }
      else if (/^(-{3,}|\*{3,})\s*$/.test(line)) { flushAll(); out.push("<hr>"); }
      else if ((m = line.match(/^>\s?(.*)/))) { flushPara(); flushList(); quote.push(m[1]); }
      else if ((m = line.match(/^\s*([-*]|\d+\.)\s+(.*)/))) {
        flushPara(); flushQuote();
        const tag = /\d/.test(m[1]) ? "ol" : "ul";
        if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
        list.items.push(m[2]);
      }
      else if (list && /^\s{2,}\S/.test(line)) list.items[list.items.length - 1] += " " + line.trim();
      else { flushList(); flushQuote(); para.push(line.trim()); }
    }
    if (code) out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
    flushAll();
    return out.join("\n");
  }
  const posts = () => [...(S.blog || [])].map((p, i) => ({ ...p, i })).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const fmtDate = (d) => {
    const dt = new Date(`${d}T00:00:00`);
    return isNaN(dt) ? String(d || "") : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  const fetchPost = (p) =>
    fetch(`blog/${encodeURIComponent(p.file)}`).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); });

  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* ---------------------------------------------------------------- folders */
  const STATUS_LABEL = { reading: "Reading now", read: "Read", next: "Up next" };
  const episodes = [...S.podcast.episodes].sort((a, b) => b.no - a.no);

  const FOLDERS = {
    about: {
      name: "About Me",
      tint: "blue",
      desc: S.owner.tagline,
      groups: () => [
        {
          items: [
            { name: "about.txt", icon: ICON.doc("TXT"), open: openAbout },
            { name: "now.txt", icon: ICON.doc("TXT"), open: openNow },
            { name: "resume.pdf", icon: ICON.doc("PDF", "#c8443a"), open: openResume },
            ...(S.owner.photo
              ? [{ name: "me.jpg", icon: `<img class="icon" src="${esc(S.owner.photo)}" alt="" style="object-fit:cover;border-radius:6px">`, open: openPhoto }]
              : []),
          ],
        },
      ],
    },
    books: {
      name: "Books",
      tint: "saffron",
      desc: "What I'm reading and what I've read. I lean towards science-backed books about how the mind works.",
      groups: () =>
        ["reading", "read", "next"]
          .map((status) => ({
            label: STATUS_LABEL[status],
            items: S.books
              .map((b, i) => ({ b, i }))
              .filter(({ b }) => b.status === status)
              .map(({ b, i }) => ({ name: b.title, sub: b.author, icon: coverHTML(b, i), open: () => openBook(i) })),
          }))
          .filter((g) => g.items.length),
    },
    blog: {
      name: "Blog",
      tint: "plum",
      desc: "Things I'm thinking about, written down.",
      empty: "No posts yet. The first one is on its way.",
      groups: () => [
        { items: posts().map((p) => ({ name: p.title, sub: fmtDate(p.date), icon: ICON.doc("MD", "#6d4f9c"), open: () => openPost(p.i) })) },
      ],
    },
    podcast: {
      name: "Pretty Clever",
      tint: "rose",
      desc: S.podcast.blurb,
      groups: () => [
        {
          items: episodes.map((ep) => ({
            name: ep.title,
            sub: `EP ${String(ep.no).padStart(2, "0")}`,
            icon: ICON.video(),
            open: () => openPlayer(ep.no),
          })),
        },
      ],
    },
    projects: {
      name: "Projects",
      tint: "green",
      desc: "Things I've built. New ones landing soon.",
      empty: "Nothing here yet.",
      groups: () => [
        { items: S.projects.map((p, i) => ({ name: `${p.name}.md`, icon: ICON.doc("MD", "#3f8f5a"), open: () => openProject(i) })) },
      ],
    },
  };
  const FOLDER_ORDER = ["about", "books", "blog", "podcast", "projects"];

  /* ---------------------------------------------------------------- window manager */
  const layer = $("#windows");
  const wins = new Map();
  let zTop = 20;
  let cascade = 0;
  let uid = 0;

  function openWindow({ key, app, title, width = 640, height = 440, className = "", render }) {
    if (key && wins.has(key)) {
      const w = wins.get(key);
      if (w.el.hidden) w.el.hidden = false;
      focus(w.id);
      return w;
    }
    const id = `w${++uid}`;
    const el = document.createElement("section");
    el.className = `window ${className}`;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", title);
    el.innerHTML = `
      <div class="titlebar">
        <div class="lights">
          <button class="light close" aria-label="Close">${ICON.ctl("x")}</button>
          <button class="light min" aria-label="Minimise">${ICON.ctl("min")}</button>
          <button class="light zoom" aria-label="Zoom">${ICON.ctl("zoom")}</button>
        </div>
        <div class="title"></div>
      </div>
      <div class="body"></div>
      <div class="resize-handle" aria-hidden="true"></div>`;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(width, vw - 24);
    const hgt = Math.min(height, vh - MENUBAR - 110);
    const x = Math.max(12, Math.round((vw - w) / 2 + cascade - 60));
    const y = Math.max(MENUBAR + 12, Math.round(MENUBAR + 40 + cascade));
    cascade = (cascade + 28) % 140;
    Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hgt}px` });

    const win = { id, key, app, el, body: $(".body", el), state: {} };
    win.setTitle = (t) => {
      $(".title", el).textContent = t;
      el.setAttribute("aria-label", t);
    };
    win.setTitle(title);
    wins.set(key || id, win);
    win.mapKey = key || id;

    $(".close", el).addEventListener("click", (e) => { e.stopPropagation(); closeWindow(win); });
    $(".min", el).addEventListener("click", (e) => { e.stopPropagation(); minimise(win); });
    $(".zoom", el).addEventListener("click", (e) => { e.stopPropagation(); el.classList.toggle("maximized"); });
    el.addEventListener("pointerdown", () => focus(id));
    makeDraggable(win);

    layer.appendChild(el);
    render(win);
    focus(id);
    updateDock();
    return win;
  }

  function findWin(pred) {
    for (const w of wins.values()) if (pred(w)) return w;
    return null;
  }

  function focus(id) {
    let active = null;
    for (const w of wins.values()) {
      if (w.id === id) {
        w.el.style.zIndex = ++zTop;
        w.el.classList.remove("inactive");
        active = w;
      } else {
        w.el.classList.add("inactive");
      }
    }
    $("#activeApp").textContent = active ? active.app : "Finder";
  }

  function topVisible() {
    let best = null;
    for (const w of wins.values()) if (!w.el.hidden && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w;
    return best;
  }

  function closeWindow(win) {
    wins.delete(win.mapKey);
    const done = () => win.el.remove();
    if (reduceMotion()) done();
    else {
      win.el.classList.add("closing");
      setTimeout(done, 130);
    }
    const next = topVisible();
    if (next) focus(next.id);
    else $("#activeApp").textContent = "Finder";
    updateDock();
  }

  function minimise(win) {
    win.el.hidden = true;
    const next = topVisible();
    if (next) focus(next.id);
    else $("#activeApp").textContent = "Finder";
    updateDock();
  }

  function makeDraggable(win) {
    const el = win.el;
    const bar = $(".titlebar", el);
    const handle = $(".resize-handle", el);

    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".lights") || isPhone() || el.classList.contains("maximized") || e.button !== 0) return;
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const nx = Math.min(window.innerWidth - 80, Math.max(80 - el.offsetWidth, ox + ev.clientX - sx));
        const ny = Math.min(window.innerHeight - 50, Math.max(MENUBAR, oy + ev.clientY - sy));
        el.style.left = `${nx}px`;
        el.style.top = `${ny}px`;
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
    });
    bar.addEventListener("dblclick", (e) => {
      if (!e.target.closest(".lights") && !isPhone()) el.classList.toggle("maximized");
    });

    handle.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      const sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        el.style.width = `${Math.max(300, ow + ev.clientX - sx)}px`;
        el.style.height = `${Math.max(200, oh + ev.clientY - sy)}px`;
      };
      const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  /* Click selects, double-click opens. Touch and keyboard open on a single activation. */
  let lastPointer = "mouse";
  document.addEventListener("pointerdown", (e) => { lastPointer = e.pointerType; }, true);
  function bindOpen(btn, open, groupEl) {
    btn.addEventListener("click", (e) => {
      if (e.detail === 0 || lastPointer === "touch" || lastPointer === "pen") { open(); return; }
      groupEl.querySelectorAll(".selected").forEach((n) => n.classList.remove("selected"));
      btn.classList.add("selected");
    });
    btn.addEventListener("dblclick", open);
  }

  /* ---------------------------------------------------------------- finder */
  function openFinder(folderId) {
    const existing = findWin((w) => w.app === "Finder" && w.state.folder === folderId);
    if (existing) {
      existing.el.hidden = false;
      focus(existing.id);
      updateDock();
      return existing;
    }
    return openWindow({
      key: null,
      app: "Finder",
      title: FOLDERS[folderId].name,
      width: 780,
      height: 500,
      render: (win) => renderFinder(win, folderId),
    });
  }

  function renderFinder(win, folderId) {
    const f = FOLDERS[folderId];
    win.state.folder = folderId;
    win.setTitle(f.name);
    const groups = f.groups();
    const count = groups.reduce((n, g) => n + g.items.length, 0);

    win.body.innerHTML = `
      <div class="finder">
        <aside class="finder-side">
          <h3>Favourites</h3>
          ${FOLDER_ORDER.map(
            (id) => `<button class="side-link ${id === folderId ? "active" : ""}" data-go="${id}">${ICON.small("folder")}${esc(FOLDERS[id].name)}</button>`
          ).join("")}
          ${liveLinks().length ? `<h3>Elsewhere</h3>` : ""}
          ${liveLinks()
            .map((l) => `<a class="side-link" href="${esc(l.url)}" target="_blank" rel="noopener">${ICON.small("link")}${esc(l.label.replace("Pretty Clever on ", ""))}</a>`)
            .join("")}
        </aside>
        <div class="finder-main">
          <div class="finder-head"><div><h2>${esc(f.name)}</h2><p>${esc(f.desc)}</p></div></div>
          <div class="finder-items"></div>
          <div class="finder-foot">${count} item${count === 1 ? "" : "s"}</div>
        </div>
      </div>`;

    const itemsEl = $(".finder-items", win.body);
    if (!count) itemsEl.innerHTML = `<p class="finder-empty">${esc(f.empty || "This folder is empty.")}</p>`;
    groups.forEach((g) => {
      if (g.label) {
        const h = document.createElement("div");
        h.className = "finder-group";
        h.textContent = g.label;
        itemsEl.appendChild(h);
      }
      const grid = document.createElement("div");
      grid.className = "finder-grid";
      g.items.forEach((it) => {
        const b = document.createElement("button");
        b.className = "file";
        b.innerHTML = `${it.icon}<span>${esc(it.name)}</span>${it.sub ? `<small>${esc(it.sub)}</small>` : ""}`;
        bindOpen(b, it.open, itemsEl);
        grid.appendChild(b);
      });
      itemsEl.appendChild(grid);
    });

    win.body.querySelectorAll("[data-go]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const target = btn.dataset.go;
        const other = findWin((w) => w !== win && w.app === "Finder" && w.state.folder === target);
        if (other) { other.el.hidden = false; focus(other.id); }
        else renderFinder(win, target);
        updateDock();
      })
    );
  }

  /* ---------------------------------------------------------------- documents */
  function openDoc(key, title, html, app = "Preview", size = {}) {
    return openWindow({
      key,
      app,
      title,
      width: size.width || 600,
      height: size.height || 580,
      render: (win) => { win.body.innerHTML = `<article class="doc">${html}</article>`; },
    });
  }

  const linksHTML = () =>
    liveLinks().length
      ? `<div class="doc-actions">${liveLinks()
          .map((l) => `<a class="btn ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
          .join("")}</div>`
      : "";

  function openAbout() {
    openDoc(
      "about",
      "about.txt",
      `<h1>About me</h1><p class="meta">${esc(S.owner.role)} · ${esc(S.owner.location)}</p>
       ${S.about.bio.map((p) => `<p>${esc(p)}</p>`).join("")}${linksHTML()}`,
      "TextEdit"
    );
  }

  function openNow() {
    openDoc("now", "now.txt", `<h1>Now</h1><p class="meta">What I'm spending my time on.</p>
      <ul>${S.about.now.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`, "TextEdit", { height: 400 });
  }

  function openResume() {
    const r = S.resume;
    openDoc(
      "resume",
      "resume.pdf",
      `<h1>${esc(S.owner.name)}</h1><p class="meta">${esc(S.owner.role)} · ${esc(S.owner.location)}</p>
       ${S.owner.resumePdf ? `<div class="doc-actions"><a class="btn" href="${esc(S.owner.resumePdf)}" target="_blank" rel="noopener">Download PDF</a></div>` : ""}
       <h2>Experience</h2>
       ${r.experience
         .map(
           (x) => `<div class="cv-item"><strong>${esc(x.org)}</strong><span class="when">${esc(x.when)}</span>
             <span class="sub">${esc(x.role)}${x.where ? ` · ${esc(x.where)}` : ""}</span>
             <ul>${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`
         )
         .join("")}
       <h2>Education</h2>
       ${r.education.map((e) => `<div class="cv-item"><strong>${esc(e.org)}</strong><span class="when"></span><span class="sub">${esc(e.detail)}</span></div>`).join("")}`,
      "Preview",
      { width: 640, height: 640 }
    );
  }

  function openPhoto() {
    openWindow({
      key: "photo",
      app: "Preview",
      title: "me.jpg",
      width: 520,
      height: 600,
      render: (win) => { win.body.innerHTML = `<div class="photo-view"><img src="${esc(S.owner.photo)}" alt="${esc(S.owner.name)}"></div>`; },
    });
  }

  function openBook(i) {
    const b = S.books[i];
    openDoc(
      `book-${i}`,
      b.title,
      `<div class="book-sheet">${coverHTML(b, i)}<div>
        <span class="status-chip ${b.status}">${esc(STATUS_LABEL[b.status] || b.status)}</span>
        <h1 style="margin-top:10px">${esc(b.title)}</h1><p class="meta">${esc(b.author)}</p>
        ${b.note ? `<p>${esc(b.note)}</p>` : ""}</div></div>`,
      "Preview",
      { width: 560, height: 360 }
    );
  }

  function openProject(i) {
    const p = S.projects[i];
    openDoc(
      `project-${i}`,
      `${p.name}.md`,
      `<h1>${esc(p.name)}</h1><p class="meta">${esc(p.stack)}</p><p>${esc(p.summary)}</p>
       ${p.url ? `<div class="doc-actions"><a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">View project</a></div>` : ""}`,
      "TextEdit",
      { width: 540, height: 340 }
    );
  }

  function openPost(i) {
    const p = S.blog[i];
    openWindow({
      key: `post-${i}`,
      app: "TextEdit",
      title: p.file,
      width: 680,
      height: 640,
      render: (win) => {
        const head = `<h1>${esc(p.title)}</h1><p class="meta">${esc(fmtDate(p.date))}</p>`;
        win.body.innerHTML = `<article class="doc post">${head}<p class="meta">Loading…</p></article>`;
        fetchPost(p)
          .then((text) => {
            const body = text.replace(/^\s*#\s+.*\n/, ""); // the title is already shown above
            $(".post", win.body).innerHTML = head + md(body);
          })
          .catch(() => {
            $(".post", win.body).innerHTML = `${head}<p>This post couldn't be loaded. Check that <code>blog/${esc(p.file)}</code> exists in the repo.</p>`;
          });
      },
    });
  }

  function openWelcome() {
    openDoc(
      "welcome",
      "welcome.txt",
      `<h1>Welcome to alya.os</h1>
       <p>This is my desktop. Have a look around.</p>
       <ul>
         <li><strong>About Me</strong> has my story and resume.</li>
         <li><strong>Books</strong> is what I'm reading.</li>
         <li><strong>Blog</strong> is where I write.</li>
         <li><strong>Pretty Clever</strong> plays podcast episodes.</li>
         <li><strong>Terminal</strong> is in the dock. Type <code>help</code> to start.</li>
       </ul>
       <p class="meta" style="margin-top:14px">Double-click to open things. Drag windows by their title bar.</p>`,
      "TextEdit",
      { width: 460, height: 380 }
    );
  }

  /* ---------------------------------------------------------------- quicktime */
  function openPlayer(no = episodes[0]?.no) {
    const existing = findWin((w) => w.app === "QuickTime Player");
    if (existing) {
      existing.el.hidden = false;
      renderPlayer(existing, no);
      focus(existing.id);
      updateDock();
      return;
    }
    openWindow({
      key: "player",
      app: "QuickTime Player",
      title: "Pretty Clever",
      width: 760,
      height: 500,
      className: "dark-chrome",
      render: (win) => renderPlayer(win, no),
    });
  }

  function renderPlayer(win, no) {
    const idx = Math.max(0, episodes.findIndex((e) => e.no === no));
    const ep = episodes[idx];
    if (!ep) return;
    const epLabel = `EP ${String(ep.no).padStart(2, "0")}`;
    const watchUrl = ep.youtubeId ? `https://www.youtube.com/watch?v=${encodeURIComponent(ep.youtubeId)}` : S.podcast.channelUrl;
    win.setTitle(`${S.podcast.name} · ${epLabel}`);
    win.state.no = ep.no;
    win.body.innerHTML = `
      <div class="qt">
        <div class="qt-screen">
          ${
            ep.youtubeId
              ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(ep.youtubeId)}?rel=0&modestbranding=1"
                   title="${esc(ep.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`
              : `<div class="qt-poster"><div class="ep-no">${epLabel}</div><h2>${esc(ep.title)}</h2>
                   <a class="btn" href="${esc(watchUrl)}" target="_blank" rel="noopener">Watch on YouTube</a></div>`
          }
        </div>
        <div class="qt-bar">
          <button data-step="1" aria-label="Previous episode" ${idx >= episodes.length - 1 ? "disabled" : ""}>${ICON.ctl("prev")}</button>
          <button data-step="-1" aria-label="Next episode" ${idx <= 0 ? "disabled" : ""}>${ICON.ctl("next")}</button>
          <span class="qt-title">${epLabel} · ${esc(ep.title)}</span>
          <a href="${esc(watchUrl)}" target="_blank" rel="noopener" aria-label="Open on YouTube">${ICON.ctl("out")}</a>
        </div>
      </div>`;
    win.body.querySelectorAll("[data-step]").forEach((b) =>
      b.addEventListener("click", () => {
        const next = episodes[idx + Number(b.dataset.step)];
        if (next) renderPlayer(win, next.no);
      })
    );
  }

  /* ---------------------------------------------------------------- terminal */
  const FS = buildFS();
  function buildFS() {
    const file = (content, extra = {}) => ({ type: "file", content, ...extra });
    const dir = (children) => ({ type: "dir", children });
    return dir({
      about: dir({
        "about.txt": file(() => S.about.bio.join("\n\n"), { open: openAbout }),
        "now.txt": file(() => S.about.now.map((n) => `- ${n}`).join("\n"), { open: openNow }),
        "resume.pdf": file(() => resumeText(), { open: openResume }),
      }),
      books: dir(
        Object.fromEntries(
          S.books.map((b, i) => [
            `${slug(b.title)}.txt`,
            file(() => `${b.title} by ${b.author}\nstatus: ${STATUS_LABEL[b.status] || b.status}${b.note ? `\n\n${b.note}` : ""}`, { open: () => openBook(i) }),
          ])
        )
      ),
      blog: dir(
        Object.fromEntries(posts().map((p) => [p.file, file(() => fetchPost(p), { open: () => openPost(p.i) })]))
      ),
      podcast: dir(
        Object.fromEntries(
          episodes.map((ep) => [
            `ep${String(ep.no).padStart(2, "0")}-${slug(ep.title)}.mp4`,
            file(null, { open: () => openPlayer(ep.no), binary: `binary video file. try: play ${ep.no}` }),
          ])
        )
      ),
      projects: dir(
        Object.fromEntries(
          S.projects.map((p, i) => [`${slug(p.name)}.md`, file(() => `# ${p.name}\n${p.stack}\n\n${p.summary}${p.url ? `\n${p.url}` : ""}`, { open: () => openProject(i) })])
        )
      ),
      learning: dir({
        "cybersec.log": file(() => S.learningLog.map((l) => `[${l.date}] ${l.entry}`).join("\n") || "(empty)"),
      }),
    });
  }
  const FOLDER_FOR_DIR = { about: "about", books: "books", blog: "blog", podcast: "podcast", projects: "projects" };

  function resumeText() {
    const r = S.resume;
    const lines = [`${S.owner.name} · ${S.owner.role}`, S.owner.location, "", "EXPERIENCE"];
    r.experience.forEach((x) => {
      lines.push(`  ${x.org}${x.when ? `  (${x.when})` : ""}`, `    ${x.role}${x.where ? `, ${x.where}` : ""}`);
      x.points.forEach((p) => lines.push(`    - ${p}`));
    });
    lines.push("", "EDUCATION");
    r.education.forEach((e) => lines.push(`  ${e.org}`, `    ${e.detail}`));
    return lines.join("\n");
  }

  function openTerminal() {
    const existing = findWin((w) => w.app === "Terminal");
    if (existing) {
      existing.el.hidden = false;
      focus(existing.id);
      $("input", existing.body)?.focus();
      updateDock();
      return;
    }
    openWindow({
      key: "terminal",
      app: "Terminal",
      title: "alya — zsh",
      width: 680,
      height: 420,
      className: "term-chrome",
      render: renderTerminal,
    });
  }

  function renderTerminal(win) {
    const t = { cwd: [], history: [], hIdx: 0 };
    win.body.innerHTML = `<div class="terminal" role="log" aria-live="polite"></div>`;
    const screen = $(".terminal", win.body);

    const pathStr = (p = t.cwd) => (p.length ? `~/${p.join("/")}` : "~");
    const print = (html, cls = "") => {
      const pre = document.createElement("pre");
      if (cls) pre.className = cls;
      pre.innerHTML = html;
      screen.insertBefore(pre, promptLine);
    };
    const resolve = (arg = "") => {
      let parts = arg.startsWith("~") ? arg.replace(/^~\/?/, "").split("/") : [...t.cwd, ...arg.split("/")];
      const out = [];
      for (const p of parts) {
        if (!p || p === ".") continue;
        if (p === "..") out.pop();
        else out.push(p);
      }
      let node = FS;
      for (const p of out) {
        if (node.type !== "dir" || !node.children[p]) return { path: out, node: null };
        node = node.children[p];
      }
      return { path: out, node };
    };

    const promptLine = document.createElement("div");
    promptLine.className = "prompt-line";
    promptLine.innerHTML = `<span class="ps1"></span><input id="term-input" aria-label="Terminal input" autocomplete="off" autocapitalize="off" spellcheck="false">`;
    screen.appendChild(promptLine);
    const ps1 = $(".ps1", promptLine);
    const input = $("input", promptLine);
    const setPs1 = () => { ps1.innerHTML = `<b>alya</b>@os ${esc(pathStr())} %`; };
    setPs1();

    const COMMANDS = {
      help() {
        print(
          [
            `<span class="acc">available commands</span>`,
            `  ls [dir]        list files`,
            `  cd &lt;dir&gt;        change directory`,
            `  cat &lt;file&gt;      print a file`,
            `  open &lt;path&gt;     open a folder or file in its app`,
            `  play &lt;n&gt;        play Pretty Clever episode n`,
            `  books           what I'm reading`,
            `  blog            my posts`,
            `  projects        things I've built`,
            `  learning        my cybersecurity learning log`,
            `  socials         where to find me`,
            `  clear           clear the screen`,
            ``,
            `<span class="dim">psst: a few commands aren't on this list.</span>`,
          ].join("\n")
        );
      },
      whoami() { print(esc(resumeText())); },
      ls(args) {
        const showAll = args.includes("-a");
        const target = args.find((a) => !a.startsWith("-")) || "";
        const { node } = resolve(target);
        if (!node) return print(`ls: ${esc(target)}: No such file or directory`, "err");
        if (node.type === "file") return print(esc(target));
        const names = Object.keys(node.children);
        const shown = showAll ? [".", "..", ...names] : names;
        print(shown.map((n) => (node.children[n]?.type === "dir" ? `<span class="acc">${esc(n)}/</span>` : esc(n))).join("\n"));
      },
      cd(args) {
        const target = args[0] || "~";
        const { node, path } = resolve(target);
        if (!node) return print(`cd: no such directory: ${esc(target)}`, "err");
        if (node.type !== "dir") return print(`cd: not a directory: ${esc(target)}`, "err");
        t.cwd = path;
        setPs1();
      },
      pwd() { print(esc(`/Users/alya${t.cwd.length ? "/" + t.cwd.join("/") : ""}`)); },
      cat(args) {
        if (!args[0]) return print("usage: cat &lt;file&gt;", "dim");
        const { node } = resolve(args[0]);
        if (!node) return print(`cat: ${esc(args[0])}: No such file or directory`, "err");
        if (node.type === "dir") return print(`cat: ${esc(args[0])}: Is a directory`, "err");
        if (node.binary) return print(esc(node.binary), "dim");
        const c = node.content();
        if (c && typeof c.then === "function") c.then((t) => print(esc(t))).catch(() => print(`cat: ${esc(args[0])}: could not be read`, "err"));
        else print(esc(c));
      },
      open(args) {
        const target = args[0];
        if (!target) return print("usage: open &lt;path&gt;", "dim");
        const lower = target.toLowerCase();
        if (lower === "terminal") return print("you're already here.", "dim");
        const { node, path } = resolve(target);
        if (!node) return print(`The file ${esc(target)} does not exist.`, "err");
        if (node.type === "dir") {
          const folder = FOLDER_FOR_DIR[path[path.length - 1]] || FOLDER_FOR_DIR[path[0]];
          if (!folder) return print(`open: nothing to show for ${esc(target)}`, "dim");
          return openFinder(folder);
        }
        if (node.open) return node.open();
        print(esc(node.content()));
      },
      play(args) {
        const n = Number(args[0]);
        const ep = episodes.find((e) => e.no === n) || (!args[0] && episodes[0]);
        if (!ep) return print(`play: no episode ${esc(args[0])}. episodes run 1–${episodes[0].no}.`, "err");
        print(`<span class="ok">▶</span> EP ${ep.no}: ${esc(ep.title)}`);
        openPlayer(ep.no);
      },
      books() {
        print(
          S.books
            .map((b) => `${b.status === "reading" ? `<span class="acc">● reading</span>` : `<span class="dim">  ${esc(b.status)}   </span>`}  ${esc(b.title)} <span class="dim">· ${esc(b.author)}</span>`)
            .join("\n")
        );
      },
      blog() {
        const list = posts();
        if (!list.length) return print("no posts yet.", "dim");
        print(list.map((p) => `<span class="dim">${esc(p.date)}</span>  ${esc(p.title)}`).join("\n") + `\n\n<span class="dim">read one with: open blog/&lt;file&gt;</span>`);
      },
      projects() {
        if (!S.projects.length) return print("nothing here yet.", "dim");
        print(S.projects.map((p) => `<span class="acc">${esc(p.name)}</span>  <span class="dim">${esc(p.stack)}</span>\n  ${esc(p.summary)}`).join("\n\n"));
      },
      learning() { print(esc(FS.children.learning.children["cybersec.log"].content())); },
      socials() {
        print(liveLinks().map((l) => `${esc(l.label.padEnd(28))} <a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url.replace(/^https?:\/\//, ""))}</a>`).join("\n"));
      },
      contact() {
        if (S.owner.email) print(`email: <span class="acc">${esc(S.owner.email)}</span>`);
        COMMANDS.socials();
      },
      neofetch() {
        const read = S.books.filter((b) => b.status === "read").length;
        const art = ["╭─────────╮", "│         │", "│   a.    │", "│         │", "╰─────────╯"];
        const info = [
          `<span class="acc">alya</span>@<span class="acc">os</span>`,
          `role     ${esc(S.owner.role)}`,
          `based    ${esc(S.owner.location)}`,
          `podcast  ${esc(S.podcast.name)}, ${episodes.length} episodes`,
          `books    ${read} read, ${S.books.length - read} in progress`,
          `now      learning cybersecurity, 30 min a day`,
        ];
        print(info.map((l, i) => `<span class="acc">${esc(art[i] || " ".repeat(11))}</span>  ${l}`).join("\n"));
      },
      sudo() { print("alya is not in the sudoers file. This incident will be reported to Liz.", "err"); },
      hire() { print(`<span class="ok">great choice.</span> run <span class="acc">contact</span> to get in touch.`); },
      date() {
        print(new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur", dateStyle: "full", timeStyle: "short" }) + " (Kuala Lumpur)");
      },
      echo(args) { print(esc(args.join(" "))); },
      history() { print(t.history.map((c, i) => `${String(i + 1).padStart(4)}  ${esc(c)}`).join("\n") || "", "dim"); },
      clear() { screen.querySelectorAll("pre").forEach((p) => p.remove()); },
      exit() { closeWindow(win); },
    };
    COMMANDS.ll = (a) => COMMANDS.ls(["-a", ...a]);
    COMMANDS.links = COMMANDS.socials;
    COMMANDS.podcast = () => COMMANDS.ls(["~/podcast"]);
    const VISIBLE = ["help", "ls", "cd", "cat", "open", "play", "books", "blog", "projects", "learning", "socials", "clear", "pwd", "date", "echo", "history", "exit"];

    function run(raw) {
      const line = raw.trim();
      print(`<span class="ps1"><b>alya</b>@os ${esc(pathStr())} %</span> ${esc(line)}`);
      if (!line) return;
      t.history.push(line);
      t.hIdx = t.history.length;
      const [cmd, ...args] = line.split(/\s+/);
      const fn = COMMANDS[cmd.toLowerCase()];
      if (fn) fn(args);
      else print(`zsh: command not found: ${esc(cmd)}. try <span class="acc">help</span>`, "err");
    }

    function complete() {
      const parts = input.value.split(/\s+/);
      const last = parts[parts.length - 1];
      let options;
      if (parts.length === 1) {
        options = VISIBLE.filter((c) => c.startsWith(last));
      } else {
        const slash = last.lastIndexOf("/");
        const base = slash >= 0 ? last.slice(0, slash + 1) : "";
        const frag = slash >= 0 ? last.slice(slash + 1) : last;
        const { node } = resolve(base || ".");
        if (!node || node.type !== "dir") return;
        options = Object.keys(node.children)
          .filter((n) => n.startsWith(frag))
          .map((n) => base + n + (node.children[n].type === "dir" ? "/" : ""));
      }
      if (options.length === 1) {
        parts[parts.length - 1] = options[0];
        input.value = parts.join(" ") + (options[0].endsWith("/") ? "" : " ");
      } else if (options.length > 1) {
        print(options.map(esc).join("   "), "dim");
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        run(input.value);
        input.value = "";
        screen.scrollTop = screen.scrollHeight;
      } else if (e.key === "Tab") {
        e.preventDefault();
        complete();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (t.hIdx > 0) input.value = t.history[--t.hIdx];
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        t.hIdx = Math.min(t.history.length, t.hIdx + 1);
        input.value = t.history[t.hIdx] || "";
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        COMMANDS.clear();
      }
    });
    screen.addEventListener("click", () => {
      if (!window.getSelection()?.toString()) input.focus();
    });

    const lastLogin = new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    print(`<span class="dim">Last login: ${esc(lastLogin)} on ttys001</span>\nWelcome to alya.os. Type <span class="acc">help</span> to see what you can do.`);
    if (!isPhone()) setTimeout(() => input.focus(), 50);
  }

  /* ---------------------------------------------------------------- desktop */
  function renderWidgets() {
    const reading = S.books.findIndex((b) => b.status === "reading");
    const latest = episodes[0];
    $("#widgets").innerHTML = `
      <div class="widget">
        <p class="widget-label">Hello, I'm</p>
        <h1 class="widget-name">${esc(S.owner.name)}<span>.</span></h1>
        <p class="widget-role">${esc(S.owner.role)}</p>
        <p class="widget-tagline">${esc(S.owner.tagline)}</p>
      </div>
      <div class="widget-row">
        ${
          reading >= 0
            ? `<button class="widget" data-w="book"><p class="widget-label">Now reading</p>
                <span class="widget-book"><span class="mini-cover" style="background:${COVER_COLORS[reading % COVER_COLORS.length]}"></span>
                <span><strong>${esc(S.books[reading].title)}</strong><small>${esc(S.books[reading].author)}</small></span></span></button>`
            : ""
        }
        ${
          latest
            ? `<button class="widget" data-w="ep"><p class="widget-label">Latest episode</p>
                <span class="widget-ep"><strong>${esc(latest.title)}</strong>
                <span class="play-chip">▶ EP ${latest.no}</span></span></button>`
            : ""
        }
      </div>`;
    $("#widgets [data-w='book']")?.addEventListener("click", () => openBook(reading));
    $("#widgets [data-w='ep']")?.addEventListener("click", () => openPlayer(latest.no));
  }

  function renderDesktopIcons() {
    const nav = $("#desktopIcons");
    const entries = [
      ...FOLDER_ORDER.map((id) => ({ name: FOLDERS[id].name, icon: ICON.folder(FOLDERS[id].tint), open: () => openFinder(id) })),
      { name: "resume.pdf", icon: ICON.doc("PDF", "#c8443a"), open: openResume },
      { name: "Terminal", icon: ICON.terminalApp(), open: openTerminal },
    ];
    entries.forEach((e) => {
      const b = document.createElement("button");
      b.className = "desk-icon";
      b.innerHTML = `${e.icon}<span>${esc(e.name)}</span>`;
      bindOpen(b, e.open, nav);
      nav.appendChild(b);
    });
    document.getElementById("desktop").addEventListener("pointerdown", (e) => {
      if (e.target.id === "desktop" || e.target.id === "desktopIcons") nav.querySelectorAll(".selected").forEach((n) => n.classList.remove("selected"));
    });
  }

  const DOCK = [
    { id: "finder", label: "Finder", icon: () => ICON.finderApp(), act: () => openFinder("about"), running: () => !!findWin((w) => w.app === "Finder" && !w.el.hidden) },
    { id: "terminal", label: "Terminal", icon: () => ICON.terminalApp(), act: openTerminal, running: () => !!findWin((w) => w.app === "Terminal") },
    { id: "player", label: "Pretty Clever", icon: () => ICON.playerApp(), act: () => openPlayer(), running: () => !!findWin((w) => w.app === "QuickTime Player") },
    { id: "books", label: "Books", icon: () => ICON.booksApp(), act: () => openFinder("books"), running: () => !!findWin((w) => w.app === "Finder" && w.state.folder === "books") },
  ];

  function renderDock() {
    const dock = $("#dock");
    dock.innerHTML = "";
    DOCK.forEach((d) => {
      const b = document.createElement("button");
      b.className = "dock-item";
      b.dataset.id = d.id;
      b.setAttribute("aria-label", d.label);
      b.innerHTML = `${d.icon()}<span class="tip">${esc(d.label)}</span>`;
      b.addEventListener("click", () => {
        // restore a minimised window of this app before opening a new one
        const hidden = findWin((w) => w.el.hidden && ((d.id === "finder" && w.app === "Finder") || (d.id === "terminal" && w.app === "Terminal") || (d.id === "player" && w.app === "QuickTime Player")));
        if (hidden) { hidden.el.hidden = false; focus(hidden.id); updateDock(); }
        else d.act();
      });
      dock.appendChild(b);
    });
    const links = liveLinks().filter((l) => ["github", "youtube", "instagram"].includes(linkKind(l.label)));
    if (links.length) {
      const sep = document.createElement("span");
      sep.className = "dock-sep";
      dock.appendChild(sep);
    }
    links.forEach((l) => {
      const a = document.createElement("a");
      a.className = "dock-item link-only";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", l.label);
      a.innerHTML = `${ICON.linkApp(linkKind(l.label))}<span class="tip">${esc(l.label)}</span>`;
      dock.appendChild(a);
    });
    updateDock();
  }

  function updateDock() {
    DOCK.forEach((d) => {
      $(`#dock [data-id="${d.id}"]`)?.classList.toggle("running", d.running());
    });
  }

  /* ---------------------------------------------------------------- menubar */
  const MENUS = {
    system: () => [
      ["About alya.os", openWelcome],
      ["View source on GitHub", "https://github.com/alyamohd96/portfolio_website"],
      ...(S.owner.wallpaperCredit ? [null, [`Wallpaper: ${S.owner.wallpaperCredit}`, null]] : []),
      null,
      ["Restart…", () => location.reload()],
    ],
    go: () => [
      ...FOLDER_ORDER.map((id) => [FOLDERS[id].name, () => openFinder(id)]),
      null,
      ["Terminal", openTerminal],
      ["Latest episode", () => openPlayer()],
    ],
    help: () => [["How this desktop works", openWelcome], ["Terminal commands", () => { openTerminal(); }]],
  };

  function setupMenus() {
    const panel = $("#menuPanel");
    let openFor = null;
    const close = () => {
      panel.hidden = true;
      document.querySelectorAll(".menu-trigger[aria-expanded]").forEach((b) => b.removeAttribute("aria-expanded"));
      openFor = null;
    };
    document.querySelectorAll(".menu-trigger").forEach((btn) => {
      btn.setAttribute("aria-haspopup", "menu");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (openFor === btn) return close();
        close();
        openFor = btn;
        btn.setAttribute("aria-expanded", "true");
        panel.innerHTML = "";
        MENUS[btn.dataset.menu]().forEach((item) => {
          if (!item) { panel.appendChild(document.createElement("hr")); return; }
          const [label, action] = item;
          let el;
          if (action === null) {
            el = document.createElement("span");
            el.className = "menu-note";
            el.textContent = label;
            panel.appendChild(el);
            return;
          }
          if (typeof action === "string") {
            el = document.createElement("a");
            el.href = action;
            el.target = "_blank";
            el.rel = "noopener";
          } else {
            el = document.createElement("button");
            el.addEventListener("click", () => { close(); action(); });
          }
          el.setAttribute("role", "menuitem");
          el.textContent = label;
          panel.appendChild(el);
        });
        panel.style.left = `${btn.offsetLeft}px`;
        panel.hidden = false;
        panel.querySelector("button, a")?.focus();
      });
    });
    document.addEventListener("click", (e) => { if (!panel.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function startClock() {
    const el = $("#clock");
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kuala_Lumpur", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
    const tick = () => { el.textContent = fmt.format(new Date()).replace(",", ""); };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------------------------------------------------------------- boot */
  function loadWallpaper() {
    const src = S.owner.wallpaper;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const wp = $(".wallpaper");
      wp.style.setProperty("--wallpaper-image", `url("${src.replace(/"/g, "%22")}")`);
      wp.classList.add("has-image");
    };
    img.src = src;
  }
  loadWallpaper();
  renderWidgets();
  renderDesktopIcons();
  renderDock();
  setupMenus();
  startClock();
  if (!isPhone()) openWelcome();
})();
