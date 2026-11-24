/* תבליט תלת־ממדי: מפת גובה לכל עולם, מוארת בזמן אמת באור נע (WebGL) */
window.Relief = (function () {
  "use strict";
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* k = [אור סביבה, אור ראשי, אור נע, ברק] · v = [ויניטה, דחיסת בהירות, עומק צללים] */
  var THEMES = {
    dark: { k: [0.16, 0.5, 1, 1], v: [0.75, 0.22, 0.32],
      coffee: { base: [0.235, 0.135, 0.075], lit: [0.86, 0.55, 0.27], word: [0.92, 0.74, 0.58] },
      sweets: { base: [0.42, 0.055, 0.17], lit: [1.0, 0.42, 0.52], word: [1.0, 0.66, 0.72] },
      soda: { base: [0.02, 0.265, 0.31], lit: [0.36, 0.86, 0.9], word: [0.63, 0.92, 0.94] } },
    stone: { k: [0.3, 0.98, 0.1, 0.1], v: [0.06, 0.0, 0.35],
      coffee: { base: [0.93, 0.85, 0.74], lit: [1, 0.95, 0.87], word: [0.5, 0.28, 0.13], sh: [0.5, 0.36, 0.22] },
      sweets: { base: [0.96, 0.8, 0.83], lit: [1, 0.93, 0.94], word: [0.7, 0.1, 0.3], sh: [0.66, 0.3, 0.4] },
      soda: { base: [0.76, 0.9, 0.915], lit: [0.93, 1, 1], word: [0.03, 0.44, 0.5], sh: [0.2, 0.48, 0.54] } },
    enamel: { k: [0.32, 0.95, 0.12, 0.45], v: [0.06, 0.0, 0.4],
      coffee: { base: [0.96, 0.68, 0.33], lit: [1, 0.86, 0.6], word: [1, 0.98, 0.94], sh: [0.6, 0.33, 0.1] },
      sweets: { base: [1, 0.48, 0.58], lit: [1, 0.76, 0.8], word: [1, 0.97, 0.98], sh: [0.66, 0.16, 0.3] },
      soda: { base: [0.31, 0.79, 0.84], lit: [0.72, 0.97, 1], word: [0.97, 1, 1], sh: [0.08, 0.42, 0.5] } },
    pearl: { k: [0.3, 1.0, 0.08, 0.16], v: [0.04, 0.0, 0.4], metal: 1,
      coffee: { base: [0.965, 0.935, 0.9], lit: [1, 0.985, 0.96], word: [0.72, 0.41, 0.2], sh: [0.62, 0.5, 0.4] },
      sweets: { base: [0.975, 0.925, 0.935], lit: [1, 0.975, 0.98], word: [0.78, 0.36, 0.46], sh: [0.68, 0.48, 0.54] },
      soda: { base: [0.915, 0.96, 0.965], lit: [0.98, 1, 1], word: [0.16, 0.54, 0.6], sh: [0.42, 0.58, 0.63] } }
  };
  var TH = THEMES[document.documentElement.dataset.theme] || THEMES.dark, MAT = TH;

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function smooth(a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  function blur(src, W, H, r) {
    r = Math.max(1, Math.round(r));
    var a = new Float32Array(src), b = new Float32Array(src.length), n = 2 * r + 1, x, y, s, i;
    for (var pass = 0; pass < 2; pass++) {
      for (y = 0; y < H; y++) {
        s = 0; for (i = -r; i <= r; i++) s += a[y * W + Math.min(W - 1, Math.max(0, i))];
        for (x = 0; x < W; x++) { b[y * W + x] = s / n; s += a[y * W + Math.min(W - 1, x + r + 1)] - a[y * W + Math.max(0, x - r)]; }
      }
      for (x = 0; x < W; x++) {
        s = 0; for (i = -r; i <= r; i++) s += b[Math.min(H - 1, Math.max(0, i)) * W + x];
        for (y = 0; y < H; y++) { a[y * W + x] = s / n; s += b[Math.min(H - 1, y + r + 1) * W + x] - b[Math.max(0, y - r) * W + x]; }
      }
    }
    return a;
  }

  function stamp(h, W, H, cx, cy, R, fn) {
    var x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(W - 1, Math.ceil(cx + R)), y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(H - 1, Math.ceil(cy + R));
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) { var v = fn(x - cx, y - cy); if (v > h[y * W + x]) h[y * W + x] = v; }
  }
  function bean(h, W, H, cx, cy, a, ang, z) {
    var b = a * 0.68, c = Math.cos(ang), s = Math.sin(ang);
    stamp(h, W, H, cx, cy, a, function (dx, dy) {
      var x = (dx * c + dy * s) / a, y = (-dx * s + dy * c) / b, r = x * x + y * y; if (r >= 1) return -1;
      var d = Math.abs(y - 0.2 * Math.sin(x * 2.9)) / 0.15;
      return z + Math.sqrt(1 - r) * b * 0.62 - Math.exp(-d * d) * b * 0.3 * (1 - r * r);
    });
  }
  function ball(h, W, H, cx, cy, R, z) { stamp(h, W, H, cx, cy, R, function (dx, dy) { var r = (dx * dx + dy * dy) / (R * R); return r >= 1 ? -1 : z + Math.sqrt(1 - r) * R * 0.62; }); }
  function bubble(h, W, H, cx, cy, R) {
    stamp(h, W, H, cx, cy, R, function (dx, dy) {
      var r = Math.sqrt(dx * dx + dy * dy) / R; if (r >= 1) return -1;
      var rim = Math.exp(-Math.pow((r - 0.88) / 0.09, 2)) * R * 0.1;
      return Math.sqrt(1 - r * r) * R * 0.46 + rim;
    });
  }
  function swirl(h, W, H, cx, cy, R, ang, z) {
    stamp(h, W, H, cx, cy, R, function (dx, dy) {
      var r = Math.sqrt(dx * dx + dy * dy) / R; if (r >= 1) return -1;
      var t = Math.atan2(dy, dx) + ang, dome = (1 - Math.pow(r, 5)) * R * 0.3;
      return z + dome + Math.cos(t * 2 + r * 13) * R * 0.045 * smooth(1, 0.78, r);
    });
  }
  function wrapped(h, W, H, cx, cy, R, ang, z) {
    var c = Math.cos(ang), s = Math.sin(ang), b = R * 0.42;
    stamp(h, W, H, cx, cy, R, function (dx, dy) {
      var x = dx * c + dy * s, y = -dx * s + dy * c, ax = Math.abs(x), v = -1;
      var r = (ax * ax) / (R * R * 0.3) + (y * y) / (b * b);
      if (r < 1) v = z + Math.sqrt(1 - r) * b * 0.72 + Math.cos((x + y) * 9 / R) * b * 0.04;
      var u = (ax - R * 0.46) / (R * 0.5);
      if (u > 0 && u < 1 && Math.abs(y) < R * (0.07 + 0.36 * u)) { var an = y / (ax - R * 0.3); v = Math.max(v, z + b * 0.22 + Math.cos(an * 22) * b * 0.07 * u); }
      return v;
    });
  }

  function heights(kind, W, H, unit, seed) {
    var h = new Float32Array(W * H), R = rng(seed), x, y, i;
    if (kind === "coffee") {
      var c = unit * 1.5, rows = Math.ceil(H / (c * 0.78)) + 2;
      for (var layer = 0; layer < 2; layer++)
        for (y = -1; y < rows; y++) for (x = -1; x < W / c + 2; x++)
          bean(h, W, H, (x + (y % 2 ? 0.5 : 0) + (R() - 0.5) * 0.5 + layer * 0.5) * c, (y + (R() - 0.5) * 0.5 + layer * 0.45) * c * 0.78, unit * (0.82 + R() * 0.16), R() * 6.28, layer * unit * 0.12);
    } else if (kind === "sweets") {
      var pts = [], tries = 900;
      while (tries--) {
        var big = pts.length < (W * H) / (unit * unit * 13), rr = unit * (big ? 0.95 + R() * 0.4 : 0.22 + R() * 0.3), px = R() * W, py = R() * H, ok = true;
        for (i = 0; i < pts.length; i++) { var q = pts[i]; if (Math.hypot(q[0] - px, q[1] - py) < (q[2] + rr) * 0.97) { ok = false; break; } }
        if (!ok) continue; pts.push([px, py, rr]);
        if (big) { if (R() < 0.6) swirl(h, W, H, px, py, rr, R() * 6.28, 0); else wrapped(h, W, H, px, py, rr * 1.06, R() * 6.28, 0); } else ball(h, W, H, px, py, rr, 0);
      }
    } else {
      var w1 = [W * 0.16, H * 0.86], w2 = [W * 0.95, H * 0.12];
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var d1 = Math.hypot(x - w1[0], y - w1[1]) / unit, d2 = Math.hypot(x - w2[0], y - w2[1]) / unit;
        h[y * W + x] = unit * 0.16 * (1 + Math.sin(d1 * 3.4) * Math.exp(-d1 * 0.2) * 0.9 + Math.sin(d2 * 3.1) * Math.exp(-d2 * 0.22) * 0.8);
      }
      var bs = [], t2 = 700;
      while (t2--) {
        var br = unit * (0.1 + Math.pow(R(), 3) * 0.95), bx = R() * W, by = R() * H, good = true;
        for (i = 0; i < bs.length; i++) if (Math.hypot(bs[i][0] - bx, bs[i][1] - by) < bs[i][2] + br + unit * 0.06) { good = false; break; }
        if (good) { bs.push([bx, by, br]); bubble(h, W, H, bx, by, br); }
      }
    }
    return h;
  }

  function bake(p, W, H) {
    var unit = Math.max(22, Math.sqrt(W * H) * (p.opts.scale || 0.085));
    var h = heights(p.kind, W, H, unit, p.opts.seed || 7), N = W * H, i, tm = new Uint8Array(N);
    if (p.lines && p.lines.length) {
      var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      var c = cv.getContext("2d", { willReadFrequently: true });
      var box = p.opts.box || [0.5, 0.5, 0.8, 0.7], size = 200, mw = 0;
      c.direction = "rtl"; c.textAlign = "center"; c.textBaseline = "alphabetic"; c.fillStyle = "#fff";
      c.font = "900 " + size + "px Heebo, Arial";
      p.lines.forEach(function (l) { mw = Math.max(mw, c.measureText(l).width); });
      var lh = 0.92;
      size = Math.min(size * (W * box[2]) / mw, (H * box[3]) / (0.74 + lh * (p.lines.length - 1)));
      c.font = "900 " + size + "px Heebo, Arial";
      var top = H * box[1] - size * (0.74 + lh * (p.lines.length - 1)) / 2 + size * 0.72;
      p.lines.forEach(function (l, k) { c.fillText(l, W * box[0], top + k * size * lh); });
      var d = c.getImageData(0, 0, W, H).data, m = new Float32Array(N);
      for (i = 0; i < N; i++) m[i] = d[i * 4 + 3] / 255;
      var edge = blur(m, W, H, Math.max(1.5, size * 0.016)), wide = blur(m, W, H, size * 0.1);
      var T = Math.max(9, size * 0.085);
      for (i = 0; i < N; i++) {
        var keep = 1 - smooth(0.03, 0.4, wide[i]) * 0.94;
        h[i] = h[i] * keep + T * smooth(0.08, 0.92, edge[i]); tm[i] = smooth(0.15, 0.6, edge[i]) * 255;
      }
    }
    h = blur(h, W, H, 1);
    var lo = blur(h, W, H, unit * 0.22), px = new Uint8Array(N * 4), mx = 1;
    for (i = 0; i < N; i++) if (h[i] > mx) mx = h[i];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      i = y * W + x;
      var dx = h[y * W + Math.min(W - 1, x + 1)] - h[y * W + Math.max(0, x - 1)], dy = h[Math.min(H - 1, y + 1) * W + x] - h[Math.max(0, y - 1) * W + x];
      var nx = -dx * 0.5, ny = -dy * 0.5, l = Math.sqrt(nx * nx + ny * ny + 1);
      px[i * 4] = (nx / l * 0.5 + 0.5) * 255; px[i * 4 + 1] = (ny / l * 0.5 + 0.5) * 255;
      px[i * 4 + 2] = h[i] / mx * 255; px[i * 4 + 3] = Math.max(0, Math.min(255, 128 + (h[i] - lo[i]) / (unit * 0.3) * 127));
    }
    return { px: px, tm: tm, W: W, H: H, mx: mx };
  }

  var gl, cvs, loc, prog, panels = [], ok = false;
  var FS = "precision highp float;varying vec2 v;uniform sampler2D t;uniform sampler2D m;uniform vec2 size;uniform vec3 light;uniform vec3 base;uniform vec3 lit;uniform float mx;uniform vec4 k;uniform vec3 vg;uniform vec3 word;uniform float metal;uniform vec4 shc;" +
    "void main(){vec4 s=texture2D(t,v);vec3 n;n.xy=s.rg*2.-1.;n.z=sqrt(max(.02,1.-dot(n.xy,n.xy)));vec2 p=v*size;float h=s.b*mx;" +
    "vec3 tl=vec3(light.xy-p,light.z-h);float dist=length(tl);vec3 L=tl/dist;vec3 K=normalize(vec3(-.5,-.75,.62));" +
    "float sh=1.;vec2 dir=normalize(L.xy+1e-4);float slope=L.z/max(.12,length(L.xy));" +
    "for(int i=1;i<=12;i++){float k=float(i)*mx*.11;vec2 q=(p+dir*k)/size;float hh=texture2D(t,q).b*mx;sh=min(sh,1.-clamp((hh-(h+k*slope)-.6)/(mx*.16),0.,1.));}" +
    "float ao=mix(vg.z,1.12,smoothstep(.12,.72,s.a));float att=1./(1.+pow(dist/(length(size)*.5),2.)*2.2);" +
    "float d1=max(dot(n,L),0.)*sh*att;float d2=max(dot(n,K),0.);vec3 V=vec3(0.,0.,1.);" +
    "float sp=pow(max(dot(n,normalize(L+V)),0.),38.)*sh*att;float sp2=pow(max(dot(n,normalize(K+V)),0.),26.);" +
    "vec3 alb=mix(base*mix(.8,.97,shc.a),mix(base,lit,.3),smoothstep(.1,1.,s.b));" +
    "float w=texture2D(m,v).r;float mt=.5+.5*sin(n.y*5.+n.x*3.5+(v.y*7.+v.x*5.+light.x/size.x*3.));alb=mix(alb,mix(word,word*mix(vec3(.62),vec3(1.5),mt),metal),w);d2=mix(d2,d2*.95+.22,w);vec3 tone=mix(vec3(k.x+k.y*d2)*ao,mix(shc.rgb,vec3(1.04),clamp((k.x+k.y*d2)*mix(ao,1.,.15),0.,1.1)),shc.a);vec3 c=alb*tone+(alb*lit*d1*1.9*ao*(1.-w*.55)+alb*d1*1.1*ao*(1.-w*.35))*k.z+lit*(sp*.5+sp2*.13)*max(k.w,w*metal);" +
    "vec2 q=v-.5;c*=1.-dot(q,q)*vg.x;c=c/(1.+c*vg.y);float g=fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5);c+=(g-.5)*.012;gl_FragColor=vec4(c,1.);}";
  function init() {
    cvs = document.createElement("canvas");
    gl = cvs.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
    if (!gl) return false;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}"));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    } catch (e) { return false; }
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.bindAttribLocation(prog, 0, "a"); gl.linkProgram(prog); gl.useProgram(prog); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(prog, "m"), 1); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); loc = {}; ["size", "light", "base", "lit", "mx", "k", "vg", "word", "metal", "shc"].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
    return true;
  }

  function build(p) {
    var r = p.el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
    var dpr = Math.min(devicePixelRatio || 1, 1.5), s = Math.min(dpr, Math.sqrt(820000 / (r.width * r.height)));
    var W = Math.round(r.width * s), H = Math.round(r.height * s);
    p.box = p.opts.layout ? p.opts.layout(r.width, r.height) : null;
    if (p.box) { p.opts.box = p.box.box; p.lines = p.box.lines || p.lines; p.opts.scale = p.box.scale || p.opts.scale; }
    var k = bake(p, W, H);
    if (p.tex) gl.deleteTexture(p.tex);
    p.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, p.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, k.px);
    [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(function (a) { gl.texParameteri(gl.TEXTURE_2D, a[0], a[1]); });
    if (p.tex2) gl.deleteTexture(p.tex2);
    p.tex2 = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, p.tex2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, W, H, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, k.tm);
    [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(function (a) { gl.texParameteri(gl.TEXTURE_2D, a[0], a[1]); });
    gl.activeTexture(gl.TEXTURE0);
    p.W = p.el.width = W; p.H = p.el.height = H; p.mx = k.mx; p.cssW = r.width; p.cssH = r.height; p.ready = true; p.last = null;
    p.el.classList.add("is-lit");
  }

  function draw(p, time) {
    var tx, ty;
    if (p.mouse) { tx = p.mouse[0]; ty = p.mouse[1]; }
    else { var r = p.el.getBoundingClientRect(), prog2 = (innerHeight - r.top) / (innerHeight + r.height); tx = 0.5 + 0.42 * Math.sin(time * 0.00032 + p.phase); ty = 0.1 + prog2 * 0.6; }
    if (REDUCED) { tx = 0.3; ty = 0.2; }
    if (!p.cur) p.cur = [tx, ty];
    p.cur[0] += (tx - p.cur[0]) * 0.09; p.cur[1] += (ty - p.cur[1]) * 0.09;
    if (p.last && Math.abs(p.last[0] - p.cur[0]) + Math.abs(p.last[1] - p.cur[1]) < 0.0006) return;
    p.last = [p.cur[0], p.cur[1]];
    if (cvs.width !== p.W || cvs.height !== p.H) { cvs.width = p.W; cvs.height = p.H; }
    gl.viewport(0, 0, p.W, p.H); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, p.tex2); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, p.tex);
    var m = MAT[p.kind], mn = Math.sqrt(p.W * p.H);
    gl.uniform2f(loc.size, p.W, p.H); gl.uniform3f(loc.light, p.cur[0] * p.W, p.cur[1] * p.H, mn * 0.3);
    gl.uniform3fv(loc.base, m.base); gl.uniform3fv(loc.lit, m.lit); gl.uniform1f(loc.mx, p.mx); gl.uniform4fv(loc.k, TH.k); gl.uniform3fv(loc.vg, TH.v); gl.uniform3fv(loc.word, m.word); gl.uniform1f(loc.metal, TH.metal || 0); var q = m.sh || [0, 0, 0]; gl.uniform4f(loc.shc, q[0], q[1], q[2], m.sh ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    p.ctx.drawImage(cvs, 0, 0);
  }

  var io, running = false, tick = 0;
  function loop(t) {
    tick++;
    var any = false;
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i]; if (!p.visible) continue; any = true;
      if (!p.ready) { build(p); break; }
      if (p.mouse || tick % 2 === i % 2 || !p.last) draw(p, t);
    }
    if (any && !document.hidden) requestAnimationFrame(loop); else running = false;
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function add(el, kind, lines, opts) {
    var p = { el: el, kind: kind, lines: lines, opts: opts || {}, ctx: el.getContext("2d"), phase: panels.length * 2.1 };
    panels.push(p);
    var host = opts.host || el;
    host.addEventListener("pointermove", function (e) { if (e.pointerType === "touch") return; var r = el.getBoundingClientRect(); p.mouse = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; wake(); });
    host.addEventListener("pointerleave", function () { p.mouse = null; });
    io.observe(el);
  }
  function start() {
    ok = init();
    if (!ok) { document.documentElement.classList.add("no-relief"); return false; }
    io = new IntersectionObserver(function (es) { es.forEach(function (e) { panels.forEach(function (p) { if (p.el === e.target) { p.visible = e.isIntersecting; } }); }); wake(); }, { rootMargin: "120px" });
    document.addEventListener("visibilitychange", wake);
    addEventListener("scroll", wake, { passive: true });
    var to; addEventListener("resize", function () { clearTimeout(to); to = setTimeout(function () { panels.forEach(function (p) { var r = p.el.getBoundingClientRect(); if (p.ready && (Math.abs(r.width - p.cssW) > 8 || Math.abs(r.height - p.cssH) > 90)) p.ready = false; }); wake(); }, 250); });
    cvs.addEventListener("webglcontextlost", function () { document.documentElement.classList.add("no-relief"); panels = []; });
    return true;
  }
  return { start: start, add: add };
})();
