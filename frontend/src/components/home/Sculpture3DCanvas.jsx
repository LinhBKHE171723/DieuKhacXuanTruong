import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Sculpture3DCanvas({ images = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd4af37, 3, 20);
    goldLight.position.set(4, 3, 5);
    scene.add(goldLight);

    const warmSpotlight = new THREE.DirectionalLight(0xffe8d1, 2.5);
    warmSpotlight.position.set(-5, 6, 6);
    scene.add(warmSpotlight);

    // Golden Dust Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      particleScales[i] = Math.random() * 0.08 + 0.02;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xdfb44b,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 3D Floating Art Panels Group
    const group = new THREE.Group();
    scene.add(group);

    const textureLoader = new THREE.TextureLoader();
    const meshes = [];

    // Fallback or demo image URLs
    const sampleUrls = images.length > 0
      ? images.slice(0, 3)
      : [
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&auto=format&fit=crop"
        ];

    const planePositions = [
      { x: -2.8, y: 0.2, z: 0.5, rotY: 0.18, scale: 1.1 },
      { x: 0, y: 0, z: 1.2, rotY: 0, scale: 1.35 },
      { x: 2.8, y: -0.2, z: 0.5, rotY: -0.18, scale: 1.1 }
    ];

    sampleUrls.forEach((url, idx) => {
      const posConfig = planePositions[idx % planePositions.length];
      
      textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;

          const geometry = new THREE.PlaneGeometry(2.4, 1.6, 32, 32);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(posConfig.x, posConfig.y, posConfig.z);
          mesh.rotation.y = posConfig.rotY;
          mesh.scale.setScalar(posConfig.scale);

          // Subtle gold border frame mesh behind
          const frameGeometry = new THREE.PlaneGeometry(2.46, 1.66);
          const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xc59b27,
            metalness: 0.8,
            roughness: 0.3
          });
          const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
          frameMesh.position.set(0, 0, -0.01);
          mesh.add(frameMesh);

          group.add(mesh);
          meshes.push({ mesh, basePos: { ...posConfig } });
        },
        undefined,
        (err) => {
          console.warn("Failed to load texture for 3D panel", err);
        }
      );
    });

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2;
      targetMouseY = -((e.clientY - rect.top) / container.clientHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (LERP)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Group tilt effect
      group.rotation.y = currentMouseX * 0.25 + Math.sin(elapsedTime * 0.5) * 0.03;
      group.rotation.x = -currentMouseY * 0.15 + Math.cos(elapsedTime * 0.6) * 0.02;

      // Floating wave animation for individual panels
      meshes.forEach(({ mesh, basePos }, i) => {
        mesh.position.y = basePos.y + Math.sin(elapsedTime * 1.2 + i * 1.5) * 0.08;
      });

      // Animate particles
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Light movement
      goldLight.position.x = Math.sin(elapsedTime * 0.8) * 3;
      goldLight.position.y = Math.cos(elapsedTime * 0.5) * 2 + 3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="sculpture-3d-canvas"
      aria-label="3D Exhibition Stage"
    />
  );
}
