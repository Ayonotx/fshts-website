/* ============================================================
   FSHTS — 3D hero scene (Three.js)
   A glowing golden core of light, ringed by particles — the
   torch of knowledge from the school crest, rendered in motion.
   Falls back gracefully to the CSS gradient if WebGL/Three.js is unavailable.
   ============================================================ */
(function () {
  "use strict";

  function init() {
    if (typeof THREE === "undefined") return;
    var canvas = document.querySelector(".hero__canvas");
    if (!canvas) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isSmall = window.innerWidth < 700;
    var DENSITY = reduced ? 0 : isSmall ? 900 : 1800; // main sphere particles

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) {
      return; // WebGL unavailable — CSS gradient hero remains
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b18, 0.0016);

    var camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 26);

    /* --- soft glow sprite texture --- */
    function glowTexture() {
      var c = document.createElement("canvas");
      c.width = c.height = 64;
      var g = c.getContext("2d");
      var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,244,214,1)");
      grad.addColorStop(0.25, "rgba(246,196,83,0.85)");
      grad.addColorStop(0.6, "rgba(240,180,41,0.25)");
      grad.addColorStop(1, "rgba(240,180,41,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    var sprite = glowTexture();

    /* --- 1. Sphere of light: golden particles on a sphere --- */
    var sphereGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(DENSITY * 3);
    var col = new Float32Array(DENSITY * 3);
    var c1 = new THREE.Color(0xf6c453), c2 = new THREE.Color(0xc9902a), c3 = new THREE.Color(0xfff3d6);
    for (var i = 0; i < DENSITY; i++) {
      // Fibonacci sphere distribution
      var t = i / (DENSITY - 1);
      var y = 1 - t * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var phi = i * 2.399963; // golden angle
      var R = 9 + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(phi) * r * R;
      pos[i * 3 + 1] = y * R;
      pos[i * 3 + 2] = Math.sin(phi) * r * R;
      var cc = Math.random() < 0.12 ? c3 : Math.random() < 0.5 ? c1 : c2;
      col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
    }
    sphereGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    sphereGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    var sphere = new THREE.Points(sphereGeo, new THREE.PointsMaterial({
      size: isSmall ? 0.16 : 0.13, map: sprite, vertexColors: true,
      transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
    scene.add(sphere);

    /* --- 2. Inner glowing core --- */
    var core = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xf0b429, transparent: true, opacity: 0.55 })
    );
    scene.add(core);
    var halo = new THREE.Mesh(
      new THREE.SphereGeometry(3.6, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffe9ae, transparent: true, opacity: 0.12 })
    );
    scene.add(halo);

    /* --- 3. Wireframe icosahedron cage --- */
    var cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(11.5, 1)),
      new THREE.LineBasicMaterial({ color: 0xf6c453, transparent: true, opacity: 0.16 })
    );
    scene.add(cage);

    /* --- 4. Orbiting ring of light (like a discipline band) --- */
    var ringCount = isSmall ? 240 : 520;
    var ringGeo = new THREE.BufferGeometry();
    var rpos = new Float32Array(ringCount * 3);
    for (var j = 0; j < ringCount; j++) {
      var ang = Math.random() * Math.PI * 2;
      var rr = 13.4 + (Math.random() - 0.5) * 1.4;
      rpos[j * 3] = Math.cos(ang) * rr;
      rpos[j * 3 + 1] = (Math.random() - 0.5) * 0.5;
      rpos[j * 3 + 2] = Math.sin(ang) * rr;
    }
    ringGeo.setAttribute("position", new THREE.BufferAttribute(rpos, 3));
    var ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({
      size: 0.22, map: sprite, color: 0xffd97a,
      transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    ring.rotation.x = 0.5;
    scene.add(ring);

    /* --- 5. Ambient dust across the scene --- */
    var dustCount = isSmall ? 350 : 800;
    var dustGeo = new THREE.BufferGeometry();
    var dpos = new Float32Array(dustCount * 3);
    for (var k = 0; k < dustCount; k++) {
      dpos[k * 3] = (Math.random() - 0.5) * 90;
      dpos[k * 3 + 1] = (Math.random() - 0.5) * 50;
      dpos[k * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.09, map: sprite, color: 0x8fa3c8,
      transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending
    })));

    /* --- interaction: mouse parallax + scroll drift --- */
    var mouseX = 0, mouseY = 0, camX = 0, camY = 0;
    window.addEventListener("pointermove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    var clock = new THREE.Clock();
    var running = true;
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) clock.getDelta();
    });

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);

    function tick() {
      requestAnimationFrame(tick);
      if (!running || reduced) return;
      var el = clock.getElapsedTime();

      sphere.rotation.y = el * 0.05;
      sphere.rotation.x = Math.sin(el * 0.12) * 0.06;
      cage.rotation.y = -el * 0.03;
      cage.rotation.z = el * 0.015;
      ring.rotation.y = el * 0.12;

      // breathing light
      var pulse = 1 + Math.sin(el * 1.4) * 0.06;
      core.scale.setScalar(pulse);
      halo.scale.setScalar(1 + Math.sin(el * 1.4 + 0.6) * 0.1);
      core.material.opacity = 0.45 + Math.sin(el * 1.4) * 0.12;

      // camera parallax
      camX += (mouseX * 3.2 - camX) * 0.04;
      camY += (-mouseY * 2.2 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY + Math.sin(el * 0.3) * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    resize();
    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
