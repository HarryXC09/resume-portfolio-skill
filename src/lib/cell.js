import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { asset } from "./motion";
import { createParticles } from "./particles";
export async function mountCell(canvas, section, reduced, onReady) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.75),
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(32, 1, 0.01, 30),
    rig = new THREE.Group();
  scene.add(rig);
  RectAreaLightUniformsLib.init();
  scene.add(new THREE.HemisphereLight(0xc4d5e5, 0x41444c, 1.15));
  for (const [color, power, pos] of [
    [0xd9eaff, 5, [-1.5, 2, 2]],
    [0xe2edff, 1.6, [1.6, 0.4, 1]],
    [0xffeee0, 4, [0.4, 1.8, -1.3]],
  ]) {
    const light = new THREE.RectAreaLight(color, power, 3, 3);
    light.position.set(...pos);
    light.lookAt(0, 0, 0);
    scene.add(light);
  }
  let model;
  try {
    model = (
      await new GLTFLoader().loadAsync(asset("models/tumor-cell-default.glb"))
    ).scene;
  } catch (e) {
    renderer.dispose();
    throw e;
  }
  rig.add(model);
  const particles = createParticles(innerWidth < 768, renderer.getPixelRatio());
  scene.add(particles.points);
  let particleTime = 0;
  let active = false,
    frames = 0,
    auto = 0,
    followX = 0,
    followY = 0,
    targetX = 0,
    targetY = 0,
    yaw = 0,
    pitch = 0,
    drag = false,
    lastX = 0,
    lastY = 0,
    last = performance.now(),
    fps = 0,
    count = 0,
    start = last;
  const resize = () => {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(
      0,
      0.24,
      Math.max(
        2.15,
        1.15 / (2 * Math.tan(THREE.MathUtils.degToRad(16)) * camera.aspect),
      ),
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  function render(now) {
    let dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced && !drag) auto += dt * 0.018;
    followX += (targetX - followX) * 0.08;
    followY += (targetY - followY) * 0.08;
    const rect = section.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(
      (innerHeight - rect.top) / (innerHeight + rect.height),
      0,
      1,
    );
    rig.rotation.set(
      pitch + followX,
      yaw + auto + followY + (reduced ? 0 : (progress - 0.5) * 0.12),
      0,
    );
    rig.scale.setScalar(reduced ? 1 : 0.96 + progress * 0.08);
    rig.position.y = reduced ? 0 : (progress - 0.5) * 0.04;
    if (!reduced) {
      particleTime += dt;
      particles.material.uniforms.uTime.value = particleTime;
      particles.material.uniforms.uFollow.value.set(followY, -followX);
    }
    renderer.render(scene, camera);
    frames++;
    count++;
    if (now - start > 1000) {
      fps = (count * 1000) / (now - start);
      start = now;
      count = 0;
    }
  }
  function loop() {
    renderer.setAnimationLoop(
      active && !document.hidden && !reduced ? render : null,
    );
    if (active && reduced) render(performance.now());
  }
  const io = new IntersectionObserver(([e]) => {
    active = e.isIntersecting;
    last = performance.now();
    loop();
  });
  io.observe(section);
  document.addEventListener("visibilitychange", loop);
  const down = (e) => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const r = canvas.getBoundingClientRect();
    if (drag) {
      yaw += (e.clientX - lastX) * 0.003;
      pitch = THREE.MathUtils.clamp(
        pitch + (e.clientY - lastY) * 0.003,
        -0.5,
        0.5,
      );
      lastX = e.clientX;
      lastY = e.clientY;
      if (reduced) render(performance.now());
    } else if (!reduced && e.pointerType !== "touch") {
      targetY = (((e.clientX - r.left) / r.width) * 2 - 1) * 0.175;
      targetX = (((e.clientY - r.top) / r.height) * 2 - 1) * 0.087;
    }
  };
  const up = () => {
    drag = false;
  };
  const leave = () => {
    targetX = targetY = 0;
  };
  const key = (e) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
      return;
    e.preventDefault();
    if (e.key === "ArrowLeft") yaw -= 0.07;
    if (e.key === "ArrowRight") yaw += 0.07;
    if (e.key === "ArrowUp") pitch -= 0.07;
    if (e.key === "ArrowDown") pitch += 0.07;
    render(performance.now());
  };
  const handlers = {
    pointerdown: down,
    pointermove: move,
    pointerup: up,
    pointercancel: up,
    lostpointercapture: up,
    pointerleave: leave,
    keydown: key,
  };
  Object.entries(handlers).forEach(([k, v]) => canvas.addEventListener(k, v));
  window.cellQA = () => ({
    loaded: true,
    active,
    frames,
    fps,
    auto,
    followX,
    followY,
    yaw,
    pitch,
    reduced,
    dpr: renderer.getPixelRatio(),
    triangles: renderer.info.render.triangles,
    drawCalls: renderer.info.render.calls,
    rotation: rig.rotation.toArray(),
    scale: rig.scale.x,
    particleCount: particles.count,
    particleSizeLevels: particles.sizeLevels,
    particleTime,
  });
  onReady();
  return () => {
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", loop);
    Object.entries(handlers).forEach(([k, v]) =>
      canvas.removeEventListener(k, v),
    );
    renderer.setAnimationLoop(null);
    particles.dispose();
    model.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        for (const m of [o.material].flat()) {
          m.map?.dispose();
          m.dispose();
        }
      }
    });
    renderer.dispose();
    delete window.cellQA;
  };
}

