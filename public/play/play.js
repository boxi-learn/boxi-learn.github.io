/* K12 interactive pages — shared helpers. No dependencies, no network.
 *
 * Page skeleton (see _template.html):
 *   <body data-subject="physics">            subject id → accent colour (play.css)
 *   <div class="play">…</div>                 content; any element with data-t="key" gets P.t(key) as text,
 *                                             data-t-html="key" as HTML, data-t-aria="key" as aria-label.
 *   <script src="play.js"></script>           relative path: pages live in /play/<subject>/, so "../play.js"
 *
 * API (global `Play`):
 *   const P = Play.setup({ en: {...}, zh: {...} })
 *       Reads ?lang=en|zh (default en) and ?embed=1. Fills data-t* elements, builds the language
 *       links in .langs, sets <html lang> and document.title from key "title".
 *       Throws in the console if en and zh have different keys.
 *   P.lang                       "en" | "zh"
 *   P.t(key, vars?)              string; "{n}" placeholders filled from vars
 *   Play.steps(el, labels, onChange)
 *       Fills el (a .steps div) with step buttons "01 label"…; ←/→ move between them.
 *       Calls onChange(i) now with i = 0 and on every change. Returns { go(i), get i() }.
 *   Play.predict(el, { q, options:[{label, right}], right, wrong }, onAnswer?)
 *       Predict-first box: question + buttons; after a pick shows feedback, marks right/wrong.
 *       Strings are already translated (pass P.t(...)). Returns { reset() }.
 *   Play.live(el, text)          Writes text into an aria-live="polite" region.
 *   Play.reduced                 true when prefers-reduced-motion: do not autoplay.
 *   Play.speak(text, lang)       Browser speech synthesis ("en-US" / "zh-CN"); silently no-op if missing.
 *   Play.svg(tag, attrs, parent?) Creates an SVG element.
 *   Play.clamp(x, a, b), Play.fmt(x, digits)  number helpers (fmt never returns "NaN").
 *   Play.pointer(svgEl, evt)     Event → {x, y} in the SVG's viewBox coordinates.
 */
(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const NS = "http://www.w3.org/2000/svg";

  function setup(strings) {
    const lang = params.get("lang") === "zh" ? "zh" : "en";
    const ek = Object.keys(strings.en || {}).sort().join("|");
    const zk = Object.keys(strings.zh || {}).sort().join("|");
    if (ek !== zk) console.error("Play.setup: en and zh keys differ");
    const dict = strings[lang];
    const t = (k, vars) => {
      let s = dict[k];
      if (s === undefined) { console.error("Play: missing string " + k); return k; }
      if (vars) s = s.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? vars[v] : m));
      return s;
    };
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    if (dict.title) document.title = dict.title;
    if (params.get("embed") === "1") {
      document.body.classList.add("embed");
      // Tell the lesson page our height so its iframe never scrolls inside (see [lesson].astro).
      const post = () => {
        const box = document.querySelector(".play") || document.body;
        parent.postMessage({ type: "play-height", h: Math.ceil(box.getBoundingClientRect().height) + 8 }, "*");
      };
      if ("ResizeObserver" in window) new ResizeObserver(post).observe(document.body);
      addEventListener("load", post);
    }
    document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
    document.querySelectorAll("[data-t-html]").forEach((el) => (el.innerHTML = t(el.dataset.tHtml)));
    document.querySelectorAll("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.tAria)));
    document.querySelectorAll(".langs").forEach((box) => {
      box.innerHTML = "";
      [["en", "English"], ["zh", "中文"]].forEach(([l, name]) => {
        if (l === lang) return;
        const q = new URLSearchParams(location.search);
        q.set("lang", l);
        const a = document.createElement("a");
        a.href = "?" + q.toString();
        a.textContent = name;
        a.lang = l === "zh" ? "zh-CN" : "en";
        box.appendChild(a);
      });
    });
    return { lang, t };
  }

  function steps(el, labels, onChange) {
    let cur = 0;
    el.setAttribute("role", "tablist");
    el.innerHTML = "";
    const btns = labels.map((label, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.innerHTML = '<span class="k">' + String(i + 1).padStart(2, "0") + "</span>";
      b.appendChild(document.createTextNode(label));
      b.addEventListener("click", () => go(i));
      b.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { go(Math.min(cur + 1, labels.length - 1)); btns[cur].focus(); e.preventDefault(); }
        if (e.key === "ArrowLeft") { go(Math.max(cur - 1, 0)); btns[cur].focus(); e.preventDefault(); }
      });
      el.appendChild(b);
      return b;
    });
    function go(i) {
      cur = i;
      btns.forEach((b, j) => {
        b.classList.toggle("on", j === i);
        b.setAttribute("aria-selected", j === i ? "true" : "false");
        b.tabIndex = j === i ? 0 : -1;
      });
      onChange(i);
    }
    go(0);
    return { go, get i() { return cur; } };
  }

  function predict(el, cfg, onAnswer) {
    el.classList.add("predict");
    el.innerHTML = "";
    const q = document.createElement("div");
    q.className = "q";
    q.textContent = cfg.q;
    const row = document.createElement("div");
    row.className = "choices";
    const fb = document.createElement("div");
    fb.className = "fb";
    fb.setAttribute("aria-live", "polite");
    const btns = cfg.options.map((o, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      b.addEventListener("click", () => {
        btns.forEach((x, j) => {
          x.classList.remove("right", "wrong", "on");
          if (j === i) x.classList.add("on", o.right ? "right" : "wrong");
        });
        fb.textContent = o.right ? cfg.right : cfg.wrong;
        if (onAnswer) onAnswer(i, !!o.right);
      });
      row.appendChild(b);
      return b;
    });
    el.append(q, row, fb);
    return { reset() { btns.forEach((x) => x.classList.remove("right", "wrong", "on")); fb.textContent = ""; } };
  }

  function live(el, text) {
    if (!el.hasAttribute("aria-live")) el.setAttribute("aria-live", "polite");
    el.textContent = text;
  }

  function speak(text, lang) {
    try {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || "en-US";
      u.rate = 0.85;
      speechSynthesis.speak(u);
    } catch (e) { /* no speech: page still works */ }
  }

  function svg(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d) : "—");

  function pointer(svgEl, e) {
    const pt = svgEl.createSVGPoint();
    const src = e.touches ? e.touches[0] : e;
    pt.x = src.clientX;
    pt.y = src.clientY;
    const m = svgEl.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  window.Play = {
    setup, steps, predict, live, speak, svg, clamp, fmt, pointer,
    reduced: window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
})();
