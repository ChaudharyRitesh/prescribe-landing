"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Mouse-reactive particle-wave backdrop for the hero.
 * A teal/sky point field drifts like a calm vital-sign monitor: two crossing
 * waves plus a slow radial ripple from center. The camera parallaxes toward
 * the cursor so the field feels alive and three-dimensional.
 *
 * Honors prefers-reduced-motion (single static frame, no listeners) and pauses
 * rendering when the tab is hidden.
 */
export default function ThreeHeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x060b18, 18, 48);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    const baseCam = new THREE.Vector3(0, 5.2, 17);
    camera.position.copy(baseCam);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ── Point grid ──────────────────────────────────────────────────────────
    const cols = 110;
    const rows = 58;
    const sepX = 0.55;
    const sepZ = 0.62;
    const count = cols * rows;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const teal = new THREE.Color(0x14b8a6);
    const sky = new THREE.Color(0x0ea5e9);
    const navy = new THREE.Color(0x1e3a5f);

    // Precompute base x/z and radial distance for each point
    const baseX = new Float32Array(count);
    const baseZ = new Float32Array(count);
    const dist = new Float32Array(count);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const px = (x - cols / 2) * sepX;
        const pz = (z - rows / 2) * sepZ;
        baseX[i] = px;
        baseZ[i] = pz;
        dist[i] = Math.sqrt(px * px + pz * pz);

        positions[i * 3] = px;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pz;

        // Navy -> teal/sky across depth for medical color grading
        const t = z / rows;
        const c = navy.clone().lerp(x % 7 === 0 ? sky : teal, 0.25 + t * 0.55);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    // ── Cursor parallax state ────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }; // target, normalized -1..1
    const cam = { x: 0, y: 0 }; // smoothed

    let frameId = 0;
    let running = true;
    const clock = new THREE.Clock();

    const renderWave = (t: number) => {
      let idx = 0;
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          const px = baseX[idx];
          const pz = baseZ[idx];
          const d = dist[idx];
          const y =
            Math.sin(px * 0.35 + t * 0.6) * 0.45 +
            Math.cos(pz * 0.3 + t * 0.4) * 0.45 +
            // slow radial ripple from center — the "pulse"
            Math.sin(d * 0.5 - t * 1.1) * 0.22 * Math.exp(-d * 0.045);
          posAttr.setY(idx, y);
          idx++;
        }
      }
      posAttr.needsUpdate = true;

      // Smooth camera drift toward cursor (parallax)
      cam.x += (mouse.x - cam.x) * 0.045;
      cam.y += (mouse.y - cam.y) * 0.045;
      camera.position.x = baseCam.x + cam.x * 3.2;
      camera.position.y = baseCam.y - cam.y * 1.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderWave(1.5); // single static frame, no listeners
    } else {
      const animate = () => {
        if (!running) return;
        frameId = requestAnimationFrame(animate);
        renderWave(clock.getElapsedTime());
      };
      animate();

      const onPointerMove = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onVisibility = () => {
        const visible = document.visibilityState === "visible";
        if (visible && !running) {
          running = true;
          clock.start();
          animate();
        } else if (!visible) {
          running = false;
          cancelAnimationFrame(frameId);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        running = false;
        cancelAnimationFrame(frameId);
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    }

    // Reduced-motion cleanup (no animation listeners registered)
    const onResizeStatic = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderWave(1.5);
    };
    window.addEventListener("resize", onResizeStatic);

    return () => {
      window.removeEventListener("resize", onResizeStatic);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-70"
    />
  );
}
