/* Scenes 01–08: hook, family, title, ancient world, early explanations, caution, Kraepelin, dementia praecox */
(function () {
  const H = HF;
  const { tl, S, at, endOf, mk, box, img, letters, words, icon, paperCard, fadeIn, popIn, fadeOut, slideIn, revealLetters, typeOn, wipeIn, drawLine, drawSVG, cam, flicker, dust, lowerThird, sfx, rng, E } = H;

  // ---------- shared scene helpers ----------
  function plate(parent, src, t0, t1, from, to, cls) {
    const wrap = box(parent, 0, 0, 1920, 1080, "", null, { overflow: "hidden" });
    const inner = box(wrap, 0, 0, 1920, 1080, "");
    img(inner, src, cls || "plate");
    cam(inner, t0, t1, from || { scale: 1.0 }, to || { scale: 1.08 });
    return { wrap, inner };
  }
  function grade(parent, kind) {
    const g = box(parent, 0, 0, 1920, 1080, "", null, { pointerEvents: "none" });
    if (kind === "sepia") Object.assign(g.style, { background: "linear-gradient(rgba(120,82,40,0.16), rgba(60,36,18,0.22))", mixBlendMode: "multiply" });
    if (kind === "night") Object.assign(g.style, { background: "linear-gradient(rgba(10,20,45,0.28), rgba(5,10,25,0.4))", mixBlendMode: "multiply" });
    if (kind === "teal") Object.assign(g.style, { background: "linear-gradient(rgba(19,35,63,0.25), rgba(40,90,95,0.18))", mixBlendMode: "multiply" });
    return g;
  }
  function text(parent, x, y, w, html, cls, style) {
    return box(parent, x, y, w, null, cls || "", html, style);
  }
  function chip(parent, x, y, iconName, label, opts = {}) {
    const c = box(parent, x, y, opts.w || null, null, "card chip " + (opts.cls || ""), null, opts.style || {});
    const ic = mk("div", "icon", c, H.ICON[iconName], { width: (opts.is || 54) + "px", height: (opts.is || 54) + "px", color: opts.ic || "var(--gold3)", flex: "none" });
    const l = mk("div", "", c, label);
    return { c, ic, l };
  }
  function ringPulse(parent, cx, cy, t0, n, color, maxR = 420, gap = 0.55) {
    for (let i = 0; i < n; i++) {
      const r = box(parent, cx - 20, cy - 20, 40, 40, "dot", null, { border: `2px solid ${color}` });
      tl.fromTo(r, { scale: 0.3, opacity: 0.9 }, { scale: maxR / 20, opacity: 0, duration: 2.2, ease: "power1.out" }, t0 + i * gap);
    }
  }
  function burst(parent, x, y, t, color = "var(--gold2)", n = 10, seed = 3) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = 60 + r() * 60;
      const p = box(parent, x - 3, y - 3, 6, 6, "dot", null, { background: color });
      tl.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.3, duration: 0.9, ease: "power3.out" }, t);
    }
  }
  function ornament(parent, x, y, w, t) {
    const l1 = box(parent, x, y, w / 2 - 22, 2, "rule");
    const l2 = box(parent, x + w / 2 + 22, y, w / 2 - 22, 2, "rule", null, { transformOrigin: "right center" });
    const d = box(parent, x + w / 2 - 8, y - 7, 16, 16, "", null, { background: "var(--gold)", transform: "rotate(45deg)" });
    drawLine(l1, t, 0.8); drawLine(l2, t, 0.8); popIn(d, t + 0.5, 0.5, 0);
    return [l1, l2, d];
  }
  Object.assign(H, { plate, grade, text, chip, ringPulse, burst, ornament });

  // ======================= S01 — night room hook =======================
  S.s01 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start);
    const v = PLAN.videos.v1;
    // base: the lonely room, slowly pulling back so it lands exactly on the video's first frame
    const p1 = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden" });
    const p1i = box(p1, 0, 0, 1920, 1080, "");
    img(p1i, "assets/img/01_night_room.jpg", "cover");
    cam(p1i, 0, v.start, { scale: 1.16, x: -60, y: -20 }, { scale: 1.0, x: 0, y: 0 });
    const candle = box(p1i, 1060, 380, 260, 260, "glow");
    flicker(candle, 0, v.start + 0.6, 11, 0.55, 1);
    // after the video: hold its last frame and push in slowly, shadows close in
    const p2 = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    const p2i = box(p2, 0, 0, 1920, 1080, "");
    img(p2i, "assets/vid/v1_turn_last.jpg", "cover");
    tl.set(p2, { opacity: 1 }, v.start + v.dur - 0.6);
    cam(p2i, v.start + v.dur - 0.6, sc.end, { scale: 1.0 }, { scale: 1.14, x: 40, y: -10 });
    const candle2 = box(p2i, 1060, 380, 260, 260, "glow");
    flicker(candle2, v.start + v.dur - 0.6, sc.end, 12, 0.5, 0.95);
    grade(b, "night");
    box(b, 0, 0, 1920, 1080, "vignette");
    dust(b, 26, 5, 0, sc.end, { color: "rgba(220,230,255,0.8)", op: 0.5, rise: 60, max: 4 });

    // kinetic: 200 TAHUN YANG LALU with a rolling year counter
    const t200 = T("200");
    const k = box(f, 120, 250, 1100, 400, "");
    const yr = text(k, 0, 0, 900, "2026", "type", { fontSize: "40px", color: "var(--gold2)", letterSpacing: ".3em" });
    const big = text(k, 0, 60, 1100, "", "h-xl", { color: "var(--ivory)", textShadow: "0 6px 30px rgba(0,0,0,.6)" });
    const L = letters(big, "200 TAHUN");
    const sub = text(k, 6, 225, 900, "YANG LALU", "kicker", { fontSize: "34px" });
    fadeIn(yr, t200 - 0.6, 0.4);
    const ctr = { v: 2026 };
    tl.to(ctr, { v: 1826, duration: 1.6, ease: "power2.inOut", onUpdate: () => { yr.textContent = "± " + Math.round(ctr.v); } }, t200 - 0.5);
    revealLetters(L, t200, { stagger: 0.05 });
    slideIn(sub, t200 + 0.5, -20, 0, 0.6);
    sfx("tick", t200 - 0.5, 0.5); sfx("tick", t200 - 0.1, 0.5); sfx("tick", t200 + 0.3, 0.5); sfx("accent", t200, 0.6);
    fadeOut(k, T("suatu malam") + 0.4, 0.8, { y: -20, filter: "blur(6px)" });

    // the voice: soft sound rings from the dark side of the room
    const tv = T("suara panggil");
    ringPulse(f, 520, 470, tv - 0.2, 4, "rgba(227,201,143,0.55)", 360, 0.5);
    const w1 = text(f, 260, 330, 700, "“…nama anda…”", "garamond", { fontStyle: "italic", fontSize: "64px", color: "rgba(245,238,223,0.85)", textShadow: "0 0 18px rgba(227,201,143,.6)" });
    tl.fromTo(w1, { opacity: 0, x: -30, filter: "blur(8px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.0, ease: "sine.out" }, T("nama anda") - 0.2);
    tl.to(w1, { opacity: 0, x: 40, filter: "blur(10px)", duration: 1.2 }, T("nama anda") + 1.4);
    sfx("whisper", tv - 0.3, 0.55);

    // "tak ada siapa pun" — an empty outline where someone should be
    const tEmpty = T("tak ada siapa");
    const ghost = icon(f, "person", 300, 300, 260, "rgba(245,238,223,0.0)");
    ghost.style.color = "rgba(245,238,223,0.55)";
    tl.fromTo(ghost, { opacity: 0, scale: 0.9 }, { opacity: 0.8, scale: 1, duration: 0.5 }, tEmpty - 0.3);
    tl.to(ghost, { opacity: 0, scale: 1.08, filter: "blur(10px)", duration: 1.0 }, tEmpty + 0.4);
    drawSVG(ghost.querySelectorAll("path,circle"), tEmpty - 0.3, 0.6);

    // "Esoknya" — a torn note slides in
    const tE = T("esoknya");
    const n1 = paperCard(f, 130, 120, 420, 120, 21);
    text(n1.card, 0, 30, 420, "Esoknya…", "garamond", { fontStyle: "italic", fontWeight: "600", fontSize: "54px", textAlign: "center", color: "var(--ink)" });
    slideIn(n1.wrap, tE - 0.2, -60, -20, 0.7, -6);
    sfx("paper", tE - 0.2, 0.7);
    fadeOut(n1.wrap, tE + 2.2, 0.6, { y: -20 });

    // voice speaks about you — waveform line that keeps breathing
    const tK = T("kali ini");
    const wave = mk("div", "abs", f, `<svg width="900" height="160" viewBox="0 0 900 160"><path d="M0 80 C60 80 60 20 120 20 S180 140 240 140 300 40 360 40 420 120 480 120 540 60 600 60 660 100 720 100 780 80 900 80" fill="none" stroke="#e3c98f" stroke-width="3" stroke-linecap="round"/></svg>`, { left: "160px", top: "210px", opacity: 0 });
    tl.to(wave, { opacity: 0.85, duration: 0.4 }, tK);
    drawSVG(wave.querySelectorAll("path"), tK, 1.4);
    tl.to(wave, { scaleY: 0.5, duration: 0.5, yoyo: true, repeat: 5, ease: "sine.inOut" }, tK + 1.4);
    const w2 = text(f, 180, 380, 900, "“…tentang diri anda…”", "garamond", { fontStyle: "italic", fontSize: "60px", color: "rgba(245,238,223,0.9)" });
    tl.fromTo(w2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, T("tentang diri") - 0.2);
    tl.to([wave, w2], { opacity: 0, duration: 0.8 }, T("tentang diri") + 1.6);
    sfx("whoosh_soft", tK - 0.1, 0.5);

    // paranoia: shadows close in, watchful outlines, a burgundy pulse on "mencederakan"
    const tP = T("percaya");
    const sh = box(f, 0, 0, 1920, 1080, "", null, { background: "radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 30%, rgba(4,6,14,0.92) 72%)", opacity: 0 });
    tl.to(sh, { opacity: 1, duration: 3.5, ease: "sine.inOut" }, tP - 0.5);
    const eyes = [[220, 180], [1560, 230], [300, 700], [1500, 640]].map(([x, y], i) => {
      const e = icon(f, "eye", x, y, 120, "rgba(227,201,143,0.5)");
      tl.fromTo(e, { opacity: 0, scale: 0.7 }, { opacity: 0.75, scale: 1, duration: 0.8, ease: "sine.out" }, T("memerhatikan") - 0.3 + i * 0.25);
      drawSVG(e.querySelectorAll("path,circle"), T("memerhatikan") - 0.3 + i * 0.25, 0.8);
      return e;
    });
    sfx("pulse_low", T("memerhatikan") - 0.2, 0.5);
    const red = box(f, 0, 0, 1920, 1080, "", null, { background: "radial-gradient(ellipse at 50% 50%, rgba(125,46,58,0) 40%, rgba(125,46,58,0.55) 100%)", opacity: 0 });
    const tM = T("mencederakan");
    tl.to(red, { opacity: 1, duration: 0.25 }, tM).to(red, { opacity: 0.25, duration: 0.9 }, tM + 0.25);
    tl.to(eyes, { opacity: 0, duration: 0.8 }, tM + 0.8);
    sfx("heartbeat", tM - 0.05, 0.55);
  };

  // ======================= S02 — the family does not understand =======================
  S.s02 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const v = PLAN.videos.v4;
    const p = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden" });
    const pi = box(p, 0, 0, 1920, 1080, "");
    img(pi, "assets/vid/v4_family_last.jpg", "cover");
    cam(pi, v.start + v.dur - 0.6, sc.end, { scale: 1.0 }, { scale: 1.1, x: -50 });
    const lamp = box(pi, -40, 260, 260, 260, "glow");
    flicker(lamp, sc.start, sc.end, 21, 0.5, 0.95);
    grade(b, "sepia");
    box(b, 0, 0, 1920, 1080, "vignette warm");

    // "tak faham" — a question mark drawn over the relatives
    const tq = T("tak faham");
    const q = text(f, 470, 120, 200, "?", "serif", { fontSize: "190px", fontWeight: "700", color: "var(--gold2)", textShadow: "0 8px 30px rgba(0,0,0,.6)" });
    popIn(q, tq - 0.2, 0.6, 0.3);
    tl.to(q, { rotation: -8, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, tq + 0.4);
    fadeOut(q, T("ada yang kata") + 0.2, 0.4);
    sfx("pop", tq - 0.2, 0.6);

    // speech bubbles in torn paper: the labels people used
    const bubbles = [
      { ph: "kena gangguan", txt: "“Kena gangguan…”", x: 120, y: 150, rot: -4, seed: 31 },
      { ph: "kena rasuk", txt: "“Kena rasuk…”", x: 640, y: 90, rot: 3, seed: 32 },
      { ph: "takut dengan", txt: "“Takut…”", x: 1120, y: 170, rot: -2, seed: 33 },
    ];
    bubbles.forEach((bb, i) => {
      const t = T(bb.ph) - 0.15;
      const pc = paperCard(f, bb.x, bb.y, 470, 140, bb.seed);
      text(pc.card, 0, 38, 470, bb.txt, "garamond", { fontStyle: "italic", fontWeight: "700", fontSize: "52px", textAlign: "center", color: "var(--ink)" });
      const tail = box(pc.wrap, 70 + i * 40, 128, 40, 40, "", null, { background: "url(assets/tex/paper.jpg)", clipPath: "polygon(0 0,100% 0,20% 100%)" });
      tl.fromTo(pc.wrap, { opacity: 0, y: 40, rotation: bb.rot * 3, scale: 0.8 }, { opacity: 1, y: 0, rotation: bb.rot, scale: 1, duration: 0.6, ease: E.back }, t);
      tl.to(pc.wrap, { y: -8, duration: 1.2, yoyo: true, repeat: 2, ease: "sine.inOut" }, t + 0.6);
      sfx("paper", t, 0.65);
    });
    const tEnd = T("sedangkan");
    tl.to(f.querySelectorAll(".paperwrap"), { opacity: 0, y: -30, duration: 0.6, stagger: 0.08 }, tEnd - 0.6);
  };

  // ======================= S03 — the name & title card =======================
  S.s03 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-navy");
    dust(b, 40, 7, sc.start, sc.end, { color: "rgba(227,201,143,0.9)", op: 0.6, rise: 90, max: 4 });
    box(b, 0, 0, 1920, 1080, "vignette");
    // a gold thread draws across, carrying us out of the room
    const thread = box(f, 0, 520, 1920, 2, "rule");
    drawLine(thread, sc.start + 0.1, 1.4);
    sfx("whoosh_long", sc.start + 0.05, 0.6);
    const k = text(f, 0, 380, 1920, "apa yang anda alami…", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "56px", color: "var(--ivory)" });
    fadeIn(k, sc.start + 0.6, 0.8, { y: 20 });
    fadeOut(k, T("skizofrenia") - 0.6, 0.5);
    tl.to(thread, { opacity: 0, duration: 0.5 }, T("skizofrenia") - 0.6);

    // SKIZOFRENIA assembles letter by letter
    const tS = T("skizofrenia");
    const word = text(f, 0, 380, 1920, "", "h-xl", { textAlign: "center", color: "var(--gold2)", letterSpacing: "0.08em", textShadow: "0 10px 40px rgba(0,0,0,.5)" });
    const L = letters(word, "SKIZOFRENIA");
    const r = rng(17);
    tl.fromTo(L, { opacity: 0, y: () => (r() - 0.5) * 300, x: () => (r() - 0.5) * 400, rotation: () => (r() - 0.5) * 90, filter: "blur(10px)" },
      { opacity: 1, y: 0, x: 0, rotation: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.04 }, tS - 0.25);
    const ul = box(f, 560, 560, 800, 3, "rule");
    drawLine(ul, tS + 0.8, 0.9);
    sfx("accent", tS - 0.1, 0.9); sfx("shimmer", tS + 0.3, 0.4);

    // only ~100 years old: counter
    const tB = T("baru diperkenalkan");
    tl.to(word, { y: -120, scale: 0.72, duration: 0.8, ease: E.inout }, tB - 0.3);
    tl.to(ul, { y: -150, scaleX: 0.6, duration: 0.8, ease: E.inout }, tB - 0.3);
    const cnt = text(f, 0, 470, 1920, "", "serif", { textAlign: "center", fontSize: "120px", fontWeight: "700", color: "var(--ivory)" });
    const cap = text(f, 0, 620, 1920, "TAHUN — USIA NAMA INI", "kicker", { textAlign: "center", fontSize: "26px" });
    const c = { v: 0 };
    tl.fromTo(cnt, { opacity: 0 }, { opacity: 1, duration: 0.3 }, T("sekitar 100") - 0.2);
    tl.to(c, { v: 100, duration: 1.3, ease: "power2.out", onUpdate: () => { cnt.textContent = "± " + Math.round(c.v); } }, T("sekitar 100") - 0.2);
    fadeIn(cap, T("sekitar 100") + 0.6, 0.6);
    sfx("tick", T("sekitar 100") - 0.2, 0.4); sfx("tick", T("sekitar 100") + 0.2, 0.4); sfx("tick", T("sekitar 100") + 0.6, 0.4);

    // before the name existed… letters scatter
    const tJ = T("jadi sebelum");
    tl.to([cnt, cap, ul], { opacity: 0, duration: 0.5 }, tJ);
    tl.to(L, { opacity: 0, y: () => (r() - 0.5) * 200 - 80, x: () => (r() - 0.5) * 300, filter: "blur(8px)", duration: 1.2, stagger: 0.03, ease: "power2.in" }, tJ + 0.2);
    sfx("whoosh_soft", tJ + 0.2, 0.5);

    // title card
    const tT = T("bagaimana manusia") - 0.1;
    const title = box(f, 0, 270, 1920, 420, "");
    const kick = text(title, 0, 0, 1920, "DR AZREN · DOKUMENTARI", "kicker", { textAlign: "center" });
    const t1 = text(title, 0, 50, 1920, "", "h-xl", { textAlign: "center", color: "var(--ivory)", fontSize: "132px" });
    const tw = words(t1, "SEJARAH SKIZOFRENIA");
    tw[1].style.color = "var(--gold2)";
    ornament(title, 610, 230, 700, tT + 0.6);
    const t2 = text(title, 0, 262, 1920, "Bagaimana Manusia Mula Memahami Penyakit Ini?", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "54px", color: "var(--parch)" });
    fadeIn(kick, tT, 0.6, { y: -10 });
    tl.fromTo(tw, { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: E.out, stagger: 0.25 }, tT + 0.1);
    fadeIn(t2, tT + 1.1, 0.9, { y: 20 });
    tl.to(title, { scale: 1.04, duration: sc.end - tT, ease: "none" }, tT);
    sfx("boom", tT + 0.05, 0.85); sfx("shimmer", tT + 1.0, 0.35);
    const glow = box(f, 560, 300, 800, 400, "glow", null, { opacity: 0 });
    tl.to(glow, { opacity: 0.6, duration: 1.5 }, tT).to(glow, { opacity: 0.25, duration: 2 }, tT + 1.5);
  };

  // ======================= S04 — rewind to ancient civilisations =======================
  S.s04 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const tJ = T("jom kita balik sejarah");
    box(b, 0, 0, 1920, 1080, "tex-paper");
    // rewinding clock + streaming timeline (camera travels back)
    const clk = box(f, 760, 150, 400, 400, "");
    clk.innerHTML = `<svg viewBox="0 0 200 200" width="400" height="400"><circle cx="100" cy="100" r="92" fill="rgba(234,220,192,.0)" stroke="#9b7a3a" stroke-width="4"/>${Array.from({ length: 12 }, (_, i) => `<line x1="100" y1="14" x2="100" y2="26" stroke="#2b2218" stroke-width="3" transform="rotate(${i * 30} 100 100)"/>`).join("")}<line class="hh" x1="100" y1="100" x2="100" y2="52" stroke="#2b2218" stroke-width="6" stroke-linecap="round"/><line class="mh" x1="100" y1="100" x2="100" y2="30" stroke="#7d2e3a" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#2b2218"/></svg>`;
    const hh = clk.querySelector(".hh"), mh = clk.querySelector(".mh");
    popIn(clk, tJ - 0.3, 0.6, 0.5);
    tl.fromTo(mh, { rotation: 0, svgOrigin: "100 100" }, { rotation: -1440, svgOrigin: "100 100", duration: 2.6, ease: "power2.inOut" }, tJ);
    tl.fromTo(hh, { rotation: 0, svgOrigin: "100 100" }, { rotation: -120, svgOrigin: "100 100", duration: 2.6, ease: "power2.inOut" }, tJ);
    const strip = box(f, 0, 640, 1920, 120, "");
    for (let i = 0; i < 40; i++) box(strip, i * 120, 40, 2, i % 5 === 0 ? 60 : 30, "", null, { background: "#9b7a3a" });
    tl.fromTo(strip, { x: -2400, opacity: 0 }, { x: 0, opacity: 1, duration: 2.6, ease: "power2.inOut" }, tJ);
    const back = text(f, 0, 580, 1920, "KEMBALI KE MASA LALU", "kicker", { textAlign: "center", color: "var(--gold3)" });
    fadeIn(back, tJ + 0.4, 0.5);
    sfx("rewind", tJ - 0.1, 0.7);
    tl.to([clk, strip, back], { opacity: 0, y: -40, duration: 0.6 }, T("pengalaman") - 0.5);

    // three experiences as cards
    const items = [
      { ph: "mendengar suara", ic: "ear", txt: "Mendengar suara yang orang lain tak dengar" },
      { ph: "mempunyai kepercayaan", ic: "thought", txt: "Kepercayaan yang luar biasa" },
      { ph: "perubahan tingkah", ic: "change", txt: "Perubahan tingkah laku" },
    ];
    items.forEach((it, i) => {
      const t = T(it.ph) - 0.2;
      const pc = paperCard(f, 150 + i * 560, 250, 500, 380, 40 + i);
      const ic = icon(pc.card, it.ic, 175, 60, 150, "var(--burg)");
      text(pc.card, 40, 240, 420, it.txt, "serif", { fontSize: "38px", fontWeight: "700", textAlign: "center", color: "var(--ink)", lineHeight: "1.15" });
      tl.fromTo(pc.wrap, { opacity: 0, y: 80, rotation: (i - 1) * 6 }, { opacity: 1, y: 0, rotation: (i - 1) * 2, duration: 0.7, ease: E.back }, t);
      drawSVG(ic.querySelectorAll("path,circle"), t + 0.2, 1.0);
      sfx("paper", t, 0.6);
    });
    // recorded since ancient civilisations: city plate tears in
    const tR = T("direkodkan");
    tl.to(f.querySelectorAll(".paperwrap"), { opacity: 0, y: -60, rotation: 4, duration: 0.6, stagger: 0.07 }, tR - 1.6);
    const city = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    const ci = box(city, 0, 0, 1920, 1080, "");
    img(ci, "assets/img/03_ancient_city.jpg", "plate");
    tl.set(city, { opacity: 1 }, tR - 1.2);
    tl.fromTo(city, { clipPath: H.tornClip(55, 3).replace(/(\d+\.\d+)% (\d+\.\d+)%/g, (m, a, c) => `${(+a * 0.0 + 50).toFixed(2)}% ${c}%`) }, { clipPath: H.tornClip(55, 3), duration: 1.0, ease: E.inout }, tR - 1.2);
    cam(ci, tR - 1.2, sc.end, { scale: 1.12, x: 80 }, { scale: 1.0, x: -40 });
    grade(city, "sepia");
    box(city, 0, 0, 1920, 1080, "vignette warm");
    dust(city, 24, 9, tR - 1.2, sc.end, { op: 0.5, rise: 70 });
    sfx("tear", tR - 1.2, 0.7);
    // scroll unrolls with abstract record marks
    const scr = box(f, 1230, 170, 560, 420, "");
    const sheet = box(scr, 30, 30, 500, 360, "card paper", null, { borderRadius: "4px" });
    for (let i = 0; i < 8; i++) box(sheet, 50, 50 + i * 36, 260 + ((i * 53) % 140), 6, "", null, { background: "rgba(43,34,24,.55)", borderRadius: "3px" });
    const rodT = box(scr, 0, 10, 560, 34, "", null, { background: "linear-gradient(#7a5a2a,#b38a4a,#7a5a2a)", borderRadius: "17px" });
    const rodB = box(scr, 0, 376, 560, 34, "", null, { background: "linear-gradient(#7a5a2a,#b38a4a,#7a5a2a)", borderRadius: "17px" });
    const lbl = text(f, 1230, 610, 560, "Direkodkan sejak zaman tamadun", "serif", { fontSize: "36px", fontWeight: "700", textAlign: "center", color: "var(--ivory)", textShadow: "0 4px 18px rgba(0,0,0,.7)" });
    tl.fromTo(sheet, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: E.inout }, tR);
    tl.fromTo(rodB, { y: -366 }, { y: 0, duration: 1.1, ease: E.inout }, tR);
    fadeIn(rodT, tR - 0.2, 0.3); fadeIn(rodB, tR - 0.2, 0.3);
    fadeIn(lbl, tR + 0.8, 0.6, { y: 20 });
    sfx("scroll", tR, 0.6);
  };

  // ======================= S05 — how societies explained it =======================
  S.s05 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const bg = plate(b, "assets/img/03_ancient_city.jpg", sc.start, sc.end, { scale: 1.0, x: -40 }, { scale: 1.06, x: -120 });
    tl.set(bg.inner, { filter: "blur(5px) brightness(0.55) sepia(0.4)" }, sc.start);
    box(b, 0, 0, 1920, 1080, "vignette warm");
    dust(b, 20, 13, sc.start, sc.end, { op: 0.45, rise: 60 });
    const hdr = text(f, 0, 110, 1920, "", "h-md", { textAlign: "center", color: "var(--ivory)" });
    const hl = letters(hdr, "Pelbagai cara menerangkan");
    revealLetters(hl, T("pelbagai cara") - 0.3, { stagger: 0.025, y: 20, rx: 0, d: 0.4 });
    sfx("type", T("pelbagai cara") - 0.3, 0.45);
    const panels = [
      { ph: "kuasa ghaib", title: "Kuasa ghaib", x: 110, seed: 61 },
      { ph: "agama", title: "Agama & spiritual", x: 690, seed: 62 },
      { ph: "pengamal perubatan", title: "Pengamal perubatan awal", x: 1270, seed: 63 },
    ];
    panels.forEach((p, i) => {
      const t = T(p.ph) - 0.3;
      const pc = paperCard(f, p.x, 230, 540, 560, p.seed);
      const art = box(pc.card, 30, 30, 480, 360, "", null, { overflow: "hidden", borderRadius: "3px", background: "#1b2236" });
      if (i === 0) {
        art.style.background = "radial-gradient(circle at 60% 40%, #2c3d66, #0e1628)";
        const m = icon(art, "moon", 150, 70, 180, "var(--gold2)");
        const r = rng(70);
        for (let s = 0; s < 18; s++) {
          const st = box(art, r() * 460, r() * 340, 4, 4, "dot", null, { background: "#f5eedf" });
          tl.fromTo(st, { opacity: 0.1 }, { opacity: 1, duration: 0.5 + r(), yoyo: true, repeat: 5, ease: "sine.inOut" }, t + r());
        }
        drawSVG(m.querySelectorAll("path"), t + 0.2, 1.2);
      } else if (i === 1) {
        art.style.background = "radial-gradient(circle at 50% 60%, #5a3a1c, #1c120a)";
        const lampGlow = box(art, 130, 80, 220, 220, "glow");
        flicker(lampGlow, t, sc.end, 71, 0.5, 1);
        const lp = icon(art, "lamp", 165, 110, 150, "var(--gold2)");
        const scl = icon(art, "scroll", 40, 230, 100, "var(--parch)");
        drawSVG(lp.querySelectorAll("path"), t + 0.2, 1.0);
      } else {
        img(art, "assets/img/04_healer.jpg", "cover");
        const hi = art.querySelector("img");
        tl.fromTo(hi, { scale: 1.15 }, { scale: 1.0, duration: sc.end - t, ease: "none" }, t);
      }
      text(pc.card, 20, 420, 500, p.title, "serif", { fontSize: "42px", fontWeight: "700", textAlign: "center", color: "var(--ink)" });
      tl.fromTo(pc.wrap, { opacity: 0, y: 120, rotation: -6 + i * 6 }, { opacity: 1, y: 0, rotation: -1.5 + i * 1.5, duration: 0.8, ease: E.back }, t);
      sfx("paper", t, 0.6);
      if (i === 2) {
        const tg = T("gangguan kesihatan") - 0.2;
        const tag = text(pc.card, 60, 482, 420, "→ gangguan kesihatan", "type", { fontSize: "28px", textAlign: "center", color: "var(--burg)" });
        fadeIn(tag, tg, 0.5);
        sfx("type", tg, 0.4);
      }
    });
  };

  // ======================= S06 — caution: modern diagnosis =======================
  S.s06 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-paper");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    // not every unusual experience = schizophrenia
    const tB = T("bukan semua");
    const left = box(f, 150, 260, 640, 300, "card paper", null, { borderRadius: "8px" });
    icon(left, "ear", 40, 70, 110, "var(--burg)");
    icon(left, "thought", 170, 70, 110, "var(--burg)");
    text(left, 300, 60, 320, "Mendengar suara / kepercayaan luar biasa", "serif", { fontSize: "34px", fontWeight: "700", color: "var(--ink)", lineHeight: "1.2" });
    const neq = text(f, 830, 300, 260, "≠", "serif", { fontSize: "200px", textAlign: "center", color: "var(--burg)", lineHeight: "1" });
    const right = box(f, 1130, 300, 640, 220, "card navy", null, { borderRadius: "8px" });
    text(right, 0, 70, 640, "SKIZOFRENIA", "serif", { fontSize: "64px", fontWeight: "800", textAlign: "center", color: "var(--gold2)", letterSpacing: ".06em" });
    slideIn(left, tB - 0.2, -80, 0, 0.7);
    popIn(neq, T("semestinya") - 0.3, 0.5, 0.2);
    slideIn(right, T("semestinya") - 0.1, 80, 0, 0.7);
    sfx("whoosh_soft", tB - 0.2, 0.45); sfx("accent", T("semestinya") - 0.3, 0.5);
    const tD = T("skizofrenia ni dia");
    tl.to([left, neq, right], { opacity: 0, y: -40, duration: 0.5, stagger: 0.05 }, tD - 0.4);

    // modern diagnosis checklist
    const card = box(f, 560, 150, 800, 620, "card navy", null, { borderRadius: "12px" });
    const ttl = text(card, 50, 40, 700, "Diagnosis moden", "serif", { fontSize: "56px", fontWeight: "700", color: "var(--ivory)" });
    const sub = text(card, 52, 118, 700, "PENILAIAN TERHADAP", "kicker", { fontSize: "20px" });
    const rows = [
      { ph: "beberapa simptom", ic: "search", txt: "Beberapa simptom" },
      { ph: "tempoh penyakit", ic: "clock", txt: "Tempoh penyakit" },
      { ph: "kesan dia", ic: "life", txt: "Kesan kepada kehidupan" },
    ];
    slideIn(card, tD - 0.1, 0, 60, 0.8);
    fadeIn(ttl, tD + 0.2, 0.5); fadeIn(sub, tD + 0.5, 0.5);
    sfx("whoosh_soft", tD - 0.1, 0.45);
    rows.forEach((r0, i) => {
      const t = T(r0.ph) - 0.2;
      const row = box(card, 50, 190 + i * 130, 700, 110, "", null, { borderTop: "1px solid rgba(201,164,92,.35)" });
      const ic = icon(row, r0.ic, 0, 24, 70, "var(--teal2)");
      text(row, 100, 32, 480, r0.txt, "", { fontSize: "38px", fontWeight: "600", color: "var(--ivory)" });
      const ck = icon(row, "tick", 620, 22, 70, "var(--gold2)");
      slideIn(row, t, 40, 0, 0.5);
      drawSVG(ck.querySelectorAll("path"), t + 0.35, 0.4);
      sfx("click", t + 0.35, 0.6);
    });
    const tZ = T("zaman dulu manusia");
    tl.to(card, { opacity: 0, x: 300, duration: 0.6, ease: "power2.in" }, tZ - 0.4);

    // historical record: can't be judged retrospectively
    const page = box(f, 360, 130, 760, 660, "card paper", null, { borderRadius: "4px", transformOrigin: "left center" });
    text(page, 50, 40, 660, "Rekod sejarah", "type", { fontSize: "40px", color: "var(--ink)" });
    for (let i = 0; i < 11; i++) box(page, 50, 120 + i * 44, 520 + ((i * 71) % 120), 5, "", null, { background: "rgba(43,34,24,.45)", borderRadius: "3px" });
    tl.fromTo(page, { opacity: 0, rotationY: -70, transformPerspective: 1600 }, { opacity: 1, rotationY: 0, duration: 0.9, ease: E.out }, tZ - 0.2);
    sfx("page", tZ - 0.2, 0.7);
    const mag = icon(f, "search", 520, 300, 220, "var(--ink)");
    tl.fromTo(mag, { opacity: 0, x: 0, y: 0 }, { opacity: 1, duration: 0.4 }, tZ + 0.6);
    tl.to(mag, { x: 300, y: 160, duration: 2.2, ease: "sine.inOut" }, tZ + 0.8).to(mag, { x: 80, y: 260, duration: 1.8, ease: "sine.inOut" }, tZ + 3.0);
    const qm = text(f, 1180, 220, 500, "Sistem diagnosis moden belum wujud", "serif", { fontSize: "44px", fontWeight: "700", color: "var(--ink)", lineHeight: "1.2" });
    slideIn(qm, T("sistem ni") - 0.2, 40, 0, 0.6);
    const tS = T("sewenangwenangnya");
    const stamp = text(f, 1180, 470, 520, "", "stamp", {});
    stamp.textContent = "TIDAK BOLEH DIPASTIKAN";
    stamp.style.fontSize = "38px";
    tl.fromTo(stamp, { opacity: 0, scale: 2.2, rotation: -14 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.35, ease: "power4.in" }, tS);
    sfx("stamp", tS + 0.3, 0.8);
  };

  // ======================= S07 — 19th century Germany: Emil Kraepelin =======================
  S.s07 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const tJ = T("jom kita balik dekat");
    box(b, 0, 0, 1920, 1080, "tex-paper");
    // timeline travel to the 19th century
    const tlw = box(f, 0, 380, 1920, 300, "");
    const track = box(tlw, 0, 0, 5200, 300, "");
    box(track, 0, 120, 5200, 3, "", null, { background: "var(--gold3)" });
    const yrs = ["1700", "1750", "1800", "1850", "1900", "1950", "2000"];
    yrs.forEach((y, i) => {
      const x = 400 + i * 700;
      box(track, x, 100, 3, 44, "", null, { background: "var(--ink)" });
      text(track, x - 150, 160, 300, y, "serif", { fontSize: "54px", fontWeight: "700", textAlign: "center", color: "var(--ink)" });
    });
    const hl = box(track, 1800, 60, 1400, 124, "", null, { background: "rgba(201,164,92,.28)", border: "2px solid var(--gold)", borderRadius: "8px" });
    const hlt = text(track, 1800, 10, 1400, "ABAD KE-19", "kicker", { textAlign: "center", fontSize: "34px", color: "var(--burg)" });
    tl.fromTo(track, { x: 0 }, { x: -1550, duration: 2.4, ease: "power3.inOut" }, tJ);
    tl.fromTo(hl, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.8, ease: E.inout }, tJ + 1.4);
    fadeIn(hlt, tJ + 1.8, 0.5);
    sfx("whoosh_long", tJ, 0.6); sfx("tick", tJ + 2.0, 0.5);
    // Germany: the street plate opens like a shutter
    const tG = T("dekat jerman");
    const st = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    const sti = box(st, 0, 0, 1920, 1080, "");
    img(sti, "assets/img/05_german_street.jpg", "plate");
    tl.set(st, { opacity: 1 }, tG - 0.3);
    tl.fromTo(st, { clipPath: "inset(48% 0 48% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1.0, ease: E.inout }, tG - 0.3);
    tl.to(tlw, { opacity: 0, duration: 0.4 }, tG - 0.3);
    cam(sti, tG - 0.3, PLAN.videos.v2.start + 0.5, { scale: 1.12, x: 60 }, { scale: 1.0, x: -60 });
    grade(st, "sepia");
    box(st, 0, 0, 1920, 1080, "vignette warm");
    sfx("whoosh_soft", tG - 0.3, 0.5);
    const pin = box(f, 220, 170, 420, 110, "");
    const pic = icon(pin, "pin", 0, 0, 90, "var(--burg2)");
    text(pin, 100, 14, 320, "JERMAN", "serif", { fontSize: "58px", fontWeight: "800", color: "var(--ivory)", textShadow: "0 4px 18px rgba(0,0,0,.6)" });
    tl.fromTo(pin, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out" }, tG + 0.1);
    sfx("pop", tG + 0.3, 0.5);
    // portrait + lower third
    const tK = T("emil kraepelin");
    const fr = box(f, 1260, 110, 480, 600, "", null, { borderRadius: "50%", overflow: "hidden", border: "6px solid var(--gold)", boxShadow: "0 20px 50px rgba(0,0,0,.6)" });
    const pim = img(fr, "assets/img/p_kraepelin.jpg", "cover", { objectPosition: "50% 40%", transform: "scale(1.25)" });
    tl.fromTo(fr, { opacity: 0, scale: 0.85, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: E.out }, tK - 0.4);
    tl.fromTo(pim, { scale: 1.4 }, { scale: 1.22, duration: 3.5, ease: "sine.out" }, tK - 0.4);
    const sheen = box(fr, -400, 0, 300, 600, "", null, { background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,240,210,.35), rgba(255,255,255,0))" });
    tl.fromTo(sheen, { x: 0 }, { x: 1100, duration: 1.4, ease: "sine.inOut" }, tK + 0.4);
    lowerThird(f, "EMIL KRAEPELIN", "Pakar psikiatri Jerman · 1856–1926", tK - 0.1, 3.4);
    tl.to([fr, pin], { opacity: 0, duration: 0.5 }, PLAN.videos.v2.start - 0.2);

    // while he writes (video v2): the patients he studied
    const tM = T("perubahan pemikiran");
    ["pemikiran", "emosi", "tingkah laku"].forEach((w, i) => {
      const t = T(w === "tingkah laku" ? "tingkah laku" : w, 1) - 0.15;
      const c = box(f, 150 + i * 330, 640, 300, 96, "card paper", null, { display: "flex", alignItems: "center", justifyContent: "center" });
      c.innerHTML = `<div class="type" style="font-size:34px;color:var(--ink)">${w.toUpperCase()}</div>`;
      tl.fromTo(c, { opacity: 0, y: 40, rotation: -4 + i * 4 }, { opacity: 1, y: 0, rotation: -2 + i * 2, duration: 0.5, ease: E.back }, t);
      sfx("type", t, 0.4);
    });
    const tB = T("beliau melihat");
    tl.to(f.querySelectorAll(".card.paper"), { opacity: 0, y: 30, duration: 0.4, stagger: 0.05 }, tB - 0.6);
    void tM;

    // the desk still (after video) with observed symptom index-cards
    const v2 = PLAN.videos.v2;
    const dk = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    const dki = box(dk, 0, 0, 1920, 1080, "");
    img(dki, "assets/vid/v2_write_last.jpg", "cover");
    tl.set(dk, { opacity: 1 }, v2.start + v2.dur - 0.6);
    cam(dki, v2.start + v2.dur - 0.6, sc.end, { scale: 1.0 }, { scale: 1.12, x: -80, y: 30 });
    const lg = box(dki, 690, 0, 300, 300, "glow");
    flicker(lg, v2.start + v2.dur - 0.6, sc.end, 77, 0.5, 1);
    box(dk, 0, 0, 1920, 1080, "shade-r");
    const sym = [
      { ph: "halusinasi", t: "Halusinasi", s: "Mendengar / melihat sesuatu yang tiada" },
      { ph: "delusi", t: "Delusi", s: "Kepercayaan salah, dipegang dengan sangat teguh" },
      { ph: "gangguan pemikiran", t: "Gangguan pemikiran", s: "" },
      { ph: "kemerosotan fungsi", t: "Kemerosotan fungsi", s: "Dalam kehidupan seharian" },
    ];
    sym.forEach((s, i) => {
      const t = T(s.ph) - 0.2;
      const c = box(f, 1130, 110 + i * 172, 680, 150, "card paper", null, { borderRadius: "4px" });
      box(c, 0, 0, 12, 150, "", null, { background: i % 2 ? "var(--teal)" : "var(--burg)" });
      text(c, 40, 24, 620, s.t, "serif", { fontSize: "46px", fontWeight: "700", color: "var(--ink)" });
      if (s.s) text(c, 42, 88, 620, s.s, "", { fontSize: "24px", fontWeight: "500", color: "rgba(43,34,24,.8)" });
      tl.fromTo(c, { opacity: 0, x: 120, rotation: 3 }, { opacity: 1, x: 0, rotation: i % 2 ? 0.8 : -0.8, duration: 0.6, ease: E.out }, t);
      sfx("card", t, 0.55);
    });
  };

  // ======================= S08 — dementia praecox =======================
  S.s08 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-paper");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    dust(b, 14, 19, sc.start, sc.end, { color: "rgba(120,90,40,.6)", op: 0.5, rise: 40 });
    const tI = T("istilah dementia");
    const k = text(f, 0, 170, 1920, "ISTILAH KRAEPELIN", "kicker", { textAlign: "center", color: "var(--gold3)" });
    fadeIn(k, tI - 0.3, 0.5);
    const term = box(f, 0, 230, 1920, 200, "");
    const w1 = text(term, 0, 0, 1920, "", "h-lg", { textAlign: "center", color: "var(--ink)", fontSize: "118px", letterSpacing: ".04em" });
    const L1 = letters(w1, "DEMENTIA PRAECOX");
    const tD = T("dementia", 1);
    tl.fromTo(L1, { opacity: 0, y: -60, scale: 1.6, filter: "blur(6px)" }, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power4.in", stagger: 0.06 }, tD - 0.2);
    for (let i = 0; i < 16; i += 3) sfx("type", tD - 0.2 + i * 0.06 + 0.3, 0.45);
    sfx("accent", tD + 0.8, 0.5);
    const year = text(f, 0, 430, 1920, "Lehrbuch der Psychiatrie · edisi ke-6 · 1899", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "38px", color: "var(--gold3)" });
    fadeIn(year, tD + 1.0, 0.7);
    // plain meaning
    const tM = T("bahasa mudah");
    tl.to(term, { y: -60, duration: 0.6, ease: E.inout }, tM - 0.2);
    tl.to(k, { opacity: 0, duration: 0.3 }, tM - 0.3);
    tl.to(year, { opacity: 0, duration: 0.4 }, tM - 0.2);
    const gl1 = box(f, 300, 450, 600, 220, "");
    const gl2 = box(f, 1020, 450, 600, 220, "");
    const ar1 = box(gl1, 290, 0, 3, 60, "", null, { background: "var(--gold3)", transformOrigin: "top" });
    const ar2 = box(gl2, 290, 0, 3, 60, "", null, { background: "var(--gold3)", transformOrigin: "top" });
    const g1 = text(gl1, 0, 80, 600, "kemerosotan mental", "serif", { textAlign: "center", fontSize: "50px", fontWeight: "700", color: "var(--burg)" });
    const g2 = text(gl2, 0, 80, 600, "bermula awal — usia muda", "serif", { textAlign: "center", fontSize: "50px", fontWeight: "700", color: "var(--burg)" });
    drawLine(ar1, T("kemerosotan mental") - 0.3, 0.4, "y"); fadeIn(g1, T("kemerosotan mental") - 0.1, 0.5, { y: -10 });
    drawLine(ar2, T("bermula pada") - 0.3, 0.4, "y"); fadeIn(g2, T("bermula pada") - 0.1, 0.5, { y: -10 });
    sfx("pop", T("kemerosotan mental") - 0.1, 0.45); sfx("pop", T("bermula pada") - 0.1, 0.45);
    // distinguished from manic-depressive illness
    const tB = T("beliau membezakan");
    tl.to([term, gl1, gl2], { opacity: 0, y: -40, duration: 0.5, stagger: 0.05 }, tB - 0.5);
    const divl = box(f, 958, 180, 4, 560, "", null, { background: "var(--gold3)", transformOrigin: "top" });
    const cA = box(f, 200, 260, 680, 360, "card navy", null, { borderRadius: "10px" });
    text(cA, 0, 70, 680, "DEMENTIA PRAECOX", "serif", { textAlign: "center", fontSize: "54px", fontWeight: "800", color: "var(--gold2)" });
    text(cA, 60, 170, 560, "Kemerosotan yang dijangka berterusan", "", { textAlign: "center", fontSize: "30px", fontWeight: "500", color: "var(--ivory)" });
    const cB = box(f, 1040, 260, 680, 360, "card", null, { borderRadius: "10px" });
    text(cB, 0, 50, 680, "MANIC-DEPRESSIVE ILLNESS", "serif", { textAlign: "center", fontSize: "48px", fontWeight: "800", color: "var(--navy)" });
    text(cB, 60, 170, 560, "Episod berulang, dengan tempoh pulih di antaranya", "", { textAlign: "center", fontSize: "30px", fontWeight: "500", color: "var(--ink)" });
    const vs = text(f, 880, 400, 160, "vs", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "60px", color: "var(--burg)", background: "var(--parch)", borderRadius: "50%" });
    drawLine(divl, tB - 0.1, 0.7, "y");
    slideIn(cA, tB, -80, 0, 0.7);
    slideIn(cB, T("manicdepressive") - 0.4, 80, 0, 0.7);
    popIn(vs, T("manicdepressive") - 0.1, 0.4);
    sfx("whoosh_soft", tB, 0.45); sfx("whoosh_soft", T("manicdepressive") - 0.4, 0.45);
  };
})();
