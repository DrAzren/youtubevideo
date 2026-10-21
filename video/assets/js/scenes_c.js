/* Scenes 17–24: 1952 chlorpromazine, first & second generation, side effects, long-acting injections, recovery, book, close */
(function () {
  const H = HF;
  const { tl, S, at, mk, box, img, letters, words, icon, fadeIn, popIn, fadeOut, slideIn, revealLetters, drawLine, drawSVG, cam, flicker, dust, sfx, rng, E } = H;
  const { plate, grade, text, chip, ringPulse, burst, ornament } = H;

  function modernBg(b, sc, seed) {
    box(b, 0, 0, 1920, 1080, "tex-navy");
    const grid = box(b, 0, 0, 1920, 1080, "", null, { backgroundImage: "linear-gradient(rgba(127,179,174,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(127,179,174,.07) 1px, transparent 1px)", backgroundSize: "64px 64px" });
    tl.fromTo(grid, { backgroundPosition: "0px 0px" }, { backgroundPosition: "64px 0px", duration: sc.end - sc.start, ease: "none" }, sc.start);
    dust(b, 18, seed, sc.start, sc.end, { color: "rgba(127,179,174,.9)", op: 0.45, rise: 50, max: 4 });
    box(b, 0, 0, 1920, 1080, "vignette");
  }
  function drugCard(parent, x, y, name, sub, t, opts = {}) {
    const c = box(parent, x, y, opts.w || 380, opts.h || 150, "card glass", null, { borderRadius: "14px", border: opts.hl ? "3px solid var(--gold)" : "1px solid rgba(127,179,174,.45)" });
    const ic = icon(c, "pill", 24, 36, 76, opts.hl ? "var(--gold2)" : "var(--teal2)");
    text(c, 118, sub ? 34 : 52, (opts.w || 380) - 130, name, "", { fontSize: opts.fs || "34px", fontWeight: "700", color: "var(--ivory)", textTransform: "capitalize" });
    if (sub) text(c, 118, 86, (opts.w || 380) - 130, sub, "", { fontSize: "22px", fontWeight: "500", color: opts.hl ? "var(--gold2)" : "var(--teal2)", lineHeight: "1.2" });
    popIn(c, t, 0.5, 0.7);
    sfx("ui", t, 0.5);
    return c;
  }

  // ======================= S17 — 1952: chlorpromazine =======================
  S.s17 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    modernBg(b, sc, 171);
    const t52 = T("1952");
    // timeline arrow racing to the turning point
    const tk = text(f, 0, 200, 1920, "TITIK PERUBAHAN BESAR", "kicker", { textAlign: "center", fontSize: "30px" });
    fadeIn(tk, T("titik perubahan") - 0.3, 0.6);
    const ln = box(f, 160, 560, 1600, 3, "rule");
    drawLine(ln, sc.start + 0.4, 2.0);
    const big = text(f, 0, 280, 1920, "", "h-xl", { textAlign: "center", fontSize: "230px", color: "var(--ivory)", letterSpacing: ".04em" });
    const L = letters(big, "1952");
    tl.fromTo(L, { opacity: 0, scale: 3, filter: "blur(16px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power4.in", stagger: 0.07 }, t52 - 0.45);
    const sh = box(f, 0, 0, 1920, 1080, "", null, { background: "radial-gradient(circle at 50% 42%, rgba(227,201,143,.45), rgba(227,201,143,0) 60%)", opacity: 0 });
    tl.to(sh, { opacity: 1, duration: 0.1 }, t52 + 0.1).to(sh, { opacity: 0, duration: 1.2 }, t52 + 0.2);
    tl.to(f, { x: 8, duration: 0.05, yoyo: true, repeat: 5 }, t52 + 0.1);
    burst(f, 960, 420, t52 + 0.1, "var(--gold2)", 16, 52);
    sfx("boom", t52 + 0.05, 0.9);
    // the lab and the molecule
    const tC = T("chlorpromazine");
    tl.to([big, tk, ln], { opacity: 0, y: -60, duration: 0.5 }, tC - 1.1);
    const lab = box(b, 0, 0, 1920, 1080, "", null, { overflow: "hidden", opacity: 0 });
    const li = box(lab, 0, 0, 1920, 1080, "");
    img(li, "assets/img/10_lab1952.jpg", "plate");
    tl.to(lab, { opacity: 1, duration: 0.8 }, tC - 1.0);
    cam(li, tC - 1.0, sc.end, { scale: 1.1, x: -40 }, { scale: 1.0, x: 40 });
    box(lab, 0, 0, 1920, 1080, "shade-l");
    const mol = box(f, 110, 160, 760, 460, "");
    // chlorpromazine: phenothiazine core (S, N), Cl on ring, N-propyl-dimethylamine side chain
    mol.innerHTML = `<svg width="760" height="460" viewBox="0 0 760 460" fill="none" stroke="#e3c98f" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <path class="m" d="M120 150 L180 115 L240 150 L240 220 L180 255 L120 220 Z"/>
      <path class="m" d="M135 160 L180 134 M225 162 L225 210 M135 210 L180 236" stroke-width="3"/>
      <path class="m" d="M240 150 L300 115 L360 150 M240 220 L300 255 L360 220"/>
      <path class="m" d="M360 150 L420 115 L480 150 L480 220 L420 255 L360 220 Z"/>
      <path class="m" d="M375 160 L420 134 M465 162 L465 210 M375 210 L420 236" stroke-width="3"/>
      <path class="m" d="M480 220 L540 255"/>
      <path class="m" d="M300 255 L300 315 L355 350 L355 410 L410 440"/>
      <path class="m" d="M410 440 L465 410 M410 440 L410 460"/>
    </svg>
    <div style="position:absolute;left:284px;top:82px;font-family:Inter;font-weight:700;font-size:34px;color:#f5eedf">S</div>
    <div style="position:absolute;left:284px;top:246px;font-family:Inter;font-weight:700;font-size:34px;color:#f5eedf">N</div>
    <div style="position:absolute;left:540px;top:244px;font-family:Inter;font-weight:700;font-size:30px;color:#7fb3ae">Cl</div>
    <div style="position:absolute;left:396px;top:418px;font-family:Inter;font-weight:700;font-size:30px;color:#f5eedf">N</div>
    <div style="position:absolute;left:470px;top:390px;font-family:Inter;font-weight:600;font-size:22px;color:#f5eedf">CH₃</div>
    <div style="position:absolute;left:340px;top:440px;font-family:Inter;font-weight:600;font-size:22px;color:#f5eedf">CH₃</div>`;
    drawSVG(mol.querySelectorAll(".m"), tC - 0.6, 0.9, 0.12);
    tl.fromTo(mol.querySelectorAll("div"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.1 }, tC + 0.4);
    sfx("draw", tC - 0.6, 0.45);
    const nm = text(f, 120, 640, 800, "", "h-md", { color: "var(--ivory)" });
    revealLetters(letters(nm, "Chlorpromazine"), tC - 0.1, { stagger: 0.035, y: 20, rx: 0 });
    const nm2 = text(f, 124, 726, 800, "Mula digunakan dalam rawatan klinikal", "kicker", { fontSize: "22px" });
    fadeIn(nm2, T("rawatan klinikal") - 0.3, 0.5);
    sfx("accent", tC - 0.1, 0.5);
    // not originally made for schizophrenia
    const tO = T("bukanlah dihasilkan");
    const note = box(f, 1060, 170, 720, 210, "card", null, { borderRadius: "12px" });
    note.innerHTML = `<div style="padding:34px 40px"><div style="font-family:Inter;font-weight:700;letter-spacing:.22em;font-size:20px;color:var(--burg)">FAKTA MENARIK</div><div style="margin-top:12px;font-family:'Playfair Display';font-weight:700;font-size:38px;line-height:1.2;color:var(--navy)">Asalnya tidak dibangunkan khusus untuk skizofrenia</div></div>`;
    slideIn(note, tO - 0.3, 80, 0, 0.6);
    sfx("card", tO - 0.3, 0.5);
    // symptoms reduced for some patients (conceptual bars)
    const tSy = T("simptom macam");
    tl.to([mol, nm, nm2, note], { opacity: 0, duration: 0.5 }, tSy - 0.6);
    tl.to(lab, { opacity: 0.25, duration: 0.6 }, tSy - 0.6);
    const chart = box(f, 300, 180, 1320, 560, "card glass", null, { borderRadius: "16px" });
    text(chart, 50, 34, 1200, "Simptom boleh berkurang — pada sebahagian pesakit", "serif", { fontSize: "44px", fontWeight: "700", color: "var(--ivory)" });
    slideIn(chart, tSy - 0.4, 0, 40, 0.6);
    [["kegelisahan", "Kegelisahan teruk"], ["halusinasi", "Halusinasi"], ["delusi", "Delusi"]].forEach(([ph, lbl], i) => {
      const t = T(ph) - 0.1;
      const row = box(chart, 50, 150 + i * 120, 1220, 100, "");
      text(row, 0, 28, 380, lbl, "", { fontSize: "32px", fontWeight: "600", color: "var(--ivory)" });
      const bar = box(row, 400, 24, 780, 52, "", null, { background: "linear-gradient(90deg, var(--burg2), #c8737a)", borderRadius: "26px", transformOrigin: "left center" });
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: E.out }, t);
      tl.to(bar, { scaleX: 0.42, background: "linear-gradient(90deg, var(--teal), var(--teal2))", duration: 1.1, ease: E.inout }, T("boleh berkurang") - 0.1 + i * 0.15);
      sfx("ui", t, 0.4);
    });
    sfx("down", T("boleh berkurang") - 0.1, 0.45);
    const conc = text(chart, 50, 500, 1220, "Konsep visual — bukan data sebenar", "", { fontSize: "18px", color: "rgba(245,238,223,.5)", letterSpacing: ".04em" });
    fadeIn(conc, T("boleh berkurang"), 0.5);
    // a first in medicine
    const tP = T("buat pertama kalinya");
    tl.to(chart, { opacity: 0, scale: 0.94, duration: 0.5 }, tP - 0.5);
    const ban = box(f, 260, 330, 1400, 300, "", null, { textAlign: "center" });
    ban.innerHTML = `<div class="kicker" style="font-size:28px">BUAT PERTAMA KALINYA</div><div style="margin-top:22px;font-family:'Playfair Display';font-weight:700;font-size:66px;line-height:1.15;color:var(--ivory)">Ubat yang berkesan untuk merawat banyak simptom <span style="color:var(--gold2)">psikosis</span></div>`;
    fadeIn(ban, tP - 0.2, 0.8, { y: 30 });
    ornament(f, 610, 700, 700, tP + 0.5);
    sfx("shimmer", tP, 0.45);
  };

  // ======================= S18 — first generation & side effects; risk vs benefit =======================
  S.s18 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    modernBg(b, sc, 181);
    const tG = T("generasi pertama");
    const band = box(f, 120, 150, 1680, 260, "", null, { borderLeft: "6px solid var(--gold)", paddingLeft: "30px" });
    const bl = text(band, 30, 0, 1600, "ANTIPSIKOTIK GENERASI PERTAMA", "kicker", { fontSize: "28px" });
    fadeIn(bl, sc.start + 0.5, 0.5, { x: -20 });
    tl.fromTo(band, { borderLeftColor: "rgba(201,164,92,0)" }, { borderLeftColor: "rgba(201,164,92,1)", duration: 0.4 }, sc.start + 0.4);
    drugCard(band, 30, 70, "Chlorpromazine", "1952", sc.start + 0.9, { w: 440 });
    drugCard(band, 500, 70, "Haloperidol", "Akhir 1950-an", T("haloperidol") - 0.2, { w: 440 });
    drugCard(band, 970, 70, "Lain-lain", "Pelbagai ubat generasi pertama", tG - 0.2, { w: 560 });
    // side effects
    const tK = T("kesan sampingan");
    tl.to(band, { y: -40, opacity: 0.35, scale: 0.92, transformOrigin: "left top", duration: 0.6 }, tK - 0.5);
    const se = [
      { ph: "otot jadi kaku", t: "Otot jadi kaku", ic: "stiff", anim: (el, t) => tl.to(el, { scaleX: 0.92, duration: 0.25, yoyo: true, repeat: 3 }, t + 0.6) },
      { ph: "menggeletar", t: "Tangan menggeletar", ic: "tremor", anim: (el, t) => tl.to(el, { x: 5, duration: 0.05, yoyo: true, repeat: 19, ease: "none" }, t + 0.5) },
      { ph: "rasa gelisah", t: "Gelisah, tak boleh duduk diam", ic: "restless", anim: (el, t) => tl.to(el, { y: -10, duration: 0.18, yoyo: true, repeat: 9, ease: "sine.inOut" }, t + 0.5) },
    ];
    se.forEach((s, i) => {
      const t = T(s.ph) - 0.3;
      const c = box(f, 140 + i * 560, 380, 520, 360, "card", null, { borderRadius: "14px" });
      const ic = icon(c, s.ic, 190, 40, 140, "var(--burg)");
      text(c, 30, 220, 460, s.t, "serif", { textAlign: "center", fontSize: "38px", fontWeight: "700", color: "var(--navy)", lineHeight: "1.15" });
      slideIn(c, t, 0, 60, 0.6);
      drawSVG(ic.querySelectorAll("path,circle,rect"), t + 0.2, 0.6);
      s.anim(ic, t);
      sfx("card", t, 0.5);
    });
    // balance: risk vs benefit
    const tB = T("keseimbangan");
    tl.to(f.querySelectorAll(".card"), { opacity: 0, y: 40, duration: 0.5, stagger: 0.04 }, tB - 1.2);
    const scl = box(f, 560, 190, 800, 520, "");
    scl.innerHTML = `<svg width="800" height="520" viewBox="0 0 800 520" fill="none" stroke="#e3c98f" stroke-width="6" stroke-linecap="round">
      <path d="M400 70 L400 470 M300 470 L500 470"/>
      <g class="beam"><path d="M140 110 L660 110"/><path d="M140 110 L90 250 M140 110 L190 250 M80 250 L200 250"/><path d="M660 110 L610 250 M660 110 L710 250 M600 250 L720 250"/></g>
      <circle cx="400" cy="70" r="16" fill="#e3c98f"/></svg>
      <div class="lr" style="position:absolute;left:40px;top:270px;width:200px;text-align:center;font-family:Inter;font-weight:700;font-size:34px;color:#e07a80">Risiko</div>
      <div class="lb" style="position:absolute;left:560px;top:270px;width:200px;text-align:center;font-family:Inter;font-weight:700;font-size:34px;color:#7fb3ae">Manfaat</div>`;
    const beam = scl.querySelector(".beam"); gsap.set(beam, { svgOrigin: "400 110" });
    const lr = scl.querySelector(".lr"), lb = scl.querySelector(".lb");
    fadeIn(scl, tB - 0.8, 0.5);
    tl.fromTo(beam, { rotation: -14 }, { rotation: 10, duration: 0.9, ease: "sine.inOut" }, tB - 0.6)
      .to(beam, { rotation: -5, duration: 0.8, ease: "sine.inOut" }, tB + 0.3)
      .to(beam, { rotation: 0, duration: 0.8, ease: "elastic.out(1,0.5)" }, tB + 1.1);
    tl.fromTo(lr, { y: -60 }, { y: 30, duration: 0.9, ease: "sine.inOut" }, tB - 0.6).to(lr, { y: 0, duration: 1.6, ease: "elastic.out(1,0.5)" }, tB + 0.3);
    tl.fromTo(lb, { y: 60 }, { y: -40, duration: 0.9, ease: "sine.inOut" }, tB - 0.6).to(lb, { y: 0, duration: 1.6, ease: "elastic.out(1,0.5)" }, tB + 0.3);
    sfx("scale", tB - 0.6, 0.5);
    const cap = text(f, 0, 740, 1920, "Doktor menimbang risiko & manfaat bagi setiap pesakit", "garamond", { textAlign: "center", fontStyle: "italic", fontSize: "40px", color: "var(--parch)" });
    fadeIn(cap, T("risk and benefit") - 0.3, 0.6);
  };

  // ======================= S19 — second generation; clozapine =======================
  S.s19 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    modernBg(b, sc, 191);
    const tG = T("generasi kedua");
    const hd = text(f, 120, 140, 1680, "ANTIPSIKOTIK GENERASI KEDUA", "kicker", { fontSize: "30px", color: "var(--teal2)" });
    fadeIn(hd, tG - 0.4, 0.5, { x: -20 });
    const rs = text(f, 120, 186, 1680, "Penyelidikan semakin meluas", "h-sm", { color: "var(--ivory)" });
    fadeIn(rs, T("research") - 0.2, 0.6, { x: -20 });
    sfx("whoosh_soft", T("research") - 0.2, 0.45);
    ["risperidone", "olanzapine", "quetiapine", "aripiprazole"].forEach((m, i) => drugCard(f, 120 + i * 425, 310, m, "", T(m) - 0.2, { w: 395, h: 130, fs: "32px" }));
    const tCz = T("clozapine");
    const cz = drugCard(f, 120, 480, "Clozapine", "Peranan penting: skizofrenia rintang rawatan (treatment-resistant)", tCz - 0.2, { w: 1120, h: 170, hl: true, fs: "44px" });
    const glow = box(f, 60, 430, 1240, 270, "", null, { borderRadius: "20px", boxShadow: "0 0 60px rgba(227,201,143,.55)", opacity: 0 });
    tl.to(glow, { opacity: 1, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, tCz + 0.3);
    sfx("accent", tCz - 0.2, 0.5);
    // not always better
    const tN = T("bukan bermaksud semua");
    tl.to(f.querySelectorAll(".card"), { opacity: 0.18, duration: 0.5 }, tN - 0.3);
    tl.to(glow, { opacity: 0, duration: 0.3 }, tN - 0.3);
    const nb = box(f, 1290, 470, 520, 220, "card", null, { borderRadius: "14px", textAlign: "center" });
    nb.innerHTML = `<div style="padding-top:34px;font-family:'Playfair Display';font-weight:700;font-size:40px;line-height:1.2;color:var(--navy)">Generasi baru ≠ sentiasa lebih baik</div>`;
    slideIn(nb, tN - 0.1, 60, 0, 0.6);
    sfx("card", tN - 0.1, 0.5);
    const tP = T("ada kelebihan");
    const pm = box(f, 330, 740, 1260, 90, "", null, { display: "flex", justifyContent: "center", gap: "120px", alignItems: "center" });
    pm.innerHTML = `<div style="display:flex;align-items:center;gap:16px"><div class="icon" style="width:64px;height:64px;color:var(--teal2)">${H.ICON.plus}</div><div style="font-family:Inter;font-weight:700;font-size:36px;color:var(--ivory)">Kelebihan</div></div><div style="display:flex;align-items:center;gap:16px"><div class="icon" style="width:64px;height:64px;color:#e07a80">${H.ICON.minus}</div><div style="font-family:Inter;font-weight:700;font-size:36px;color:var(--ivory)">Kekurangan</div></div>`;
    const [p1, p2] = pm.children;
    tl.set(pm, { opacity: 1 }, sc.start);
    popIn(p1, tP - 0.2, 0.4); popIn(p2, T("kekurangan") - 0.2, 0.4);
    sfx("pop", tP - 0.2, 0.45); sfx("pop", T("kekurangan") - 0.2, 0.45);
  };

  // ======================= S20 — side-effect profiles; individualised choice =======================
  S.s20 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    modernBg(b, sc, 201);
    const se = [
      { ph: "kenaikan berat", t: "Kenaikan berat badan", ic: "weight" },
      { ph: "masalah metabolik", t: "Masalah metabolik", ic: "drop" },
      { ph: "pergerakan jadi", t: "Pergerakan abnormal", ic: "move" },
      { ph: "hormon prolaktin", t: "Hormon prolaktin meningkat", ic: "hormone" },
    ];
    const hd = text(f, 0, 120, 1920, "KESAN SAMPINGAN YANG MUNGKIN", "kicker", { textAlign: "center", fontSize: "28px" });
    fadeIn(hd, sc.start + 0.4, 0.5);
    se.forEach((s, i) => {
      const t = T(s.ph) - 0.3;
      const c = box(f, 130 + i * 425, 220, 390, 380, "card glass", null, { borderRadius: "16px" });
      const ic = icon(c, s.ic, 120, 50, 150, "var(--teal2)");
      text(c, 24, 240, 342, s.t, "", { textAlign: "center", fontSize: "32px", fontWeight: "700", color: "var(--ivory)", lineHeight: "1.2" });
      slideIn(c, t, 0, 70, 0.6);
      drawSVG(ic.querySelectorAll("path,circle"), t + 0.2, 0.7);
      tl.to(ic, { scale: 1.08, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, t + 0.9);
      sfx("ui", t, 0.5);
    });
    // choose by the patient's condition
    const tP = T("pemilihan ubat");
    tl.to(f.querySelectorAll(".card"), { opacity: 0, y: -40, duration: 0.5, stagger: 0.05 }, tP - 0.4);
    tl.to(hd, { opacity: 0, duration: 0.4 }, tP - 0.4);
    const prof = box(f, 260, 230, 560, 480, "card", null, { borderRadius: "16px" });
    icon(prof, "person", 200, 40, 160, "var(--navy)");
    ["Simptom", "Sejarah kesihatan", "Kesan sampingan", "Pilihan pesakit"].forEach((l, i) => {
      const r = box(prof, 60, 230 + i * 56, 440, 44, "", null, { display: "flex", alignItems: "center", gap: "14px" });
      r.innerHTML = `<div class="icon" style="width:36px;height:36px;color:var(--teal)">${H.ICON.tick}</div><div style="font-family:Inter;font-weight:600;font-size:28px;color:var(--ink)">${l}</div>`;
      slideIn(r, tP + 0.3 + i * 0.25, -30, 0, 0.4);
      sfx("click", tP + 0.3 + i * 0.25, 0.4);
    });
    slideIn(prof, tP - 0.2, -60, 0, 0.6);
    const conn = box(f, 840, 468, 300, 4, "rule");
    drawLine(conn, tP + 1.4, 0.6);
    const rx = drugCard(f, 1160, 380, "Ubat yang sesuai", "Dipilih mengikut keadaan pesakit", T("berdasarkan keadaan") - 0.1, { w: 560, h: 170 });
    void rx;
  };

  // ======================= S21 — long-acting injectable antipsychotics =======================
  S.s21 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    modernBg(b, sc, 211);
    const tI = T("suntikan");
    const sy = icon(f, "syringe", 200, 220, 300, "var(--teal2)");
    drawSVG(sy.querySelectorAll("path"), tI - 0.5, 0.9);
    const t1 = text(f, 140, 560, 700, "Antipsikotik suntikan jangka panjang", "h-sm", { color: "var(--ivory)", textAlign: "center" });
    fadeIn(t1, tI - 0.1, 0.6, { y: 20 });
    sfx("draw", tI - 0.5, 0.4);
    // calendar: doses spaced weeks apart
    const tW = T("beberapa minggu");
    const cal = box(f, 940, 170, 820, 560, "card", null, { borderRadius: "16px" });
    box(cal, 0, 0, 820, 90, "", null, { background: "var(--navy3)", borderRadius: "16px 16px 0 0" });
    text(cal, 0, 26, 820, "KALENDAR RAWATAN", "kicker", { textAlign: "center", fontSize: "24px", color: "var(--ivory)" });
    slideIn(cal, tW - 1.0, 60, 0, 0.6);
    const cells = [];
    for (let i = 0; i < 28; i++) {
      const cx = 40 + (i % 7) * 108, cy = 120 + Math.floor(i / 7) * 104;
      const c = box(cal, cx, cy, 92, 88, "", null, { borderRadius: "10px", background: "rgba(19,35,63,.07)", border: "1px solid rgba(19,35,63,.12)" });
      cells.push(c);
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tW - 0.8 + i * 0.015);
    }
    [0, 14, 27].forEach((i, k) => {
      const d = box(cells[i], 18, 16, 56, 56, "dot", null, { background: "var(--teal)" });
      popIn(d, tW + 0.2 + k * 0.5, 0.4, 0);
      sfx("pop", tW + 0.2 + k * 0.5, 0.45);
    });
    const lg = text(cal, 40, 522, 740, "Dos diberi setiap beberapa minggu", "", { fontSize: "24px", fontWeight: "600", color: "var(--navy)", textAlign: "center" });
    fadeIn(lg, tW + 0.4, 0.5);
    const tL = T("tahan lama");
    const ll = box(f, 940, 760, 820, 70, "", null, { display: "flex", alignItems: "center", gap: "18px" });
    ll.innerHTML = `<div class="icon" style="width:52px;height:52px;color:var(--gold2)">${H.ICON.shield}</div><div style="font-family:Inter;font-weight:600;font-size:32px;color:var(--gold2)">Formulasi & rejim yang tahan lebih lama</div>`;
    slideIn(ll, T("ada formulasi") - 0.2, 40, 0, 0.6);
    tl.to(ll, { scale: 1.05, duration: 0.4, yoyo: true, repeat: 1 }, tL - 0.2);
    sfx("chime", tL - 0.2, 0.35);
  };

  // ======================= S22 — holistic recovery =======================
  S.s22 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    const cp = plate(b, "assets/img/11_consult.jpg", sc.start, PLAN.videos.v3.start + 0.6, { scale: 1.12, x: 60 }, { scale: 1.0, x: -40 });
    box(b, 0, 0, 1920, 1080, "", null, { background: "linear-gradient(90deg, rgba(11,22,41,.9) 0%, rgba(11,22,41,.55) 50%, rgba(11,22,41,.1) 100%)" });
    const tB = T("bukanlah bergantung");
    const h1 = text(f, 110, 130, 900, "Rawatan bukan sekadar ubat", "h-md", { color: "var(--ivory)" });
    fadeIn(h1, tB - 0.6, 0.7, { x: -30 });
    sfx("whoosh_soft", tB - 0.6, 0.45);
    // recovery wheel
    const cx = 560, cy = 560, R = 210;
    const hub = box(f, cx - 105, cy - 105, 210, 210, "dot", null, { background: "rgba(14,26,48,.9)", border: "3px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" });
    hub.innerHTML = `<div style="font-family:'Playfair Display';font-weight:700;font-size:40px;color:var(--gold2);line-height:1.1">Pemulihan</div>`;
    popIn(hub, T("pesakit mungkin") - 0.3, 0.6, 0.4);
    sfx("accent", T("pesakit mungkin") - 0.3, 0.45);
    const ring = mk("div", "abs", f, `<svg width="700" height="700" viewBox="0 0 700 700"><circle cx="350" cy="350" r="${R}" fill="none" stroke="#7fb3ae" stroke-width="2" stroke-dasharray="6 10"/></svg>`, { left: cx - 350 + "px", top: cy - 350 + "px" });
    tl.fromTo(ring, { opacity: 0, rotation: -40 }, { opacity: 1, rotation: 0, duration: 1.2, ease: E.out }, T("pesakit mungkin") - 0.2);
    tl.to(ring, { rotation: 30, duration: 14, ease: "none" }, T("pesakit mungkin") + 1);
    const nodes = [
      { ph: "psikoterapi", t: "Psikoterapi", ic: "talk" },
      { ph: "psikoedukasi", t: "Psikoedukasi", ic: "book" },
      { ph: "sokongan keluarga", t: "Sokongan keluarga", ic: "family" },
      { ph: "pemulihan psikososial", t: "Pemulihan psikososial", ic: "network" },
      { ph: "kembali bekerja", t: "Kembali bekerja & belajar", ic: "work" },
    ];
    nodes.forEach((n, i) => {
      const a = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const t = T(n.ph) - 0.2;
      const nd = box(f, x - 60, y - 60, 120, 120, "dot", null, { background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.4)" });
      const ic = mk("div", "icon", nd, H.ICON[n.ic], { width: "64px", height: "64px", color: "var(--navy)" });
      const lbx = Math.cos(a) > 0.3 ? x + 74 : Math.cos(a) < -0.3 ? x - 334 : x - 130;
      const lby = Math.sin(a) < -0.5 ? y - 110 : y + (Math.sin(a) > 0.5 ? 70 : -18);
      const lb = text(f, lbx, lby, 260, n.t, "", { fontSize: "27px", fontWeight: "700", color: "var(--ivory)", textAlign: Math.cos(a) < -0.3 ? "right" : Math.cos(a) > 0.3 ? "left" : "center", textShadow: "0 2px 10px rgba(0,0,0,.8)" });
      popIn(nd, t, 0.5, 0.3);
      fadeIn(lb, t + 0.15, 0.4);
      const spoke = mk("div", "abs", f, `<svg width="1920" height="1080"><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e3c98f" stroke-width="2" stroke-opacity=".6"/></svg>`, { left: 0, top: 0, zIndex: 0 });
      f.insertBefore(spoke, f.firstChild);
      drawSVG(spoke.querySelectorAll("line"), t - 0.1, 0.4);
      sfx("ui", t, 0.5);
      void ic;
    });
    // goal: function & quality of life (video: walking back into life)
    const v3 = PLAN.videos.v3;
    tl.to(f.children, { opacity: 0, duration: 0.6 }, v3.start + 0.1);
    const goal = box(f, 110, 140, 900, 300, "", null, { opacity: 0 });
    f.appendChild(goal);
    goal.innerHTML = `<div class="kicker" style="font-size:26px">MATLAMAT</div><div class="gl1" style="margin-top:14px;font-family:'Playfair Display';font-weight:700;font-size:64px;color:var(--ivory);text-shadow:0 4px 24px rgba(0,0,0,.6)">Kembali berfungsi</div><div class="gl2" style="margin-top:6px;font-family:'Playfair Display';font-weight:700;font-size:64px;color:var(--gold2);text-shadow:0 4px 24px rgba(0,0,0,.6)">&amp; kualiti kehidupan</div>`;
    const sh = box(f, 0, 0, 1100, 1080, "", null, { background: "linear-gradient(90deg, rgba(11,22,41,.75), rgba(11,22,41,0))", opacity: 0 });
    f.insertBefore(sh, goal);
    tl.to(sh, { opacity: 1, duration: 0.8 }, v3.start + 0.6);
    tl.to(goal, { opacity: 1, duration: 0.01 }, v3.start + 0.7);
    fadeIn(goal.children[0], T("matlamat") + 0.2, 0.5, { x: -20 });
    fadeIn(goal.querySelector(".gl1"), T("kembali berfungsi") - 0.2, 0.6, { x: -30 });
    fadeIn(goal.querySelector(".gl2"), T("kualiti kehidupan") - 0.2, 0.6, { x: -30 });
    sfx("shimmer", T("kualiti kehidupan") - 0.2, 0.4);
    void cp;
  };

  // ======================= S23 — the book =======================
  S.s23 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-navy");
    const gl = box(b, 210, 80, 800, 900, "glow", null, { background: "radial-gradient(circle, rgba(227,201,143,.55), rgba(227,201,143,0) 65%)", opacity: 0 });
    tl.to(gl, { opacity: 1, duration: 1.6, ease: "sine.inOut" }, sc.start + 0.2);
    dust(b, 34, 231, sc.start, sc.end + 20, { color: "rgba(227,201,143,.95)", op: 0.6, rise: 80, max: 4 });
    sfx("riser", sc.start, 0.45);
    // 3D book built from the real cover, spine and back cover
    const stage = box(f, 0, 0, 1920, 1080, "book-stage");
    const shadow = box(stage, 320, 820, 560, 70, "book-shadow");
    const bk = box(stage, 360, 150, 470, 668, "book");
    const D = 50;
    const front = box(bk, 0, 0, 470, 668, "face front", null, { backgroundImage: "url(assets/book/front.jpg)", transform: `translateZ(${D / 2}px)`, overflow: "hidden" });
    box(front, 0, 0, 470, 668, "shade");
    const sheen = box(front, 0, 0, 470, 668, "sheen");
    box(bk, 0, 0, 470, 668, "face back", null, { backgroundImage: "url(assets/book/back.jpg)", transform: `rotateY(180deg) translateZ(${D / 2}px)` });
    box(bk, 0, 0, 50, 668, "face spine", null, { backgroundImage: "url(assets/book/spine.jpg)", left: "-25px", transform: `rotateY(-90deg) translateZ(0px)` });
    box(bk, 0, 0, 46, 660, "face pages", null, { left: "447px", top: "4px", transform: `rotateY(90deg) translateZ(0px)` });
    box(bk, 0, 0, 466, 46, "face ptop", null, { left: "2px", top: "-23px", transform: `rotateX(90deg)` });
    box(bk, 0, 0, 466, 46, "face pbot", null, { left: "2px", top: "645px", transform: `rotateX(-90deg)` });
    // reveal: push-in, ~30° turn showing depth, then settle front-facing
    const t0 = T("menerbitkan") - 0.2;
    tl.fromTo(bk, { opacity: 0, z: -900, rotationY: 62, rotationX: 8, y: 40 }, { opacity: 1, z: 0, rotationY: 32, rotationX: 4, y: 0, duration: 2.2, ease: "power3.out" }, t0);
    tl.fromTo(shadow, { opacity: 0, scaleX: 0.5 }, { opacity: 1, scaleX: 1, duration: 2.2, ease: "power3.out" }, t0);
    tl.to(bk, { rotationY: 24, rotationX: 2, duration: 1.6, ease: "sine.inOut" }, t0 + 2.2);
    tl.to(bk, { rotationY: 6, rotationX: 0, duration: 1.4, ease: "power2.inOut" }, t0 + 3.8);
    tl.to(bk, { rotationY: 11, y: -10, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, t0 + 5.4);
    tl.fromTo(sheen, { x: -500 }, { x: 600, duration: 1.6, ease: "sine.inOut" }, t0 + 3.6);
    sfx("book_impact", t0 + 1.0, 0.75); sfx("whoosh_soft", t0, 0.4); sfx("shimmer", t0 + 3.6, 0.35);
    // gold text beside the book
    const tx = box(f, 1000, 250, 820, 520, "");
    const k = text(tx, 0, 0, 820, "BUKU OLEH DR AZREN", "kicker", { fontSize: "24px" });
    const ttl = text(tx, 0, 50, 820, "", "h-lg", { fontSize: "84px", color: "var(--gold2)", lineHeight: "1.05" });
    const ws = words(ttl, "“Dr, Saya Boleh Sembuh Ke?”");
    const ln = box(tx, 0, 300, 320, 3, "rule");
    const a1 = text(tx, 0, 330, 820, "Ditulis oleh Dr Fakrul Azren", "", { fontSize: "36px", fontWeight: "600", color: "var(--ivory)" });
    const a2 = text(tx, 0, 384, 820, "Terbitan Whitecoat", "", { fontSize: "32px", fontWeight: "500", color: "var(--parch)" });
    const tT = T("bertajuk") - 0.1;
    fadeIn(k, tT - 0.4, 0.5, { x: 30 });
    tl.fromTo(ws, { opacity: 0, y: 40, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: E.out, stagger: 0.12 }, tT);
    drawLine(ln, tT + 0.9, 0.7);
    fadeIn(a1, tT + 1.2, 0.6, { x: 30 });
    fadeIn(a2, T("terbitan") - 0.1, 0.6, { x: 30 });
    sfx("pop", tT, 0.35);
    // what the book shares
    const tD = T("dalam buku ini");
    const chips = [["penyakit mental", "Penyakit mental", "brain"], ["perjalanan pemulihan", "Perjalanan pemulihan", "life"], ["memahami", "Memahami pengalaman pesakit", "eye"]];
    chips.forEach(([ph, l, ic], i) => {
      const t = T(ph) - 0.2;
      const c = box(tx, 0, 450 + i * 0, 820, 60, "", null, { display: "flex", alignItems: "center", gap: "14px" });
      c.style.top = 450 + i * 66 + "px";
      c.innerHTML = `<div class="icon" style="width:44px;height:44px;color:var(--teal2)">${H.ICON[ic]}</div><div style="font-family:Inter;font-weight:600;font-size:30px;color:var(--ivory)">${l}</div>`;
      slideIn(c, t, 30, 0, 0.5);
      sfx("click", t, 0.4);
    });
    // hand-off to s24: keep the book on stage
    window.__BOOK = { bk, shadow, stage };
  };

  // ======================= S24 — screening, comments, brand end card =======================
  S.s24 = (b, f, sc) => {
    const T = (p, n = 1) => at(p, n, sc.start - 0.5);
    box(b, 0, 0, 1920, 1080, "tex-navy");
    const gl = box(b, 210, 80, 800, 900, "glow", null, { background: "radial-gradient(circle, rgba(227,201,143,.45), rgba(227,201,143,0) 65%)" });
    dust(b, 30, 241, sc.start, sc.end, { color: "rgba(227,201,143,.95)", op: 0.6, rise: 80, max: 4 });
    // the book (static copy) stays on the left
    const stage = box(f, 0, 0, 1920, 1080, "book-stage");
    box(stage, 320, 820, 560, 70, "book-shadow");
    const bk = box(stage, 360, 150, 470, 668, "book");
    const front = box(bk, 0, 0, 470, 668, "face front", null, { backgroundImage: "url(assets/book/front.jpg)", transform: "translateZ(25px)" });
    box(front, 0, 0, 470, 668, "shade");
    box(bk, 0, 0, 50, 668, "face spine", null, { backgroundImage: "url(assets/book/spine.jpg)", left: "-25px", transform: "rotateY(-90deg)" });
    box(bk, 0, 0, 46, 660, "face pages", null, { left: "447px", top: "4px", transform: "rotateY(90deg)" });
    tl.set(bk, { rotationY: 6, y: 0 }, sc.start);
    tl.to(bk, { rotationY: 13, duration: 7, ease: "sine.inOut" }, sc.start + 0.8);
    // screening & consultation
    const tS = T("saringan");
    const card = box(f, 1000, 220, 820, 420, "card", null, { borderRadius: "18px" });
    card.innerHTML = `<div style="padding:44px 50px">
      <div style="font-family:Inter;font-weight:700;letter-spacing:.22em;font-size:22px;color:var(--teal)">ADA SIMPTOM YANG MEMBIMBANGKAN?</div>
      <div style="margin-top:16px;font-family:'Playfair Display';font-weight:700;font-size:56px;line-height:1.1;color:var(--navy)">Saringan & konsultasi</div>
      <div style="margin-top:12px;font-family:Inter;font-weight:600;font-size:32px;color:var(--ink)">bersama Dr Azren</div>
      <div style="margin-top:34px;display:flex;align-items:center;gap:16px"><div class="icon" style="width:52px;height:52px;color:var(--burg)">${H.ICON.pin}</div><div style="font-family:Inter;font-weight:700;font-size:34px;color:var(--navy)">Klinik di Nilai</div></div></div>`;
    slideIn(card, T("ahli keluarga") - 0.2, 80, 0, 0.7);
    sfx("card", T("ahli keluarga") - 0.2, 0.5);
    const st = icon(f, "stetho", 1700, 250, 90, "var(--teal)");
    tl.fromTo(st, { opacity: 0, rotation: -30 }, { opacity: 1, rotation: 0, duration: 0.6, ease: E.back }, tS);
    drawSVG(st.querySelectorAll("path,circle"), tS, 0.7);
    sfx("ui", tS, 0.45);
    // ask in the comments
    const tA = T("apa persoalan");
    tl.to(card, { y: -60, scale: 0.9, opacity: 0.4, duration: 0.6 }, tA - 0.5);
    tl.to(st, { opacity: 0, duration: 0.4 }, tA - 0.5);
    const cm = box(f, 1040, 600, 760, 150, "card glass", null, { borderRadius: "18px", display: "flex", alignItems: "center", gap: "26px", padding: "0 36px" });
    cm.innerHTML = `<div class="icon" style="width:84px;height:84px;color:var(--gold2)">${H.ICON.comment}</div><div style="font-family:Inter;font-weight:700;font-size:38px;color:var(--ivory)">Tanya di ruangan komen</div>`;
    slideIn(cm, tA - 0.2, 0, 60, 0.6);
    sfx("pop", tA, 0.5);
    // brand end card
    const tE = T("take care") + 0.9;
    const end = box(f, 0, 0, 1920, 1080, "tex-navy", null, { opacity: 0 });
    tl.to(end, { opacity: 1, duration: 1.0, ease: "sine.inOut" }, tE);
    const e1 = text(end, 0, 400, 1920, "", "h-lg", { textAlign: "center", color: "var(--ivory)", letterSpacing: ".14em", fontSize: "104px" });
    const el = letters(e1, "DR AZREN");
    const e2 = text(end, 0, 560, 1920, "SPREAD POSITIVITY", "kicker", { textAlign: "center", fontSize: "38px", letterSpacing: ".5em" });
    const sep = box(end, 760, 535, 400, 2, "rule");
    revealLetters(el, tE + 0.6, { stagger: 0.07 });
    drawLine(sep, tE + 1.3, 0.8);
    fadeIn(e2, tE + 1.6, 0.9, { y: 20 });
    const sw = box(end, -600, 360, 500, 300, "", null, { background: "linear-gradient(100deg, rgba(227,201,143,0), rgba(227,201,143,.28), rgba(227,201,143,0))", mixBlendMode: "screen" });
    tl.fromTo(sw, { x: 0 }, { x: 2900, duration: 1.8, ease: "sine.inOut" }, tE + 2.3);
    dust(end, 30, 251, tE, sc.end, { color: "rgba(227,201,143,.95)", op: 0.7, rise: 90, max: 4 });
    sfx("book_impact", tE + 0.6, 0.55); sfx("shimmer", tE + 2.2, 0.45);
    void gl;
  };
})();
