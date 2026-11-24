(function () {
  "use strict";
  var D = window.KIKO, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var KEY = "kiko-order-v1", byId = {};
  D.products.forEach(function (p) { byId[p.id] = p; });
  var st = { items: {}, units: {}, form: {} };
  try { var s0 = JSON.parse(localStorage.getItem(KEY)); if (s0 && s0.items) { st.items = s0.items; st.units = s0.units || {}; st.form = s0.form || {}; } } catch (e) { }
  Object.keys(st.items).forEach(function (id) { if (!byId[id]) delete st.items[id]; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }
  function unitOf(p) { return p.units[st.units[p.id] || 0] || p.units[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function qtyHTML(p, n) { return '<div class="qty"><button type="button" data-step="1" aria-label="הוספת יחידה">+</button><input type="number" inputmode="numeric" min="0" max="9999" value="' + n + '" aria-label="כמות, ' + esc(p.name) + '"><button type="button" data-step="-1" aria-label="הפחתת יחידה">−</button></div>'; }
  var FLAT = /mix100|euro|brita_filter2|sweet_(bubble|sour|minigum|roller|rps|rainbow|rollup)|italia|colombia|costarica|ethiopia|india/;

  var ALIAS = { pepsi: "פפסי", "7up": "סבן אפ סבנאפ", mirinda: "מירינדה", brita: "בריטה", maxtra: "מקסטרה פילטר", style: "סטייל", glass: "גלאס", terra: "טרה", zero: "זירו", "בלון": "מיכל מכל co2 צילינדר", intenso: "אינטנסו", arabika: "ערביקה", aroma: "ארומה", alto: "אלטו", crema: "קרמה", cremoso: "קרמוסו", ristretto: "ריסטרטו", premium: "פרימיום", napoli: "נאפולי", strong: "סטרונג", forte: "פורטה", classico: "קלאסיקו", gold: "גולד", house: "האוס בלנד", roaster: "רוסטרס", verde: "ורדה", mix: "מיקס", colombia: "קולומביה", "costa": "קוסטה ריקה", ethiopia: "אתיופיה", india: "הודו אינדיה", italia: "איטליה", pieno: "פיאנו", cappuccino: "קפוצ׳ינו", chocolate: "שוקולד", euro: "יורו", roller: "רולר", rainbow: "ריינבו", fruity: "פרוטי", bubble: "באבל", gumball: "גאמבול מסטיק", yaams: "יאמס", zed: "זד" };
  /* ---- בנייה ---- */
  $(".top__nav").innerHTML = D.worlds.map(function (w) { return '<a href="#' + w.id + '" data-world="' + w.id + '">' + w.short + "</a>"; }).join("");
  $(".doors").innerHTML = D.worlds.map(function (w) {
    return '<a class="door" href="#' + w.id + '" data-world="' + w.id + '" aria-label="' + w.title + '"><canvas aria-hidden="true"></canvas><span class="door__word" aria-hidden="true">' + w.wall.join("<br>") + "</span>" +
      '<span class="door__items">' + w.hero.map(function (h) { return '<img src="img/' + h + '.webp" alt="">'; }).join("") + '</span><span class="door__cta"><span>' + w.lead + '</span><span class="btn">כניסה</span></span></a>';
  }).join("");
  $("#worlds").innerHTML = D.worlds.map(function (w) {
    return '<section class="world" id="' + w.id + '" data-world="' + w.id + '"><div class="band"><canvas aria-hidden="true"></canvas><span class="band__word" aria-hidden="true">' + w.title + '</span><h2 class="vh">' + w.title + '</h2></div><p class="lead">' + w.lead + "</p>" +
      '<nav class="chips" aria-label="' + w.title + '">' + w.groups.map(function (g) { return '<a href="#' + w.id + "-" + g.id + '">' + g.title + "</a>"; }).join("") + "</nav>" +
      w.groups.map(function (g) {
        return '<div class="group" id="' + w.id + "-" + g.id + '"><h3>' + g.title + '</h3><div class="grid">' + D.products.filter(function (p) { return p.w === w.id && p.g === g.id; }).map(card).join("") + "</div></div>";
      }).join("") + "</section>";
  }).join("");

  function find_(p) { var t = (p.name + " " + p.spec + " " + (p.sku || "") + " " + D.worlds.filter(function (w) { return w.id === p.w; })[0].title).toLowerCase(); Object.keys(ALIAS).forEach(function (k) { if ((p.name + " " + p.spec).toLowerCase().indexOf(k) > -1) t += " " + ALIAS[k]; }); if (p.w === "coffee") t += " אספרסו מור espressomor nespresso נספרסו"; if (p.w === "soda" && p.g !== "brita") t += " סודה סטרים סודהסטרים sodastream"; if (p.g === "brita") t += " brita בריטה קנקן פילטר"; return t; }
  function card(p) {
    var u = p.units.length > 1 ? '<div class="units" role="group" aria-label="יחידת הזמנה">' + p.units.map(function (x, i) { return '<button type="button" data-unit="' + i + '" aria-pressed="' + ((st.units[p.id] || 0) === i) + '">' + x + "</button>"; }).join("") + "</div>" : '<div class="one">' + p.units[0] + "</div>";
    return '<article class="card" data-id="' + p.id + '" data-find="' + esc(find_(p)) + '"><div class="niche"><img class="' + (FLAT.test(p.img) ? "flat" : "") + '" src="img/' + p.img + '.webp" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
      (p.strength ? '<span class="tag">חוזק ' + p.strength + "</span>" : "") + "</div><h4>" + esc(p.name) + "</h4><p>" + esc(p.spec) + '</p><div class="card__end">' + u + '<div class="act"></div></div></article>';
  }
  function paint(id) {
    var c = $('.card[data-id="' + id + '"]'), p = byId[id], n = st.items[id] || 0; if (!c) return;
    c.classList.toggle("in", n > 0);
    var a = $(".act", c), q = $(".qty input", a);
    if (n > 0) { if (q) { if (document.activeElement !== q || +q.value !== n) q.value = n; } else a.innerHTML = qtyHTML(p, n); }
    else a.innerHTML = '<button type="button" class="add" aria-label="הוספה להזמנה, ' + esc(p.name) + '">הוספה</button>';
    $$("[data-unit]", c).forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.unit === (st.units[id] || 0)); });
  }
  function bar() {
    var ids = Object.keys(st.items), b = $(".bar"), n = ids.length;
    b.hidden = !n; $(".bar__count").textContent = n; $(".bar__txt").textContent = n === 1 ? "מוצר אחד בהזמנה" : n + " מוצרים בהזמנה";
  }
  function set(id, n, quiet) {
    n = Math.max(0, Math.min(9999, Math.floor(+n || 0)));
    var isNew = n > 0 && !st.items[id];
    if (n) st.items[id] = n; else delete st.items[id];
    save(); paint(id); bar();
    if (isNew) { var b = $(".bar"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    if (!quiet && dlg.open) list();
  }

  /* ---- כרטיסים ---- */
  var root = $("#worlds"), dlg = $(".order");
  root.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var c = b.closest(".card"); if (!c) return; var id = c.dataset.id;
    if (b.dataset.unit) { st.units[id] = +b.dataset.unit; save(); paint(id); }
    else if (b.classList.contains("add")) { set(id, 1); var q = $(".qty [data-step='1']", c); if (q) q.focus({ preventScroll: true }); }
    else if (b.dataset.step) { set(id, (st.items[id] || 0) + +b.dataset.step); var a = $(".add", c); if (a) a.focus({ preventScroll: true }); }
  });
  root.addEventListener("focusin", function (e) { if (e.target.matches(".qty input")) e.target.select(); });
  root.addEventListener("input", function (e) { var c = e.target.closest(".card"); if (c && e.target.matches(".qty input") && +e.target.value > 0) set(c.dataset.id, e.target.value); });
  root.addEventListener("change", function (e) { var c = e.target.closest(".card"); if (c && e.target.matches(".qty input")) set(c.dataset.id, e.target.value); });

  /* ---- סיכום ---- */
  function list() {
    var h = D.worlds.map(function (w) {
      var it = D.products.filter(function (p) { return p.w === w.id && st.items[p.id]; });
      return it.length ? '<div data-world="' + w.id + '"><h3>' + w.title + "</h3>" + it.map(function (p) {
        return '<div class="line" data-id="' + p.id + '"><div class="line__img"><img src="img/' + p.img + '.webp" alt=""></div><div><b>' + esc(p.name) + "</b><small>" + unitOf(p) + "</small></div>" + qtyHTML(p, st.items[p.id]) + "</div>";
      }).join("") + "</div>" : "";
    }).join("");
    $(".order__list").innerHTML = h || '<p class="empty">ההזמנה ריקה. בוחרים מוצרים בקטלוג והם יופיעו כאן.</p>';
    $(".send").disabled = $(".copy").disabled = !h; $(".clear").hidden = !h;
  }
  $("#openOrder").addEventListener("click", function () { list(); dlg.showModal(); document.documentElement.style.overflow = "hidden"; });
  dlg.addEventListener("close", function () { document.documentElement.style.overflow = ""; });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.closest("[data-close]")) return dlg.close();
    var b = e.target.closest("[data-step]"), l = b && b.closest(".line");
    if (l) { var id = l.dataset.id, n = (st.items[id] || 0) + +b.dataset.step; set(id, n, true); if (n > 0) $("input", l).value = n; else list(); }
  });
  dlg.addEventListener("change", function (e) { var l = e.target.closest(".line"); if (l) { set(l.dataset.id, e.target.value, true); if (!st.items[l.dataset.id]) list(); } });
  $$(".order__form [name]").forEach(function (f) { f.value = st.form[f.name] || ""; f.addEventListener("input", function () { st.form[f.name] = f.value; save(); }); });
  var armed = 0;
  $(".clear").addEventListener("click", function () {
    var b = this;
    if (Date.now() - armed > 4000) { armed = Date.now(); b.textContent = "לחיצה נוספת תרוקן את ההזמנה"; setTimeout(function () { b.textContent = "ריקון ההזמנה"; }, 4000); return; }
    armed = 0; b.textContent = "ריקון ההזמנה";
    var ids = Object.keys(st.items); st.items = {}; save(); ids.forEach(paint); bar(); list();
  });

  function message() {
    var f = st.form, t = ["*הזמנה חדשה מקטלוג קיקו שיווק*"], v = function (k) { return (f[k] || "").trim(); };
    if (v("biz")) t.push("שם העסק: " + v("biz"));
    if (v("who")) t.push("איש קשר: " + v("who"));
    if (v("addr")) t.push("כתובת: " + v("addr"));
    D.worlds.forEach(function (w) {
      var it = D.products.filter(function (p) { return p.w === w.id && st.items[p.id]; }); if (!it.length) return;
      t.push("", "*" + w.title + "*");
      it.forEach(function (p) { t.push("• " + p.name + "\n   כמות: *" + st.items[p.id] + "* × " + unitOf(p) + (p.sku ? " | מק״ט " + p.sku : "")); });
    });
    if (v("note")) t.push("", "הערות: " + v("note"));
    t.push("", "סה״כ מוצרים: " + Object.keys(st.items).length);
    return t.join("\n");
  }
  function toast(s) { var t = $(".toast"); (dlg.open ? dlg : document.body).appendChild(t); t.textContent = s; void t.offsetWidth; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 3800); }
  window.KIKO.message = message;
  window.KIKO.link = function () { return "https://wa.me/" + D.phone + "?text=" + encodeURIComponent(message()); };
  $(".send").addEventListener("click", function () {
    if (!Object.keys(st.items).length) return;
    var u = window.KIKO.link(), w = window.open(u, "_blank"); if (w) { try { w.opener = null; } catch (e) { } } else location.href = u;
    toast("ההזמנה מוכנה בוואטסאפ. נשאר ללחוץ שם על שליחה.");
  });
  $(".copy").addEventListener("click", function () {
    var m = message(), done = function () { toast("ההזמנה הועתקה"); };
    if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(m).then(done, function () { fallback(m, done); }); else fallback(m, done);
  });
  function fallback(m, cb) { var a = document.createElement("textarea"); a.value = m; dlg.appendChild(a); a.select(); try { document.execCommand("copy"); cb(); } catch (e) { } a.remove(); }

  /* ---- חיפוש ---- */
  var q = $("#q");
  function find() {
    var words = q.value.trim().toLowerCase().replace(/[׳']/g, "׳").split(/\s+/).filter(Boolean), any = false;
    $$(".card").forEach(function (c) { var t = c.dataset.find.replace(/'/g, "׳"), ok = words.every(function (w) { return t.indexOf(w) > -1; }); c.hidden = !ok; any = any || ok; });
    $$(".group").forEach(function (g) { g.hidden = !$(".card:not([hidden])", g); });
    $$(".world").forEach(function (w) { w.hidden = !$(".card:not([hidden])", w); });
    var on = words.length > 0; $(".doors").hidden = $(".intro").hidden = on; $$(".band,.lead,.chips").forEach(function (x) { x.hidden = on; });
    root.style.paddingTop = on ? "calc(var(--topH) + 20px)" : ""; $(".noresult").hidden = any; $(".noresult").style.paddingTop = on ? "calc(var(--topH) + 60px)" : "";
    if (on) scrollTo({ top: 0, behavior: "instant" });
  }
  q.addEventListener("input", find);
  $("#clearq").addEventListener("click", function () { q.value = ""; find(); });
  $$(".top__nav a,.top__logo").forEach(function (a) { a.addEventListener("click", function () { if (q.value) { q.value = ""; find(); } }); });

  /* ---- ניווט פעיל ---- */
  var links = $$(".top__nav a"), secs = $$(".world"), pend = false;
  function spy() { pend = false; var y = innerHeight * 0.4, cur = ""; secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (!s.hidden && r.top < y && r.bottom > y) cur = s.id; }); links.forEach(function (a) { var on = a.dataset.world === cur; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }
  addEventListener("scroll", function () { if (!pend) { pend = true; requestAnimationFrame(spy); } }, { passive: true });

  /* ---- הטיה תלת־ממדית ---- */
  if (matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
    root.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".card"); if (!c) return; var r = c.getBoundingClientRect();
      c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 9 + "deg"); c.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 6 + "deg");
    });
    root.addEventListener("pointerout", function (e) { var c = e.target.closest && e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); } });
    $$(".door").forEach(function (d) { d.addEventListener("pointermove", function (e) { var r = d.getBoundingClientRect(); d.style.setProperty("--mx", (e.clientX - r.left) / r.width - 0.5); d.style.setProperty("--my", (e.clientY - r.top) / r.height - 0.5); }); });
  }

  D.products.forEach(function (p) { paint(p.id); }); bar(); spy();

  /* ---- תבליטים ---- */
  if (Relief.start()) {
    var go = function () {
      D.worlds.forEach(function (w, i) {
        var d = $$(".door")[i];
        Relief.add($("canvas", d), w.id, w.wall, { host: d, seed: 11 + i, layout: function (W, H) { return W > H ? { box: [0.73, 0.4, 0.44, w.wall.length > 1 ? 0.56 : 0.5], lines: w.wall, scale: 0.1 } : { box: [0.5, 0.2, 0.8, w.wall.length > 1 ? 0.25 : 0.2], lines: w.wall, scale: 0.075 }; } });
        var b = $("#" + w.id + " .band");
        Relief.add($("canvas", b), w.id, w.band, { host: b, seed: 31 + i, layout: function (W, H) { return W > 700 ? { box: [0.5, 0.47, 0.7, 0.46], lines: [w.band.join(" ")], scale: 0.075 } : { box: [0.5, 0.47, 0.84, 0.62], lines: w.band, scale: 0.085 }; } });
      });
    };
    (document.fonts && document.fonts.load ? Promise.all([document.fonts.load("900 80px Heebo", "קפה"), document.fonts.load("900 80px Heebo", "BRITA")]) : Promise.resolve()).then(go, go);
  }
})();
