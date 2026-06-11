"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle particle-wave backdrop for the hero section.
 * Renders a slow teal/sky point grid drifting like a calm vital-sign field.
 * Honors prefers-reduced-motion (renders a single static frame) and pauses
 * when the tab is hidden.
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
    scene.fog = new THREE.Fog(0x060b18, 18, 46);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.2, 17);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Point grid
    const cols = 110;
    const rows = 55;
    const sepX = 0.55;
    const sepZ = 0.62;
    const count = cols * rows;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const teal = new THREE.Color(0x14b8a6);
    const sky = new THREE.Color(0x0ea5e9);
    const navy = new THREE.Color(0x1e3a5f);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i * 3] = (x - cols / 2) * sepX;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z - rows / 2) * sepZ;

        // Blend navy -> teal/sky across depth for medical color grading
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
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const posAttr = geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    let frameId = 0;
    let running = true;
    const clock = new THREE.Clock();

    const renderWave = (t: number) => {
      let idx = 0;
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          const px = (x - cols / 2) * sepX;
          const pz = (z - rows / 2) * sepZ;
          posAttr.setY(
            idx,
            Math.sin(px * 0.35 + t * 0.6) * 0.45 +
              Math.cos(pz * 0.3 + t * 0.4) * 0.45
          );
          idx++;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderWave(1.5); // single static frame
    } else {
      const animate = () => {
        if (!running) return;
        frameId = requestAnimationFrame(animate);
        renderWave(clock.getElapsedTime());
      };
      animate();
    }

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !prefersReduced) {
        clock.start();
        frameId = requestAnimationFrame(function loop() {
          if (!running) return;
          frameId = requestAnimationFrame(loop);
          renderWave(clock.getElapsedTime());
        });
      } else {
        cancelAnimationFrame(frameId);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (prefersReduced) renderWave(1.5);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-60"
    />
  );
}
