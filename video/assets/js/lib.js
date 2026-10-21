/* Shared helpers for the documentary composition. Everything is deterministic:
   word-anchored times, seeded randomness, one paused GSAP timeline. */
(function () {
  const tl = gsap.timeline({ paused: true });
  const SFX = [];
  const S = {};

  // ---------- timing ----------
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
  function at(phrase, n = 1, after = 0) {
    const p = phrase.split(/\s+/).map(norm).filter(Boolean);
    let c = 0;
    for (let i = 0; i < WORDS.length; i++) {
      if (WORDS[i][1] < after - 0.001) continue;
      let ok = true;
      for (let k = 0; k < p.length; k++) {
        if (!WORDS[i + k] || WORDS[i + k][0] !== p[k]) { ok = false; break; }
      }
      if (ok && ++c === n) return WORDS[i][1];
    }
    throw new Error("anchor not found: " + phrase + " after " + after);
  }
  function endOf(phrase, n = 1, after = 0) {
    const s = at(phrase, n, after);
    const p = phrase.split(/\s+/).map(norm).filter(Boolean);
    const i = WORDS.findIndex((w) => w[1] === s && w[0] === p[0]);
    return WORDS[i + p.length - 1][2];
  }

  // ---------- seeded rng ----------
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return (s % 100000) / 100000;
    };
  }

  // ---------- sound cues (exported for the offline mix) ----------
  function sfx(name, t, gain = 1, opts = {}) {
    SFX.push(Object.assign({ name, t: +t.toFixed(3), gain }, opts));
  }

  // ---------- DOM ----------
  function mk(tag, cls, parent, html, style) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    if (style) Object.assign(el.style, style);
    if (parent) parent.appendChild(el);
    return el;
  }
  const px = (v) => (typeof v === "number" ? v + "px" : v);
  function box(parent, x, y, w, h, cls, html, extra) {
    const st = { left: px(x), top: px(y) };
    if (w != null) st.width = px(w);
    if (h != null) st.height = px(h);
    return mk("div", "abs " + (cls || ""), parent, html, Object.assign(st, extra || {}));
  }
  function img(parent, src, cls, style) {
    const el = mk("img", cls || "cover", parent, null, style);
    el.src = src;
    return el;
  }
  function letters(el, text) {
    el.innerHTML = "";
    const out = [];
    for (const ch of text) {
      const s = mk("span", "letter", el, ch === " " ? "&nbsp;" : ch);
      out.push(s);
    }
    return out;
  }
  function words(el, text) {
    el.innerHTML = "";
    return text.split(" ").map((w, i, a) => {
      const s = mk("span", "word", el, w);
      if (i < a.length - 1) el.appendChild(document.createTextNode(" "));
      return s;
    });
  }

  // ---------- icon set (line icons, 64x64, stroke = currentColor) ----------
  const I = (d, extra = "") => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const ICON = {
    ear: I('<path d="M22 26a12 12 0 1 1 24 0c0 8-8 10-8 18a6 6 0 0 1-12 0"/><path d="M28 27a4 4 0 1 1 8 0c0 3-4 4-4 7"/><path d="M50 18c3 4 3 12 0 16M55 13c5 7 5 19 0 26"/>'),
    thought: I('<path d="M18 36a10 10 0 0 1 4-19 12 12 0 0 1 22-2 10 10 0 0 1 4 20H18z"/><circle cx="20" cy="46" r="3.5"/><circle cx="13" cy="54" r="2"/>'),
    person: I('<circle cx="32" cy="16" r="8"/><path d="M16 56c0-10 7-18 16-18s16 8 16 18"/>'),
    change: I('<circle cx="22" cy="16" r="6"/><path d="M10 46c0-8 5-14 12-14s12 6 12 14"/><path d="M40 22h14l-5-5M54 30H40l5 5"/>'),
    moon: I('<path d="M40 10a22 22 0 1 0 16 30 18 18 0 0 1-16-30z"/><path d="M14 14l2 4 4 2-4 2-2 4-2-4-4-2 4-2zM50 50l1.5 3 3 1.5-3 1.5L50 59l-1.5-3-3-1.5 3-1.5z"/>'),
    lamp: I('<path d="M20 44h24l-4-10H24z"/><path d="M32 34V24"/><path d="M32 24c-4-4-2-10 0-14 2 4 4 10 0 14z"/><path d="M16 52h32"/>'),
    scroll: I('<path d="M16 14h28a6 6 0 0 1 6 6v30H22a6 6 0 0 1-6-6z"/><path d="M16 44a6 6 0 0 0 12 0V14"/><path d="M32 24h12M32 32h12M32 40h8"/>'),
    healer: I('<path d="M32 8v48M22 14c6 4 14 4 20 0M24 26c5 3 11 3 16 0M26 38c4 2 8 2 12 0"/>'),
    check: I('<rect x="12" y="10" width="40" height="46" rx="4"/><path d="M20 24l4 4 8-8M20 40l4 4 8-8M38 24h8M38 40h8"/>'),
    clock: I('<circle cx="32" cy="32" r="22"/><path d="M32 18v14l9 6"/>'),
    life: I('<path d="M32 54S10 40 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 16-22 30-22 30z"/>'),
    search: I('<circle cx="28" cy="28" r="15"/><path d="M39 39l14 14"/><path d="M24 22c1-3 6-4 8 0 2 3-3 5-4 8M28 36v.5"/>'),
    brain: I('<path d="M30 12c-6-4-14 0-14 7-6 2-7 11-2 14-3 6 2 13 9 12 2 5 7 6 7 6V12z"/><path d="M34 12c6-4 14 0 14 7 6 2 7 11 2 14 3 6-2 13-9 12-2 5-7 6-7 6V12z"/><path d="M22 24c3 0 5 2 5 5M42 24c-3 0-5 2-5 5M22 40c2-2 5-2 7 0M42 40c-2-2-5-2-7 0"/>'),
    eye: I('<path d="M6 32s10-16 26-16 26 16 26 16-10 16-26 16S6 32 6 32z"/><circle cx="32" cy="32" r="7"/>'),
    voice: I('<path d="M18 24h8l10-8v32l-10-8h-8z"/><path d="M44 24c3 4 3 12 0 16M50 18c6 8 6 20 0 28"/>'),
    split: I('<path d="M32 8v48" stroke-dasharray="4 5"/><path d="M26 18c-8 0-14 6-14 14s6 14 14 14M38 18c8 0 14 6 14 14s-6 14-14 14"/>'),
    pill: I('<rect x="10" y="22" width="44" height="20" rx="10" transform="rotate(-30 32 32)"/><path d="M27 23l10 18" />'),
    flask: I('<path d="M26 8h12M28 8v16L14 50a4 4 0 0 0 4 6h28a4 4 0 0 0 4-6L36 24V8"/><path d="M20 42h24"/>'),
    scale: I('<path d="M32 10v44M20 54h24M12 18h40"/><path d="M12 18l-7 16h14zM52 18l-7 16h14z"/>'),
    syringe: I('<path d="M42 8l14 14M49 15l-8 8M38 20l6 6-22 22H16v-6z"/><path d="M28 30l4 4M23 35l4 4"/>'),
    calendar: I('<rect x="10" y="14" width="44" height="40" rx="4"/><path d="M10 26h44M22 8v10M42 8v10"/><path d="M20 36h6M30 36h6M40 36h6M20 45h6M30 45h6"/>'),
    family: I('<circle cx="20" cy="18" r="6"/><circle cx="44" cy="18" r="6"/><circle cx="32" cy="32" r="5"/><path d="M8 52c0-9 5-16 12-16M56 52c0-9-5-16-12-16M22 56c0-8 4-13 10-13s10 5 10 13"/>'),
    talk: I('<path d="M10 14h32v22H24l-8 8v-8h-6z"/><path d="M46 24h8v20h-6v7l-7-7H30"/>'),
    work: I('<rect x="10" y="22" width="44" height="30" rx="4"/><path d="M24 22v-6h16v6M10 34h44"/>'),
    book: I('<path d="M32 16c-6-4-14-5-22-4v38c8-1 16 0 22 4 6-4 14-5 22-4V12c-8-1-16 0-22 4z"/><path d="M32 16v38"/>'),
    weight: I('<path d="M14 54l6-28h24l6 28z"/><circle cx="32" cy="18" r="6"/>'),
    drop: I('<path d="M32 8s16 18 16 30a16 16 0 0 1-32 0C16 26 32 8 32 8z"/><path d="M24 38a8 8 0 0 0 8 8"/>'),
    move: I('<circle cx="34" cy="10" r="5"/><path d="M26 22l10-4 6 10 8 2M36 18l-4 16 8 8v12M32 34l-10 8-6 0"/>'),
    hormone: I('<circle cx="32" cy="32" r="8"/><circle cx="14" cy="16" r="5"/><circle cx="50" cy="16" r="5"/><circle cx="14" cy="48" r="5"/><circle cx="50" cy="48" r="5"/><path d="M18 20l8 7M46 20l-8 7M18 44l8-7M46 44l-8-7"/>'),
    shield: I('<path d="M32 8l20 8v14c0 14-9 22-20 26-11-4-20-12-20-26V16z"/><path d="M23 32l6 6 12-12"/>'),
    house: I('<path d="M8 30L32 10l24 20"/><path d="M14 26v28h36V26"/><path d="M26 54V38h12v16"/>'),
    stetho: I('<path d="M18 8v14a10 10 0 0 0 20 0V8"/><path d="M28 32v8a12 12 0 0 0 24 0v-6"/><circle cx="52" cy="30" r="4"/>'),
    comment: I('<path d="M10 12h44v30H30l-12 10V42h-8z"/><path d="M20 24h24M20 32h16"/>'),
    pin: I('<path d="M32 56s-16-16-16-28a16 16 0 0 1 32 0c0 12-16 28-16 28z"/><circle cx="32" cy="28" r="6"/>'),
    tremor: I('<path d="M24 54V30c0-3 5-3 5 0v-8c0-3 5-3 5 0v4c0-3 5-3 5 0v4c0-3 5-3 5 0v12c0 8-4 12-10 12h-4c-4 0-6-2-6-6z"/><path d="M12 22c-3 3-3 7 0 10M8 18c-5 5-5 13 0 18M52 18c3 3 3 7 0 10"/>'),
    stiff: I('<rect x="22" y="8" width="20" height="48" rx="8"/><path d="M14 20h6M14 32h6M14 44h6M44 20h6M44 32h6M44 44h6"/>'),
    restless: I('<path d="M20 56l6-14 8 4 6-14M26 42l-8-6M40 32l8-2"/><circle cx="38" cy="14" r="5"/><path d="M8 24h6M6 34h6M50 46h6M52 56h6"/>'),
    cross: I('<path d="M16 16l32 32M48 16L16 48"/>'),
    tick: I('<path d="M12 34l14 14 26-30"/>'),
    plus: I('<path d="M32 12v40M12 32h40"/>'),
    minus: I('<path d="M12 32h40"/>'),
    star: I('<path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z"/>'),
    mask: I('<path d="M10 16c8-4 36-4 44 0 0 20-8 36-22 36S10 36 10 16z"/><path d="M20 28c3-3 7-3 10 0M34 28c3-3 7-3 10 0M24 40c5 4 11 4 16 0"/>'),
    mask2: I('<path d="M10 16c8-4 36-4 44 0 0 20-8 36-22 36S10 36 10 16z"/><path d="M20 30c3 3 7 3 10 0M34 30c3 3 7 3 10 0M24 44c5-4 11-4 16 0"/>'),
    network: I('<circle cx="14" cy="18" r="5"/><circle cx="50" cy="18" r="5"/><circle cx="32" cy="46" r="5"/><path d="M19 18h26M17 22l12 20M47 22L35 42"/>'),
    globe: I('<circle cx="32" cy="32" r="22"/><path d="M10 32h44M32 10c8 8 8 36 0 44M32 10c-8 8-8 36 0 44"/>'),
  };
  function icon(parent, name, x, y, size, color, extraCls) {
    const el = box(parent, x, y, size, size, "icon " + (extraCls || ""), ICON[name]);
    if (color) el.style.color = color;
    return el;
  }

  // ---------- torn paper polygon ----------
  function tornClip(seed, jag = 1.4, steps = 26) {
    const r = rng(seed); const pts = [];
    const edge = (fx, fy, n) => { for (let i = 0; i <= n; i++) pts.push(fx(i / n, (r() - 0.5) * jag)); };
    edge((t, j) => `${(t * 100).toFixed(2)}% ${(Math.abs(j) + 0.2).toFixed(2)}%`, 0, steps);
    edge((t, j) => `${(100 - Math.abs(j) - 0.2).toFixed(2)}% ${(t * 100).toFixed(2)}%`, 0, Math.round(steps * 0.6));
    edge((t, j) => `${(100 - t * 100).toFixed(2)}% ${(100 - Math.abs(j) - 0.2).toFixed(2)}%`, 0, steps);
    edge((t, j) => `${(Math.abs(j) + 0.2).toFixed(2)}% ${(100 - t * 100).toFixed(2)}%`, 0, Math.round(steps * 0.6));
    return `polygon(${pts.join(",")})`;
  }
  function paperCard(parent, x, y, w, h, seed, cls) {
    const wrap = box(parent, x, y, w, h, "paperwrap", null, { filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.38))" });
    const c = box(wrap, 0, 0, w, h, "card paper " + (cls || ""), null, { clipPath: tornClip(seed), borderRadius: "0" });
    return { wrap, card: c };
  }

  // ---------- animation macros ----------
  const E = { out: "power3.out", inout: "power2.inOut", back: "back.out(1.6)", soft: "sine.inOut", expo: "expo.out" };
  function fadeIn(el, t, d = 0.6, from = {}) {
    tl.fromTo(el, Object.assign({ opacity: 0 }, from), { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: d, ease: E.out }, t);
  }
  function popIn(el, t, d = 0.55, s0 = 0.6) {
    tl.fromTo(el, { opacity: 0, scale: s0 }, { opacity: 1, scale: 1, duration: d, ease: E.back }, t);
  }
  function fadeOut(el, t, d = 0.5, to = {}) {
    tl.to(el, Object.assign({ opacity: 0, duration: d, ease: "power2.in" }, to), t);
  }
  function slideIn(el, t, dx = 0, dy = 40, d = 0.7, rot = 0) {
    tl.fromTo(el, { opacity: 0, x: dx, y: dy, rotation: rot }, { opacity: 1, x: 0, y: 0, rotation: 0, duration: d, ease: E.out }, t);
  }
  function revealLetters(spans, t, opt = {}) {
    const st = opt.stagger ?? 0.045;
    tl.fromTo(spans, { opacity: 0, y: opt.y ?? 40, rotationX: opt.rx ?? -70, filter: "blur(6px)" },
      { opacity: 1, y: 0, rotationX: 0, filter: "blur(0px)", duration: opt.d ?? 0.6, ease: E.out, stagger: st }, t);
    return t + st * spans.length + (opt.d ?? 0.6);
  }
  function typeOn(spans, t, cps = 22) {
    spans.forEach((s, i) => tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t + i / cps));
    return t + spans.length / cps;
  }
  function wipeIn(el, t, d = 0.9, dir = "right") {
    const from = { right: "inset(0 100% 0 0)", left: "inset(0 0 0 100%)", down: "inset(0 0 100% 0)", up: "inset(100% 0 0 0)" }[dir];
    tl.fromTo(el, { clipPath: from, opacity: 1 }, { clipPath: "inset(0 0% 0 0)", duration: d, ease: E.inout }, t);
  }
  function drawLine(el, t, d = 0.8, axis = "x") {
    tl.fromTo(el, axis === "x" ? { scaleX: 0 } : { scaleY: 0 }, axis === "x" ? { scaleX: 1, duration: d, ease: E.inout } : { scaleY: 1, duration: d, ease: E.inout }, t);
  }
  function drawSVG(paths, t, d = 1.2, stagger = 0) {
    const arr = paths.length != null ? Array.from(paths) : [paths];
    arr.forEach((p, i) => {
      const L = p.getTotalLength ? p.getTotalLength() : 400;
      p.style.strokeDasharray = L + " " + L;
      tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: d, ease: E.inout }, t + i * stagger);
    });
  }
  // camera move on an inner wrapper
  function cam(el, t0, t1, from, to, ease = "sine.inOut") {
    tl.fromTo(el, Object.assign({ scale: 1, x: 0, y: 0, rotation: 0 }, from), Object.assign({ scale: 1, x: 0, y: 0, rotation: 0, duration: Math.max(0.1, t1 - t0), ease }, to), t0);
  }
  // seeded flicker of opacity (candle/lamp)
  function flicker(el, t0, t1, seed, lo = 0.6, hi = 1) {
    const r = rng(seed); let t = t0;
    tl.set(el, { opacity: hi }, t0);
    while (t < t1) {
      const d = 0.08 + r() * 0.22;
      tl.to(el, { opacity: lo + (hi - lo) * r(), scale: 0.97 + r() * 0.06, duration: d, ease: "sine.inOut" }, t);
      t += d;
    }
  }
  // drifting dust / particles
  function dust(parent, n, seed, t0, t1, opt = {}) {
    const r = rng(seed); const out = [];
    const layer = box(parent, 0, 0, 1920, 1080, "", null, { pointerEvents: "none" });
    for (let i = 0; i < n; i++) {
      const s = (opt.min ?? 2) + r() * ((opt.max ?? 6) - (opt.min ?? 2));
      const x = r() * 1920, y = r() * 1080;
      const p = box(layer, x, y, s, s, "particle", null, { background: opt.color || "rgba(255,226,170,0.9)" });
      const dur = t1 - t0;
      tl.fromTo(p, { x: 0, y: 0, opacity: 0 }, { x: (r() - 0.5) * (opt.dx ?? 160), y: -(opt.rise ?? 120) * (0.4 + r()), duration: dur, ease: "none" }, t0);
      const tw = Math.max(1, Math.floor(dur / (1.6 + r() * 2)));
      tl.to(p, { opacity: (opt.op ?? 0.7) * (0.4 + r() * 0.6), duration: dur / (tw * 2), yoyo: true, repeat: tw * 2 - 1, ease: "sine.inOut" }, t0 + r());
      out.push(p);
    }
    return layer;
  }
  function lowerThird(parent, name, sub, t, hold, opts = {}) {
    const lt = mk("div", "lt", parent, null, opts.style || {});
    const bar = mk("div", "lt-bar", lt);
    const n = mk("div", "lt-name", lt);
    const ls = letters(n, name);
    const sb = mk("div", "lt-sub", lt, sub);
    drawLine(bar, t, 0.5, "y");
    revealLetters(ls, t + 0.15, { stagger: 0.03, y: 20, rx: 0, d: 0.45 });
    slideIn(sb, t + 0.5, -30, 0, 0.6);
    sfx("lowerthird", t, 0.8);
    if (hold) { fadeOut(lt, t + hold, 0.6, { x: -30 }); }
    return lt;
  }
  // a horizontal labelled timeline with year ticks
  function yearTimeline(parent, x, y, w, years, color = "var(--gold)") {
    const g = box(parent, x, y, w, 120, "");
    const line = box(g, 0, 60, w, 3, "rule", null, { background: color });
    const ticks = years.map((yr) => {
      const tx = yr.pos * w;
      const tick = box(g, tx - 9, 51, 18, 18, "dot", null, { border: "3px solid " + color, background: "var(--navy2)" });
      const lab = box(g, tx - 120, yr.up ? -6 : 84, 240, 50, "", `<div style="text-align:center;font-family:'Playfair Display';font-weight:700;font-size:40px;color:var(--ivory)">${yr.label}</div>`);
      const cap = yr.cap ? box(g, tx - 160, yr.up ? 36 - 74 : 130, 320, 40, "", `<div style="text-align:center;font-family:Inter;font-weight:500;font-size:22px;letter-spacing:.08em;color:var(--gold2);text-transform:uppercase">${yr.cap}</div>`) : null;
      return { tick, lab, cap, yr };
    });
    return { g, line, ticks };
  }

  window.HF = { tl, SFX, S, at, endOf, rng, sfx, mk, box, img, letters, words, ICON, icon, tornClip, paperCard, E, fadeIn, popIn, fadeOut, slideIn, revealLetters, typeOn, wipeIn, drawLine, drawSVG, cam, flicker, dust, lowerThird, yearTimeline, px };
})();
