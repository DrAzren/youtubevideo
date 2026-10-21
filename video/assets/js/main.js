/* Assembles every scene onto the single root timeline, plus global overlays and captions. */
(function () {
  const { tl, S, SFX, mk, letters, revealLetters, drawLine, fadeOut, rng, sfx } = HF;
  const D = PLAN.duration;

  // ---- scenes ----
  PLAN.scenes.forEach((sc, i) => {
    const base = document.getElementById(sc.id);
    const fx = document.getElementById(sc.id + "-fx");
    const inner = mk("div", "layer", base);
    const fxi = mk("div", "layer", fx);
    if (i > 0) {
      tl.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "sine.inOut" }, sc.start);
      tl.fromTo(fxi, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "sine.inOut" }, sc.start + 0.2);
    }
    if (i < PLAN.scenes.length - 1) tl.to(fxi, { opacity: 0, duration: 0.55, ease: "power1.in" }, sc.end - 0.75);
    if (S[sc.id]) S[sc.id](inner, fxi, sc);
  });

  // ---- videos: fade wrappers in/out around their media window ----
  Object.entries(PLAN.videos).forEach(([id, v]) => {
    const w = document.getElementById(id + "-wrap");
    tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut" }, v.start);
    tl.to(w, { opacity: 0, duration: 0.45, ease: "sine.inOut" }, v.start + v.dur - 0.5);
  });

  // ---- chapter markers (one element per chapter) ----
  const chRoot = document.getElementById("chapter");
  PLAN.scenes.filter((s) => s.chapter).forEach((s) => {
    const t = s.start + 0.9;
    const ch = mk("div", "chap", chRoot, `<span class="num">${s.chapter}</span><span class="bar"></span><span class="lbl">${s.label}</span>`);
    tl.fromTo(ch, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, t);
    tl.fromTo(ch.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, t + 0.15);
    tl.to(ch, { opacity: 0, duration: 0.6 }, t + 7);
    sfx("tick", t + 0.15, 0.5);
  });

  // ---- brand bug (hidden over title, book and end card) ----
  const brand = document.getElementById("brand");
  const sc = (id) => PLAN.scenes.find((s) => s.id === id);
  tl.set(brand, { opacity: 0 }, 0);
  tl.to(brand, { opacity: 0.62, duration: 1 }, 3);
  tl.to(brand, { opacity: 0, duration: 0.5 }, sc("s03").start);
  tl.to(brand, { opacity: 0.62, duration: 0.8 }, sc("s04").start + 1);
  tl.to(brand, { opacity: 0, duration: 0.5 }, sc("s23").start);

  // ---- captions: words appear only as they are spoken ----
  const capRoot = document.getElementById("captions");
  CAPTIONS.forEach((c) => {
    const el = mk("div", "cap", capRoot);
    const spans = c.w.map((w) => {
      const s = mk("span", "cw" + (w.h ? " " + w.h : ""), el, w.w);
      el.appendChild(document.createTextNode(" "));
      return s;
    });
    tl.set(el, { opacity: 1 }, c.s);
    c.w.forEach((w, i) => tl.fromTo(spans[i], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.14, ease: "power1.out" }, w.s));
    tl.set(el, { opacity: 0 }, c.e);
  });

  // ---- open / close fades ----
  const fade = document.getElementById("letterbox-fade");
  tl.fromTo(fade, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: "sine.out" }, 0);
  tl.to(fade, { opacity: 1, duration: 1.4, ease: "sine.in" }, D - 1.4);

  tl.set({}, {}, D);
  window.__SFX = SFX;
})();
