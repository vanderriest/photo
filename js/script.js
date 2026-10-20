/* Tjorn Van Wetter — interactions. Vanilla JS, no build step, works on file://
   Class names follow BEM (block__element--modifier). */
(function () {
  const S = window.SITE;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const ROOT = page === "home" ? "" : "../";
  const SUB = page === "home" ? "pages/" : "";
  const findCase = (slug) => S.cases.find((c) => c.slug === slug) || S.cases[0];
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  root.classList.add("page");

  /* ---------- Shared chrome ---------- */
  function chrome() {
    const cur = { home: "work", case: "work", photo: "work", about: "about", contact: "contact" }[page];
    const link = (href, key, label) =>
      `<a class="nav__link${cur === key ? " nav__link--active" : ""}" href="${href}"${cur === key ? ' aria-current="page"' : ""}>${label}</a>`;
    document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="curtain" aria-hidden="true"></div>
      <header class="header">
        <a class="header__logo" href="${ROOT}index.html">${S.name}<i class="header__logo-tag">Photography</i></a>
        <button class="header__toggle" aria-expanded="false">Menu</button>
        <nav class="nav" aria-label="Main">
          ${link(`${ROOT}index.html#work`, "work", "Work")}${link(`${SUB}about.html`, "about", "About")}
        </nav>
      </header>
      <div class="cursor" aria-hidden="true"><span class="cursor__label">View</span></div>`
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      `<footer class="footer">
        <span>© ${new Date().getFullYear()} ${S.name} — Photography portfolio</span>
        <nav class="footer__nav">
          <a class="footer__link" href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a>
          <!-- <a class="footer__link" href="${SUB}contact.html">Prints &amp; commissions</a> -->
        </nav>
      </footer>`
    );
    const t = $(".header__toggle");
    t.addEventListener("click", () => {
      const open = root.classList.toggle("page--menu-open");
      t.setAttribute("aria-expanded", open);
      t.textContent = open ? "Close" : "Menu";
    });
  }

  /* ---------- Image helper with fade-in + fallback ---------- */
  function imgSrc(id, w, folder) {
    const src = S.img(id, w, folder);
    return /^https?:/.test(src) ? src : `${ROOT}${src}`;
  }
  function frame(id, w, alt, mods = "", attrs = "", folder) {
    return `<div class="frame ${mods}" ${attrs}><img class="frame__img" src="${imgSrc(id, w, folder)}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;
  }
  function wireImages(ctx = document) {
    $$(".frame__img", ctx).forEach((img) => {
      const ok = () => img.classList.add("frame__img--loaded");
      const bad = () => img.parentElement.classList.add("frame--failed");
      if (img.complete && img.naturalWidth) ok();
      else { img.addEventListener("load", ok, { once: true }); img.addEventListener("error", bad, { once: true }); }
    });
  }

  /* ---------- Scroll reveal + parallax ---------- */
  function reveal() {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("reveal--in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    $$(".reveal").forEach((el) => { el.style.transitionDelay = (el.dataset.delay || 0) + "ms"; io.observe(el); });
  }
  function parallax() {
    const els = $$("[data-parallax] .frame__img");
    if (!els.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = () => {
      els.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -8}%) scale(1.15)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Logo tag: fade "Photography" on scroll down, back on scroll up ---------- */
  function logoFade() {
    let last = scrollY;
    const set = () => {
      const y = scrollY;
      if (y <= 40) root.classList.remove("page--scrolled");
      else if (y > last) root.classList.add("page--scrolled");
      else if (y < last) root.classList.remove("page--scrolled");
      last = y;
    };
    addEventListener("scroll", set, { passive: true });
    set();
  }

  /* ---------- Custom cursor ---------- */
  function cursor() {
    const c = $(".cursor"), label = $(".cursor__label");
    if (!c || matchMedia("(hover: none)").matches) return;
    let x = -200, y = -200, tx = x, ty = y, on = false;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      on = !!t;
      if (t) label.textContent = t.dataset.cursor;
    });
    (function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      c.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${on ? 1 : 0})`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Page transitions ---------- */
  function transitions() {
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("page--loaded")));
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || /^https?:/.test(href)) return;
      const url = new URL(a.href);
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      e.preventDefault();
      root.classList.add("page--leaving");
      setTimeout(() => (location.href = a.href), 560);
    });
    addEventListener("pageshow", (e) => { if (e.persisted) root.classList.remove("page--leaving"); });
  }

  /* ---------- Split heading lines ---------- */
  function splitLines() {
    $$(".split:not([data-split])").forEach((el) => {
      el.dataset.split = "1";
      el.innerHTML = el.innerHTML
        .split("<br>")
        .map((l) => `<span class="split__line"><span class="split__inner">${l.trim()}</span></span>`)
        .join("");
    });
  }

  /* ============ LEVEL 1 — Home ============ */
  function home() {
    const all = [...S.cases.map((c) => ({ ...c, live: true })), ...S.teasers.map((t) => ({ ...t, live: false }))];
    const order = [all[0], all[2], all[3], all[1], all[4], all[5]].filter(Boolean);
    $("#projects").innerHTML = order
      .map((p, i) => {
        const inner = `${frame(p.cover, 1400, p.title, "project__frame", "", p.folder)}
          <div class="project__info">
            <h3 class="project__title">${p.title} <span class="project__arrow">→</span></h3>
            ${p.live ? `<span class="eyebrow">${p.year}</span>` : `<span class="badge">Coming ${p.year}</span>`}
          </div>
          <div class="eyebrow project__kicker">${p.kicker}</div>`;
        return `<article class="project${p.live ? "" : " project--teaser"} reveal" data-cat="${p.category}" data-delay="${(i % 2) * 120}">
          ${p.live
            ? `<a class="project__link" href="${SUB}case.html?c=${p.slug}" data-cursor="View">${inner}</a>`
            : `<div class="project__link" data-cursor="Soon">${inner}</div>`}
        </article>`;
      })
      .join("");

    const count = (k) => (k === "all" ? order.length : order.filter((p) => p.category === k).length);
    const filters = $("#filters");
    filters.innerHTML = S.categories
      .map((c, i) => `<button class="chip${i ? "" : " chip--active"}" data-f="${c.key}">${c.label}<sup class="chip__count">${count(c.key)}</sup></button>`)
      .join("");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", filters).forEach((c) => c.classList.toggle("chip--active", c === b));
      const f = b.dataset.f, items = $$(".project");
      items.forEach((it) => it.classList.add("project--out"));
      setTimeout(() => {
        items.forEach((it) => it.classList.toggle("project--hidden", f !== "all" && it.dataset.cat !== f));
        requestAnimationFrame(() => items.forEach((it, i) => {
          it.style.transitionDelay = i * 60 + "ms";
          it.classList.remove("project--out");
          setTimeout(() => (it.style.transitionDelay = ""), 800);
        }));
      }, 380);
    });
  }

  /* ============ LEVEL 2 — Case ============ */
  function casePage() {
    const c = findCase(params.get("c"));
    document.title = `${c.title} — ${S.name}`;
    const next = S.cases[(S.cases.indexOf(c) + 1) % S.cases.length];
    $("#case").innerHTML = `
      <section class="case__hero">
        <div class="crumbs reveal"><a class="crumbs__link" href="${ROOT}index.html#work">Work</a><span>/</span><span>${c.kicker}</span></div>
        <h1 class="title title--display title--case split case__title">${c.title.replace(" ", "<br>")}</h1>
        <dl class="facts reveal" data-delay="200">
          <div class="facts__item"><dt class="eyebrow facts__label">Year</dt><dd class="facts__value">${c.year}</dd></div>
          <div class="facts__item"><dt class="eyebrow facts__label">Location</dt><dd class="facts__value">${c.location}</dd></div>
          <div class="facts__item"><dt class="eyebrow facts__label">Frames</dt><dd class="facts__value">${pad(c.photos.length)}</dd></div>
          <div class="facts__item"><dt class="eyebrow facts__label">Category</dt><dd class="facts__value">${c.kicker.split(" / ")[0]}</dd></div>
        </dl>
      </section>
      <div class="case__cover">${frame(c.cover, 2200, c.title, "frame--full", "data-parallax", c.folder)}</div>
      <section class="section case__intro">
        <p class="lead lead--wide case__lead reveal">${c.intro}</p>
        <p class="case__body reveal" data-delay="150">${c.body}</p>
      </section>
      <section class="gallery" id="gallery">
        ${c.photos.map((p, i) => `
          <figure class="shot reveal" tabindex="0" data-i="${i}" data-cursor="Zoom" data-delay="${(i % 3) * 90}">
            ${frame(p.id, 900, p.title, "shot__frame", `style="aspect-ratio:${p.w}/${p.h}"`, c.folder)}
            <figcaption class="shot__caption"><span class="eyebrow eyebrow--ink shot__title">${pad(i + 1)} — ${p.title}</span><span class="meta shot__action">Open ↗</span></figcaption>
          </figure>`).join("")}
      </section>
      <a class="next" href="${SUB}case.html?c=${next.slug}" data-cursor="Next">
        <span class="eyebrow">Next project</span><br>
        <span class="title next__title">${next.title}</span>
        <div class="next__thumb">${frame(next.cover, 600, next.title, "frame--full", "", next.folder)}</div>
      </a>`;
    splitLines();
    const lb = lightbox(c);
    const g = $("#gallery");
    g.addEventListener("click", (e) => { const s = e.target.closest(".shot"); if (s) lb.open(+s.dataset.i, s); });
    g.addEventListener("keydown", (e) => { if (e.key === "Enter") { const s = e.target.closest(".shot"); if (s) lb.open(+s.dataset.i, s); } });
    if (params.has("p")) setTimeout(() => lb.open(+params.get("p") || 0), 700);
  }

  /* ============ LEVEL 3 — Lightbox · LEVEL 4 — zoom ============ */
  function lightbox(c) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <div class="lightbox__top"><span class="lightbox__count"></span><span class="lightbox__series">${c.title}</span>
          <button class="lightbox__close"><span>Close</span><span class="lightbox__close-icon"></span></button></div>
        <div class="lightbox__stage"><img class="lightbox__img" alt=""><span class="lightbox__hint">click to zoom · ← → to browse · esc to close</span></div>
        <div class="lightbox__bottom">
          <div><div class="lightbox__title"></div><div class="meta lightbox__meta"></div></div>
          <!--<a class="lightbox__link" href="#">Photo details &amp; prints</a> -->
          <div class="lightbox__arrows"><button class="lightbox__btn" data-d="-1" aria-label="Previous">←</button><button class="lightbox__btn" data-d="1" aria-label="Next">→</button></div>
          <span class="lightbox__progress"></span>
        </div>
      </div>`);
    const box = $(".lightbox"), img = $(".lightbox__img", box), stage = $(".lightbox__stage", box);
    const el = (n) => $(".lightbox__" + n, box);
    let i = 0, zoomed = false, lastFocus = null;

    const pan = (e) => {
      if (!zoomed || !e) return;
      const r = img.getBoundingClientRect();
      const cl = (v) => Math.max(0, Math.min(100, v));
      img.style.transformOrigin = `${cl(((e.clientX - r.left) / r.width) * 100)}% ${cl(((e.clientY - r.top) / r.height) * 100)}%`;
      img.style.transform = "scale(2.4)";
    };
    const setZoom = (z, e) => {
      zoomed = z; stage.classList.toggle("lightbox__stage--zoomed", z);
      if (!z) img.style.transform = ""; else pan(e);
    };
    function show(n, dir = 0) {
      i = (n + c.photos.length) % c.photos.length;
      const p = c.photos[i];
      setZoom(false);
      img.style.setProperty("--dir", dir * -30 + "px");
      img.classList.add("lightbox__img--swapping");
      setTimeout(() => {
        const pre = new Image();
        pre.onload = pre.onerror = () => {
          img.src = pre.src; img.alt = p.title;
          img.style.setProperty("--dir", dir * 30 + "px");
          requestAnimationFrame(() => img.classList.remove("lightbox__img--swapping"));
        };
        pre.src = imgSrc(p.id, 2000, c.folder);
      }, dir ? 260 : 0);
      el("count").textContent = `${pad(i + 1)} / ${pad(c.photos.length)}`;
      el("title").textContent = p.title;
      el("meta").textContent = p.meta;
      el("progress").style.width = ((i + 1) / c.photos.length) * 100 + "%";
    }
    function open(n, from) {
      lastFocus = from || document.activeElement;
      img.classList.add("lightbox__img--entering");
      show(n);
      box.classList.add("lightbox--open");
      document.body.style.overflow = "hidden";
      setTimeout(() => img.classList.remove("lightbox__img--entering"), 60);
      el("close").focus({ preventScroll: true });
    }
    function close() {
      box.classList.remove("lightbox--open"); setZoom(false);
      document.body.style.overflow = "";
      lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
    }
    el("close").onclick = close;
    $$(".lightbox__btn", box).forEach((b) => (b.onclick = () => show(i + +b.dataset.d, +b.dataset.d)));
    stage.addEventListener("click", (e) => { if (e.target === img) setZoom(!zoomed, e); else if (!zoomed) close(); });
    stage.addEventListener("mousemove", pan);
    addEventListener("keydown", (e) => {
      if (!box.classList.contains("lightbox--open")) return;
      if (e.key === "Escape") zoomed ? setZoom(false) : close();
      if (e.key === "ArrowRight") show(i + 1, 1);
      if (e.key === "ArrowLeft") show(i - 1, -1);
    });
    let sx = null;
    stage.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (sx === null || zoomed) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      sx = null;
    });
    return { open };
  }

  /* ============ LEVEL 3 (standalone) — Photo page with loupe ============ */
  function photoPage() {
    const c = findCase(params.get("c"));
    const n = Math.min(Math.max(+params.get("p") || 0, 0), c.photos.length - 1);
    const p = c.photos[n];
    document.title = `${p.title} — ${c.title} — ${S.name}`;
    const nextI = (n + 1) % c.photos.length, prevI = (n - 1 + c.photos.length) % c.photos.length;
    const url = (k) => `${SUB}photo.html?c=${c.slug}&p=${k}`;
    $("#photo").innerHTML = `
      <div class="photo__view" data-cursor="Zoom">${frame(p.id, 2400, p.title, "frame--full frame--bare", "", c.folder)}<span class="photo__loupe">1×</span></div>
      <aside class="photo__aside">
        <nav class="crumbs"><a class="crumbs__link" href="${ROOT}index.html#work">Work</a><span>/</span><a class="crumbs__link" href="${SUB}case.html?c=${c.slug}">${c.title}</a><span>/</span><span>${pad(n + 1)}</span></nav>
        <h1 class="photo__title split">${p.title}</h1>
        <dl class="spec">
          <dt class="spec__term">Series</dt><dd class="spec__def">${c.title}, ${c.year}</dd>
          <dt class="spec__term">Place</dt><dd class="spec__def">${c.location}</dd>
          <dt class="spec__term">Kit</dt><dd class="spec__def meta meta--ink">${p.meta}</dd>
          <dt class="spec__term">Edition</dt><dd class="spec__def">Archival pigment print, edition of 15</dd>
        </dl>
        <div><div class="eyebrow photo__label">Print size</div>
          <div class="chips" id="sizes">${["30×40", "50×70", "70×100"].map((s, k) => `<button class="chip${k ? "" : " chip--active"}">${s} cm</button>`).join("")}</div></div>
        <!-- <a class="btn btn--start" href="${SUB}contact.html?about=${encodeURIComponent(p.title)}"><span class="btn__roll"><span class="btn__text">Request this print</span><span class="btn__text">Request this print</span></span> →</a> -->
        <div><div class="eyebrow photo__label">More from ${c.title}</div>
          <div class="filmstrip">${c.photos.map((q, k) => `<a class="filmstrip__item${k === n ? " filmstrip__item--active" : ""}" href="${url(k)}"${k === n ? ' aria-current="true"' : ""}><img class="filmstrip__img" src="${imgSrc(q.id, 240, c.folder)}" alt="${esc(q.title)}" loading="lazy"></a>`).join("")}</div></div>
        <div class="eyebrow photo__pager">
          <a class="photo__pager-link" href="${url(prevI)}">← Previous</a>
          <a class="photo__pager-link" href="${url(nextI)}">Next →</a>
        </div>
      </aside>`;
    splitLines();
    const sizes = $$("#sizes .chip");
    sizes.forEach((b) => b.addEventListener("click", () => sizes.forEach((x) => x.classList.toggle("chip--active", x === b))));

    const view = $(".photo__view"), im = $(".frame__img", view), loupe = $(".photo__loupe", view);
    const levels = [1, 2, 3.5]; let L = 0;
    const move = (e) => {
      if (!L) return;
      const r = view.getBoundingClientRect(), pt = e.touches ? e.touches[0] : e;
      im.style.transformOrigin = `${((pt.clientX - r.left) / r.width) * 100}% ${((pt.clientY - r.top) / r.height) * 100}%`;
    };
    view.addEventListener("click", (e) => {
      L = (L + 1) % levels.length;
      view.classList.toggle("photo__view--zoomed", L > 0);
      view.dataset.cursor = L === levels.length - 1 ? "Reset" : "Zoom";
      $(".cursor__label").textContent = view.dataset.cursor;
      move(e);
      im.style.transform = `scale(${levels[L]})`;
      loupe.textContent = levels[L] + "×";
    });
    view.addEventListener("mousemove", move);
    view.addEventListener("touchmove", (e) => { if (L) { e.preventDefault(); move(e); } }, { passive: false });
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") location.href = url(nextI);
      if (e.key === "ArrowLeft") location.href = url(prevI);
      if (e.key === "Escape") location.href = `${SUB}case.html?c=${c.slug}`;
    });
  }

  /* ---------- Contact form (demo) ---------- */
  function contact() {
    const about = params.get("about");
    if (about) $("#msg").value = `Hi Noor, I'd like to know more about a print of “${about}”.`;
    $("#form").addEventListener("submit", (e) => {
      e.preventDefault();
      const st = $(".contact__status"), btn = $(".btn", e.target);
      btn.style.pointerEvents = "none";
      st.textContent = "Sending…";
      setTimeout(() => { st.textContent = "✓ Thanks — this is a demo, nothing was sent."; e.target.reset(); btn.style.pointerEvents = ""; }, 900);
    });
  }

  /* ---------- Boot ---------- */
  chrome();
  transitions();
  ({ home, case: casePage, photo: photoPage, contact }[page] || (() => {}))();
  splitLines();
  wireImages();
  reveal();
  parallax();
  cursor();
  logoFade();
})();
