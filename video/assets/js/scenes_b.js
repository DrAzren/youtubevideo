/* Scenes 09–16: limits of dementia praecox, Bleuler, etymology, myth, Bleuler's concept, today's understanding, 1900s care */
(function () {
  const H = HF;
  const { tl, S, at, mk, box, img, letters, words, icon, paperCard, fadeIn, popIn, fadeOut, slideIn, revealLetters, wipeIn, drawLine, drawSVG, cam, flicker, dust, lowerThird, sfx, rng, E } = H;
  const { plate, grade, text, chip, ringPulse, burst, ornament } = H;

  // ======================= S09 — weaknesses of the term =======================
  S.s09 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-paper");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    const tK = T("kelemahan");
    const term = text(f, 0, 300, 1920, "DEMENTIA PRAECOX", "h-lg", { textAlign: "center", color: "var(--ink)", fontSize: "118px", letterSpacing: ".04em" });
    fadeIn(term, sc.start + 0.3, 0.6);
    const crack = mk("div", "abs", f, `<svg width="1300" height="260" viewBox="0 0 1300 260"><path d="M40 140 L180 110 L240 160 L380 90 L470 150 L600 70 L690 170 L820 100 L900 150 L1040 80 L1120 140 L1260 110" fill="none" stroke="#7d2e3a" stroke-width="7" stroke-linejoin="bevel"/><path d="M600 70 L630 20 M690 170 L720 230 M380 90 L350 40" fill="none" stroke="#7d2e3a" stroke-width="4"/></svg>`, { left: "310px", top: "250px" });
    drawSVG(crack.querySelectorAll("path"), tK - 0.4, 0.5, 0.1);
    tl.to(term, { x: 6, duration: 0.05, yoyo: true, repeat: 5 }, tK - 0.1);
    sfx("crack", tK - 0.4, 0.8);
    const tS = T("sebab bukan");
    tl.to([term, crack], { opacity: 0, y: -80, scale: 0.8, duration: 0.6 }, tS - 0.3);

    // chart 1: age of onset is not always young
    const ch1 = box(f, 160, 150, 760, 560, "card paper", null, { borderRadius: "8px" });
    text(ch1, 40, 30, 680, "Usia penyakit bermula", "serif", { fontSize: "42px", fontWeight: "700", color: "var(--ink)" });
    const ax = box(ch1, 60, 440, 640, 3, "", null, { background: "var(--ink)", transformOrigin: "left" });
    ["Muda", "Dewasa", "Lebih tua"].forEach((l, i) => text(ch1, 40 + i * 260, 460, 220, l, "", { fontSize: "24px", fontWeight: "600", color: "rgba(43,34,24,.75)", textAlign: "center" }));
    drawLine(ax, tS, 0.6);
    const r = rng(91);
    for (let i = 0; i < 22; i++) {
      const xx = 80 + (i < 12 ? r() * 220 : 200 + r() * 420), yy = 150 + r() * 260;
      const d = box(ch1, xx, yy, 22, 22, "dot", null, { background: i < 12 ? "var(--burg)" : "var(--teal)" });
      tl.fromTo(d, { opacity: 0, scale: 0 }, { opacity: 0.9, scale: 1, duration: 0.3, ease: E.back }, tS + 0.4 + i * 0.07);
    }
    slideIn(ch1, tS - 0.3, -60, 0, 0.6);
    sfx("pops", tS + 0.4, 0.5);
    // chart 2: not everyone keeps declining
    const tF = T("kemerosotan fungsi");
    const ch2 = box(f, 1000, 150, 760, 560, "card navy", null, { borderRadius: "8px" });
    text(ch2, 40, 30, 680, "Perjalanan fungsi", "serif", { fontSize: "42px", fontWeight: "700", color: "var(--ivory)" });
    const svg = mk("div", "abs", ch2, `<svg width="700" height="380" viewBox="0 0 700 380">
      <line x1="40" y1="340" x2="680" y2="340" stroke="#e3c98f" stroke-width="2"/><line x1="40" y1="20" x2="40" y2="340" stroke="#e3c98f" stroke-width="2"/>
      <path class="p0" d="M40 120 C200 140 300 260 660 320" fill="none" stroke="#a2464f" stroke-width="5" stroke-dasharray="14 10"/>
      <path class="p1" d="M40 120 C160 220 260 240 360 160 S560 70 660 60" fill="none" stroke="#7fb3ae" stroke-width="6"/>
      <path class="p2" d="M40 120 C120 210 180 90 260 180 S380 80 460 190 S600 100 660 150" fill="none" stroke="#e3c98f" stroke-width="5"/>
      <path class="p3" d="M40 120 C200 180 320 120 660 100" fill="none" stroke="#f5eedf" stroke-width="5"/></svg>`, { left: "30px", top: "120px" });
    slideIn(ch2, tF - 0.6, 60, 0, 0.6);
    drawSVG(svg.querySelectorAll(".p0"), tF - 0.1, 1.4);
    sfx("whoosh_soft", tF - 0.6, 0.4);
    const legends = [
      { ph: "pulih dengan baik", cls: ".p1", txt: "Pulih dengan baik", c: "var(--teal2)", y: 0 },
      { ph: "relapse", cls: ".p2", txt: "Relapse · episod berulang", c: "var(--gold2)", y: 1 },
      { ph: "kehidupan yang bermakna", cls: ".p3", txt: "Kehidupan yang bermakna", c: "var(--ivory)", y: 2 },
    ];
    tl.to([ch1], { opacity: 0.35, scale: 0.96, duration: 0.6 }, T("ada yang pulih") - 0.3);
    legends.forEach((l) => {
      const t = T(l.ph) - 0.3;
      drawSVG(svg.querySelectorAll(l.cls), t, 1.3);
      const lg = text(f, 1010 + 0, 730 + l.y * 46, 760, `<span style="display:inline-block;width:34px;height:6px;background:${l.c};vertical-align:middle;margin-right:14px"></span>${l.txt}`, "", { fontSize: "30px", fontWeight: "700", color: "var(--ink)" });
      lg.style.top = (720 + l.y * 0) + "px";
      lg.style.left = (160 + l.y * 560) + "px";
      lg.style.width = "560px";
      slideIn(lg, t + 0.4, 0, 20, 0.5);
      sfx("click", t + 0.2, 0.5);
    });
  };

  // ======================= S10 — Switzerland: Eugen Bleuler, 1908 & 1911 =======================
  S.s10 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const lake = plate(b, "assets/img/07_swiss_lake.jpg", sc.start, sc.end, { scale: 1.14, x: -80 }, { scale: 1.0, x: 40 });
    grade(b, "sepia");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    // drifting mist layers over the lake
    const mist = box(b, -400, 520, 2800, 300, "", null, { background: "radial-gradient(ellipse at center, rgba(245,238,223,.35), rgba(245,238,223,0) 70%)" });
    tl.fromTo(mist, { x: -200 }, { x: 300, duration: sc.end - sc.start, ease: "none" }, sc.start);
    const tSw = T("switzerland");
    const pin = box(f, 220, 170, 560, 110, "");
    icon(pin, "pin", 0, 0, 90, "var(--burg2)");
    text(pin, 100, 14, 460, "SWITZERLAND", "serif", { fontSize: "58px", fontWeight: "800", color: "var(--ivory)", textShadow: "0 4px 18px rgba(0,0,0,.6)" });
    tl.fromTo(pin, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out" }, tSw - 0.3);
    sfx("pop", tSw - 0.1, 0.5);
    const tB = T("eugen bleuler");
    const fr = box(f, 1260, 110, 480, 600, "", null, { borderRadius: "50%", overflow: "hidden", border: "6px solid var(--gold)", boxShadow: "0 20px 50px rgba(0,0,0,.6)" });
    const pim = img(fr, "assets/img/p_bleuler.jpg", "cover", { objectPosition: "50% 30%" });
    tl.fromTo(fr, { opacity: 0, scale: 0.85, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: E.out }, tB - 0.5);
    tl.fromTo(pim, { scale: 1.25 }, { scale: 1.05, duration: 4, ease: "sine.out" }, tB - 0.5);
    lowerThird(f, "EUGEN BLEULER", "Pakar psikiatri Switzerland · 1857–1939", tB - 0.2, 3.0);
    // timeline 1908 → 1911
    const t08 = T("1908");
    tl.to([pin], { opacity: 0, duration: 0.4 }, t08 - 0.6);
    tl.to(fr, { x: 120, scale: 0.7, y: -40, duration: 0.8, ease: E.inout }, t08 - 0.6);
    const bar = box(f, 0, 0, 1920, 1080, "", null, { background: "linear-gradient(to top, rgba(8,13,26,.85), rgba(8,13,26,0) 70%)", opacity: 0 });
    tl.to(bar, { opacity: 1, duration: 0.6 }, t08 - 0.6);
    const yt = H.yearTimeline(f, 160, 560, 1000, [{ pos: 0.15, label: "1908", up: true }, { pos: 0.85, label: "1911", up: true }]);
    drawLine(yt.line, t08 - 0.5, 0.9);
    yt.ticks.forEach((k, i) => {
      const t = i === 0 ? t08 - 0.2 : T("1911") - 0.2;
      popIn(k.tick, t, 0.4, 0); fadeIn(k.lab, t + 0.05, 0.4, { y: 20 });
      sfx("tick", t, 0.6);
    });
    const c1 = text(f, 100, 680, 520, "Istilah baru diperkenalkan:", "", { fontSize: "28px", fontWeight: "500", color: "var(--parch)", textAlign: "center" });
    const c1b = text(f, 100, 720, 520, "", "serif", { fontSize: "58px", fontWeight: "800", color: "var(--gold2)", textAlign: "center", fontStyle: "italic" });
    const cl = letters(c1b, "Schizophrenie");
    fadeIn(c1, T("memperkenalkan") - 0.2, 0.5);
    revealLetters(cl, T("schizophrenia") - 0.4, { stagger: 0.04, y: 20, rx: 0 });
    sfx("accent", T("schizophrenia") - 0.3, 0.55);
    // 1911: the book opens and its pages turn
    const t11 = T("1911");
    tl.to([c1, c1b], { opacity: 0, duration: 0.4 }, t11 - 0.4);
    const bookW = box(f, 760, 200, 880, 560, "", null, { perspective: "2000px" });
    const left = box(bookW, 0, 0, 440, 560, "card paper", null, { borderRadius: "6px 0 0 6px", transformOrigin: "right center" });
    const right = box(bookW, 440, 0, 440, 560, "card paper", null, { borderRadius: "0 6px 6px 0" });
    for (let i = 0; i < 10; i++) { box(left, 50, 140 + i * 34, 300 + ((i * 37) % 60), 5, "", null, { background: "rgba(43,34,24,.4)" }); box(right, 40, 140 + i * 34, 300 + ((i * 53) % 60), 5, "", null, { background: "rgba(43,34,24,.4)" }); }
    const cover = box(bookW, 440, 0, 440, 560, "", null, { background: "linear-gradient(135deg,#5b2129,#7d2e3a)", borderRadius: "0 6px 6px 0", transformOrigin: "left center", border: "2px solid var(--gold)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "30px", boxShadow: "0 20px 40px rgba(0,0,0,.5)" });
    cover.innerHTML = `<div style="font-family:'Playfair Display';font-weight:700;font-size:38px;color:#e3c98f;line-height:1.2">Dementia Praecox oder Gruppe der Schizophrenien</div><div style="margin-top:26px;width:120px;height:2px;background:#e3c98f"></div><div style="margin-top:22px;font-family:Inter;font-weight:600;letter-spacing:.2em;font-size:22px;color:#f5eedf">E. BLEULER · 1911</div>`;
    tl.to(fr, { opacity: 0, duration: 0.4 }, t11 - 0.4);
    tl.fromTo(bookW, { opacity: 0, y: 80, rotation: -3 }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: E.out }, t11 - 0.3);
    tl.set(left, { opacity: 0 }, t11 - 0.3);
    tl.set(left, { opacity: 1 }, T("karya") - 0.1);
    tl.fromTo(cover, { rotationY: 0 }, { rotationY: -180, duration: 1.0, ease: E.inout }, T("karya") - 0.1);
    tl.set(cover, { opacity: 0 }, T("karya") + 0.4);
    sfx("book_open", T("karya") - 0.1, 0.7);
    for (let p = 0; p < 3; p++) {
      const pg = box(bookW, 440, 0, 440, 560, "card paper", null, { borderRadius: "0 6px 6px 0", transformOrigin: "left center", boxShadow: "none" });
      for (let i = 0; i < 10; i++) box(pg, 40, 140 + i * 34, 280 + ((i * 29 + p * 17) % 80), 5, "", null, { background: "rgba(43,34,24,.4)" });
      tl.set(pg, { opacity: 0 }, sc.start);
      const tp = T("menghuraikan") - 0.3 + p * 0.55;
      tl.set(pg, { opacity: 1 }, tp);
      tl.fromTo(pg, { rotationY: 0 }, { rotationY: -178, duration: 0.6, ease: "power2.inOut" }, tp);
      tl.set(pg, { opacity: 0 }, tp + 0.6);
      sfx("page", tp, 0.55);
    }
    const lbl = text(f, 760, 780, 880, "Karya penting yang menghuraikan konsep tersebut", "garamond", { fontStyle: "italic", fontSize: "38px", textAlign: "center", color: "var(--parch)" });
    fadeIn(lbl, T("menghuraikan") + 0.2, 0.6);
  };

  // ======================= S11 — etymology: schizo + phrenia =======================
  S.s11 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-navy");
    dust(b, 26, 23, sc.start, sc.end, { color: "rgba(227,201,143,.9)", op: 0.5, rise: 60, max: 4 });
    const tG = T("greek");
    const k = text(f, 0, 140, 1920, "DARIPADA BAHASA GREEK", "kicker", { textAlign: "center" });
    fadeIn(k, tG - 0.4, 0.5);
    const A = text(f, 0, 300, 1920, "", "h-xl", { textAlign: "center", color: "var(--ivory)", letterSpacing: ".04em" });
    const wa = mk("span", "", A); const wb = mk("span", "", A);
    wa.style.display = wb.style.display = "inline-block";
    const la = letters(wa, "SCHIZO"); const lb = letters(wb, "PHRENIA");
    wa.style.color = "var(--gold2)";
    revealLetters(la.concat(lb), sc.start + 0.4, { stagger: 0.04 });
    sfx("whoosh_soft", sc.start + 0.4, 0.45);
    const tS = T("schizo");
    tl.to(wa, { x: -90, duration: 0.7, ease: "power3.inOut" }, tS - 0.3);
    tl.to(wb, { x: 90, duration: 0.7, ease: "power3.inOut" }, tS - 0.3);
    const gap = box(f, 958, 280, 4, 220, "", null, { background: "var(--gold)", transformOrigin: "center" });
    drawLine(gap, tS - 0.1, 0.5, "y");
    sfx("split", tS - 0.3, 0.6);
    const g1 = box(f, 220, 540, 700, 220, "");
    text(g1, 0, 0, 700, "σχίζειν · schízein", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "48px", color: "var(--gold2)" });
    text(g1, 0, 70, 700, "memisah · membelah", "serif", { textAlign: "center", fontWeight: "700", fontSize: "56px", color: "var(--ivory)" });
    const g2 = box(f, 1000, 540, 700, 220, "");
    text(g2, 0, 0, 700, "φρήν · phrḗn", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "48px", color: "var(--gold2)" });
    text(g2, 0, 70, 700, "minda", "serif", { textAlign: "center", fontWeight: "700", fontSize: "56px", color: "var(--ivory)" });
    slideIn(g1, T("bermaksud pemisahan") - 0.2, 0, 30, 0.6);
    slideIn(g2, T("phrenia") - 0.1, 0, 30, 0.6);
    sfx("pop", T("bermaksud pemisahan"), 0.45); sfx("pop", T("phrenia") + 0.1, 0.45);
    const ic = icon(f, "split", 893, 760, 130, "var(--gold2)");
    drawSVG(ic.querySelectorAll("path"), T("phrenia") + 0.6, 0.8);
  };

  // ======================= S12 — myth: NOT a split personality =======================
  S.s12 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-navy");
    const tJ = T("jangan salah faham");
    const m1 = icon(f, "mask", 560, 210, 330, "var(--ivory)");
    const m2 = icon(f, "mask2", 1030, 210, 330, "var(--ivory)");
    tl.fromTo(m1, { opacity: 0, x: 160, rotation: 10 }, { opacity: 1, x: 0, rotation: -6, duration: 0.8, ease: E.out }, tJ - 0.2);
    tl.fromTo(m2, { opacity: 0, x: -160, rotation: -10 }, { opacity: 1, x: 0, rotation: 6, duration: 0.8, ease: E.out }, tJ - 0.2);
    const lbl = text(f, 0, 600, 1920, "“Dua personaliti”", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "70px", color: "var(--parch)" });
    fadeIn(lbl, T("dua personaliti") - 0.3, 0.5, { y: 20 });
    sfx("whoosh_soft", tJ - 0.2, 0.45);
    const tX = T("bukan bermaksud");
    const X = icon(f, "cross", 700, 130, 520, "var(--burg2)");
    X.querySelector("svg").setAttribute("stroke-width", "5");
    drawSVG(X.querySelectorAll("path"), tX, 0.35, 0.15);
    sfx("swipe", tX, 0.6); sfx("swipe", tX + 0.15, 0.5);
    const tM = T("salah faham yang terbesar");
    tl.to([m1, m2, X], { opacity: 0.25, scale: 0.85, y: -60, duration: 0.6 }, tM - 0.4);
    tl.to(lbl, { y: -120, opacity: 0.4, duration: 0.6 }, tM - 0.4);
    const st = text(f, 0, 0, 0, "MITOS", "stamp light", { left: "780px", top: "300px", fontSize: "120px" });
    tl.fromTo(st, { opacity: 0, scale: 2.4, rotation: -18 }, { opacity: 1, scale: 1, rotation: -9, duration: 0.3, ease: "power4.in" }, tM - 0.1);
    sfx("stamp", tM + 0.2, 0.85);
    const fact = box(f, 360, 560, 1200, 200, "card", null, { borderRadius: "10px", textAlign: "center" });
    fact.innerHTML = `<div style="padding-top:34px;font-family:Inter;font-weight:700;letter-spacing:.24em;font-size:22px;color:var(--teal)">FAKTA</div><div style="margin-top:12px;font-family:'Playfair Display';font-weight:700;font-size:44px;color:var(--navy)">Skizofrenia bukan “personaliti berbelah”</div>`;
    slideIn(fact, T("masih wujud") - 0.3, 0, 60, 0.7);
    sfx("chime", T("masih wujud") - 0.2, 0.4);
  };

  // ======================= S13 — Bleuler's idea: disconnection between thought, emotion, experience =======================
  S.s13 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-paper");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    const nodes = [
      { ph: "proses pemikiran", t: "Pemikiran", x: 960, y: 210 },
      { ph: "emosi dan", t: "Emosi", x: 620, y: 600 },
      { ph: "pengalaman mental", t: "Pengalaman mental", x: 1300, y: 600 },
    ];
    const svg = mk("div", "abs", f, `<svg width="1920" height="1080" viewBox="0 0 1920 1080"><path class="e e0" d="M960 300 L640 560" stroke="#9b7a3a" stroke-width="6" fill="none"/><path class="e e1" d="M960 300 L1280 560" stroke="#9b7a3a" stroke-width="6" fill="none"/><path class="e e2" d="M700 620 L1220 620" stroke="#9b7a3a" stroke-width="6" fill="none"/></svg>`, { left: 0, top: 0 });
    const nd = nodes.map((n, i) => {
      const wN = i === 2 ? 440 : 340;
      const c = box(f, n.x - wN / 2, n.y - 60, wN, 120, "card navy", null, { borderRadius: "60px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" });
      c.innerHTML = `<div style="font-family:'Playfair Display';font-weight:700;font-size:40px;color:var(--ivory)">${n.t}</div>`;
      popIn(c, T(n.ph) - 0.3, 0.5);
      sfx("pop", T(n.ph) - 0.3, 0.5);
      return c;
    });
    // headline first (narration names the disconnection before the three processes)
    const tG = T("gangguan dalam hubungan");
    const lab = text(f, 0, 760, 1920, "Gangguan dalam hubungan antara proses mental", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "44px", color: "var(--burg)" });
    fadeIn(lab, tG - 0.3, 0.6, { y: 20 });
    sfx("whoosh_soft", tG - 0.3, 0.4);
    const edges = svg.querySelectorAll(".e");
    drawSVG([edges[0]], T("emosi dan") - 0.1, 0.6);
    drawSVG([edges[1], edges[2]], T("pengalaman mental") - 0.1, 0.6, 0.15);
    // a pulse runs along each link once
    [[960, 300, 640, 560], [960, 300, 1280, 560], [700, 620, 1220, 620]].forEach(([x1, y1, x2, y2], i) => {
      const p = box(f, x1 - 9, y1 - 9, 18, 18, "dot", null, { background: "var(--gold2)", boxShadow: "0 0 18px var(--gold2)" });
      const t = (i === 0 ? T("emosi dan") : T("pengalaman mental")) + 0.4 + i * 0.1;
      tl.fromTo(p, { x: 0, y: 0, opacity: 0 }, { x: x2 - x1, y: y2 - y1, opacity: 1, duration: 0.7, ease: "sine.inOut" }, t);
      tl.to(p, { opacity: 0, duration: 0.15 }, t + 0.7);
    });
    // then the connections falter
    const tBr = T("pengalaman mental") + 1.0;
    tl.to(edges, { strokeDasharray: "18 22", stroke: "#a2464f", duration: 0.3 }, tBr);
    tl.to(edges, { opacity: 0.25, duration: 0.1, yoyo: true, repeat: 5 }, tBr + 0.3);
    tl.to(nd[1], { x: -40, duration: 0.5, ease: E.inout }, tBr + 0.2);
    tl.to(nd[2], { x: 40, duration: 0.5, ease: E.inout }, tBr + 0.2);
    sfx("glitch_soft", tBr, 0.4);
    // Bleuler's emphasised features
    const tF = T("beliau juga menekankan");
    tl.to([svg].concat(nd), { opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.05 }, tF - 0.5);
    tl.to(lab, { opacity: 0, duration: 0.4 }, tF - 0.5);
    const hdr = text(f, 0, 120, 1920, "Ciri yang ditekankan Bleuler", "h-md", { textAlign: "center", color: "var(--ink)" });
    fadeIn(hdr, tF, 0.6, { y: 20 });
    const feats = [
      { ph: "ciri gangguan pemikiran", t: "Gangguan pemikiran", ic: "thought" },
      { ph: "perubahan afek", t: "Perubahan afek", ic: "life" },
      { ph: "ambivalence", t: "Ambivalence", ic: "scale" },
      { ph: "pengalaman autistik", t: "Pengalaman autistik", ic: "person" },
    ];
    feats.forEach((ft, i) => {
      const t = T(ft.ph) - 0.2;
      const pc = paperCard(f, 110 + i * 440, 300, 400, 420, 120 + i);
      const ic = icon(pc.card, ft.ic, 130, 60, 140, "var(--burg)");
      text(pc.card, 20, 250, 360, ft.t, "serif", { textAlign: "center", fontSize: "40px", fontWeight: "700", color: "var(--ink)" });
      tl.fromTo(pc.wrap, { opacity: 0, y: 100, rotation: 8 }, { opacity: 1, y: 0, rotation: -2 + i * 1.3, duration: 0.7, ease: E.back }, t);
      drawSVG(ic.querySelectorAll("path,circle"), t + 0.25, 0.8);
      sfx("paper", t, 0.55);
    });
    const tz = T("pada zaman tu");
    const era = text(f, 0, 770, 1920, "— cara menerangkan pada zaman itu —", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "38px", color: "var(--gold3)" });
    fadeIn(era, tz - 0.6, 0.6);
  };

  // ======================= S14 — today's understanding (modern palette) =======================
  S.s14 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    // transition: parchment burns away into navy
    const navy = box(b, 0, 0, 1920, 1080, "tex-navy");
    const old = box(b, 0, 0, 1920, 1080, "tex-paper");
    const tK = T("berkembang");
    tl.fromTo(old, { clipPath: "circle(150% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)", duration: 1.6, ease: "power2.inOut" }, tK - 0.4);
    sfx("whoosh_long", tK - 0.4, 0.55);
    const grid = box(b, 0, 0, 1920, 1080, "", null, { backgroundImage: "linear-gradient(rgba(127,179,174,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(127,179,174,.08) 1px, transparent 1px)", backgroundSize: "64px 64px" });
    tl.fromTo(grid, { opacity: 0 }, { opacity: 1, duration: 1.2 }, tK);
    tl.fromTo(grid, { backgroundPosition: "0px 0px" }, { backgroundPosition: "0px 64px", duration: sc.end - tK, ease: "none" }, tK);
    // brain with a living neural network
    const tH = T("hari ni kita memahami");
    const brainW = box(f, 160, 150, 680, 620, "");
    const br = icon(brainW, "brain", 40, 20, 600, "var(--teal2)");
    br.querySelector("svg").setAttribute("stroke-width", "1.6");
    drawSVG(br.querySelectorAll("path"), tH - 0.4, 1.8, 0.1);
    sfx("pulse", tH - 0.2, 0.5);
    const r = rng(141);
    const pts = Array.from({ length: 16 }, () => [180 + r() * 340, 110 + r() * 380]);
    const lines = [];
    let svgL = "";
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d < 120) svgL += `<path d="M${pts[i][0]} ${pts[i][1]} L${pts[j][0]} ${pts[j][1]}" stroke="#7fb3ae" stroke-opacity=".55" stroke-width="2"/>`;
    }
    const net = mk("div", "abs", brainW, `<svg width="680" height="620" viewBox="0 0 680 620">${svgL}</svg>`, { left: 0, top: 0 });
    drawSVG(net.querySelectorAll("path"), tH + 0.6, 0.8, 0.03);
    pts.forEach(([x, y], i) => {
      const n = box(brainW, x - 8, y - 8, 16, 16, "dot", null, { background: "var(--gold2)", boxShadow: "0 0 14px rgba(227,201,143,.9)" });
      popIn(n, tH + 0.6 + i * 0.05, 0.3, 0);
      tl.to(n, { scale: 1.6, opacity: 0.5, duration: 0.5, yoyo: true, repeat: 9, ease: "sine.inOut" }, tH + 1.4 + r() * 1.5);
    });
    const disc = text(f, 170, 780, 680, "Ilustrasi konsep — bukan peta sebab penyakit", "", { fontSize: "20px", fontWeight: "500", color: "rgba(245,238,223,.55)", textAlign: "center", letterSpacing: ".04em" });
    fadeIn(disc, tH + 1.0, 0.6);
    // symptom categories
    const cats = [
      { ph: "halusinasi", t: "Halusinasi", ic: "ear" },
      { ph: "delusi", t: "Delusi", ic: "thought" },
      { ph: "pertuturan", t: "Pertuturan & pemikiran tidak teratur", ic: "talk" },
      { ph: "simptom negatif", t: "Simptom negatif", ic: "minus" },
    ];
    cats.forEach((c, i) => {
      const t = T(c.ph) - 0.2;
      const card = box(f, 930, 140 + i * 150, 830, 128, "card glass", null, { borderRadius: "14px" });
      const ic = icon(card, c.ic, 28, 28, 72, "var(--teal2)");
      text(card, 130, 38, 680, c.t, "", { fontSize: "38px", fontWeight: "600", color: "var(--ivory)" });
      slideIn(card, t, 80, 0, 0.55);
      drawSVG(ic.querySelectorAll("path,circle"), t + 0.2, 0.6);
      sfx("ui", t, 0.55);
    });
    const tFn = T("fungsi harian");
    const fn = box(f, 930, 760, 830, 70, "", null, { display: "flex", alignItems: "center", gap: "18px" });
    fn.innerHTML = `<div style="width:60px;height:3px;background:var(--gold)"></div><div style="font-family:Inter;font-weight:600;font-size:32px;color:var(--gold2)">Menjejaskan fungsi harian</div>`;
    slideIn(fn, tFn - 0.4, -40, 0, 0.6);
    sfx("click", tFn - 0.3, 0.5);
  };

  // ======================= S15 — imagine being a patient in the early 1900s =======================
  S.s15 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-paper");
    box(b, 0, 0, 1920, 1080, "vignette warm");
    // flip calendar to 1900
    const tA = T("awal 1900");
    const cal = box(f, 760, 160, 400, 440, "card", null, { borderRadius: "14px", overflow: "hidden" });
    box(cal, 0, 0, 400, 110, "", null, { background: "var(--burg)" });
    text(cal, 0, 30, 400, "TAHUN", "kicker", { textAlign: "center", color: "var(--ivory)", fontSize: "28px" });
    const yrs = ["2026", "1980", "1952", "1920", "1900"];
    const ys = yrs.map((y, i) => text(cal, 0, 170, 400, y, "serif", { textAlign: "center", fontSize: "140px", fontWeight: "800", color: "var(--ink)", opacity: i === 0 ? 1 : 0 }));
    popIn(cal, sc.start + 0.6, 0.6);
    sfx("whoosh_soft", sc.start + 0.6, 0.45);
    yrs.forEach((y, i) => {
      if (i === 0) return;
      const t = tA - 1.2 + i * 0.28;
      tl.to(ys[i - 1], { opacity: 0, y: -60, rotationX: 80, duration: 0.18 }, t);
      tl.fromTo(ys[i], { opacity: 0, y: 60, rotationX: -80 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.2 }, t + 0.06);
      sfx("flip", t, 0.45);
    });
    const yl = text(f, 0, 640, 1920, "AWAL 1900-AN", "kicker", { textAlign: "center", color: "var(--burg)", fontSize: "34px" });
    fadeIn(yl, tA + 0.3, 0.5);
    // medicines that did not exist yet
    const tW = T("waktu tu ubat");
    tl.to([cal, yl], { opacity: 0, scale: 0.8, y: -60, duration: 0.5 }, tW - 0.4);
    const meds = ["risperidone", "olanzapine", "haloperidol", "aripiprazole"];
    const tags = meds.map((m, i) => {
      const t = T(m) - 0.2;
      const tg = box(f, 180 + i * 400, 330, 360, 120, "", null, { borderRadius: "60px", border: "3px solid var(--navy)", background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" });
      tg.innerHTML = `<div class="icon" style="width:52px;height:52px;color:var(--teal)">${H.ICON.pill}</div><div style="font-family:Inter;font-weight:700;font-size:32px;color:var(--navy);text-transform:capitalize">${m}</div>`;
      popIn(tg, t, 0.45);
      sfx("pop", t, 0.45);
      return tg;
    });
    const tN = T("tak wujud");
    tl.to(tags, { opacity: 0.28, filter: "grayscale(1)", borderStyle: "dashed", duration: 0.5, stagger: 0.06 }, tN - 0.1);
    const st = text(f, 0, 0, 0, "BELUM WUJUD", "stamp", { left: "690px", top: "500px", fontSize: "76px" });
    tl.fromTo(st, { opacity: 0, scale: 2.2, rotation: -16 }, { opacity: 1, scale: 1, rotation: -7, duration: 0.3, ease: "power4.in" }, tN - 0.1);
    sfx("stamp", tN + 0.2, 0.8);
    // very limited options: a gauge drops
    const tL = T("pilihan rawatan");
    tl.to(tags.concat([st]), { opacity: 0, y: -40, duration: 0.5 }, tL - 0.5);
    const g = box(f, 560, 250, 800, 400, "");
    g.innerHTML = `<svg width="800" height="420" viewBox="0 0 800 420"><path d="M100 380 A300 300 0 0 1 700 380" fill="none" stroke="#d6c29c" stroke-width="34" stroke-linecap="round"/><path class="arc" d="M100 380 A300 300 0 0 1 700 380" fill="none" stroke="#7d2e3a" stroke-width="34" stroke-linecap="round"/><line class="needle" x1="400" y1="380" x2="400" y2="130" stroke="#2b2218" stroke-width="10" stroke-linecap="round"/><circle cx="400" cy="380" r="22" fill="#2b2218"/></svg>`;
    const needle = g.querySelector(".needle");
    const gl = text(f, 0, 690, 1920, "Pilihan rawatan sangat terhad", "h-sm", { textAlign: "center", color: "var(--ink)" });
    fadeIn(g, tL - 0.4, 0.4);
    tl.fromTo(needle, { rotation: 50, svgOrigin: "400 380" }, { rotation: -78, svgOrigin: "400 380", duration: 1.2, ease: "power3.inOut" }, tL - 0.2);
    const arc = g.querySelector(".arc"); const AL = arc.getTotalLength(); arc.style.strokeDasharray = AL + " " + AL;
    tl.fromTo(arc, { strokeDashoffset: AL * 0.2 }, { strokeDashoffset: AL * 0.88, duration: 1.2, ease: "power3.inOut" }, tL - 0.2);
    fadeIn(gl, tL + 0.4, 0.5);
    sfx("down", tL - 0.2, 0.5);
    // institutions: the building constructs itself from layers
    const tI = T("dekat banyak negara");
    tl.to([g, gl], { opacity: 0, duration: 0.5 }, tI - 0.4);
    const inst = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    tl.set(inst, { opacity: 1 }, tI - 0.3);
    const strips = 6;
    for (let i = 0; i < strips; i++) {
      const s = box(inst, 0, (1080 / strips) * i, 1920, 1080 / strips + 1, "", null, { overflow: "hidden" });
      const im = img(s, "assets/img/08_institution.jpg", "", { position: "absolute", left: "0", top: -(1080 / strips) * i + "px", width: "1920px", height: "1080px", objectFit: "cover" });
      tl.fromTo(s, { opacity: 0, x: i % 2 ? 220 : -220 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, tI - 0.3 + (strips - 1 - i) * 0.12);
    }
    const instCam = box(b, 0, 0, 1920, 1080, "", null, { pointerEvents: "none" });
    tl.fromTo(inst, { scale: 1.08 }, { scale: 1.0, duration: sc.end - tI, ease: "sine.out" }, tI);
    grade(inst, "sepia");
    box(inst, 0, 0, 1920, 1080, "vignette warm");
    sfx("build", tI - 0.3, 0.6);
    const il = text(f, 120, 150, 900, "Institusi psikiatri", "h-md", { color: "var(--ivory)", textShadow: "0 4px 20px rgba(0,0,0,.7)" });
    const il2 = text(f, 124, 240, 900, "Penjagaan berpanjangan", "kicker", { fontSize: "26px" });
    fadeIn(il, T("institusi psikiatri") - 0.3, 0.6, { x: -30 });
    fadeIn(il2, T("institusi psikiatri") + 0.1, 0.6, { x: -30 });
    sfx("whoosh_soft", T("institusi psikiatri") - 0.3, 0.4);
    // years pass
    const tY = T("bertahuntahun");
    const yc = box(f, 1380, 140, 400, 220, "card navy", null, { borderRadius: "12px", textAlign: "center" });
    const yn = text(yc, 0, 30, 400, "1", "serif", { fontSize: "110px", fontWeight: "800", color: "var(--gold2)", textAlign: "center" });
    text(yc, 0, 160, 400, "TAHUN", "kicker", { textAlign: "center", fontSize: "22px" });
    const c = { v: 1 };
    popIn(yc, tY - 0.5, 0.5);
    tl.to(c, { v: 12, duration: 2.0, ease: "power1.inOut", onUpdate: () => { yn.textContent = Math.round(c.v) + (c.v > 11.5 ? "+" : ""); } }, tY - 0.3);
    for (let i = 0; i < 6; i++) sfx("tick", tY - 0.3 + i * 0.33, 0.35);
    void instCam;
  };

  // ======================= S16 — care, supervision, management; methods tried =======================
  S.s16 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const w = plate(b, "assets/img/09_ward.jpg", sc.start, sc.end, { scale: 1.0, x: 30 }, { scale: 1.1, x: -60 });
    grade(b, "sepia");
    // light rays through the tall windows
    const rays = box(b, 0, 0, 1920, 1080, "", null, { background: "repeating-linear-gradient(115deg, rgba(255,235,190,0) 0 80px, rgba(255,235,190,.14) 80px 140px, rgba(255,235,190,0) 140px 260px)", mixBlendMode: "screen" });
    tl.fromTo(rays, { x: -120, opacity: 0.4 }, { x: 120, opacity: 0.9, duration: sc.end - sc.start, ease: "sine.inOut" }, sc.start);
    dust(b, 30, 161, sc.start, sc.end, { op: 0.6, rise: 50, dx: 80 });
    box(b, 0, 0, 1920, 1080, "shade-l");
    const items = [
      { ph: "kepada penjagaan", t: "Penjagaan", ic: "house" },
      { ph: "pengawasan", t: "Pengawasan", ic: "eye" },
      { ph: "pengurusan tingkah", t: "Pengurusan tingkah laku", ic: "person" },
    ];
    items.forEach((it, i) => {
      const t = T(it.ph) - 0.2;
      const c = chip(f, 130, 200 + i * 150, it.ic, it.t, { w: 620, cls: "", ic: "var(--burg)" });
      c.c.style.borderRadius = "10px";
      slideIn(c.c, t, -80, 0, 0.6);
      drawSVG(c.ic.querySelectorAll("path,circle"), t + 0.2, 0.6);
      sfx("card", t, 0.5);
    });
    // methods tried: two outcomes
    const tP = T("pelbagai kaedah");
    tl.to(f.querySelectorAll(".chip"), { opacity: 0, x: -60, duration: 0.5, stagger: 0.06 }, tP - 0.6);
    const panel = box(f, 110, 150, 1000, 640, "card navy", null, { borderRadius: "14px" });
    text(panel, 50, 40, 900, "Pelbagai kaedah rawatan dicuba", "serif", { fontSize: "48px", fontWeight: "700", color: "var(--ivory)" });
    slideIn(panel, tP - 0.3, -60, 0, 0.6);
    sfx("whoosh_soft", tP - 0.3, 0.45);
    const flasks = box(panel, 50, 140, 900, 140, "");
    for (let i = 0; i < 6; i++) {
      const fl = icon(flasks, ["flask", "pill", "scroll", "flask", "syringe", "pill"][i], i * 150, 10, 110, "var(--parch)");
      popIn(fl, tP + 0.3 + i * 0.15, 0.4, 0);
    }
    sfx("pops", tP + 0.3, 0.45);
    const okT = T("terbukti bermanfaat") - 0.2;
    const ok = box(panel, 50, 320, 900, 130, "", null, { display: "flex", alignItems: "center", gap: "26px", borderTop: "1px solid rgba(201,164,92,.35)", paddingTop: "20px" });
    ok.innerHTML = `<div class="icon" style="width:84px;height:84px;color:var(--teal2)">${H.ICON.tick}</div><div><div style="font-family:Inter;font-weight:700;font-size:36px;color:var(--ivory)">Terbukti bermanfaat</div><div style="font-family:Inter;font-weight:500;font-size:26px;color:var(--teal2)">untuk keadaan tertentu</div></div>`;
    slideIn(ok, okT, 40, 0, 0.5);
    sfx("chime", okT + 0.1, 0.35);
    const noT = T("ditinggalkan") - 0.2;
    const no = box(panel, 50, 470, 900, 130, "", null, { display: "flex", alignItems: "center", gap: "26px", borderTop: "1px solid rgba(201,164,92,.35)", paddingTop: "20px" });
    no.innerHTML = `<div class="icon" style="width:84px;height:84px;color:var(--burg2)">${H.ICON.cross}</div><div><div style="font-family:Inter;font-weight:700;font-size:36px;color:var(--ivory)">Ditinggalkan</div><div style="font-family:Inter;font-weight:500;font-size:26px;color:#e07a80">kerana risiko atau kesan buruk</div></div>`;
    slideIn(no, noT, 40, 0, 0.5);
    sfx("thud", noT + 0.1, 0.45);
    void w;
  };
})();
