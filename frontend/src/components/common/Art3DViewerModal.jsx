import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

export function Art3DViewerModal({ open, onClose, imageUrl, title }) {
  const mountRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!open || !imageUrl || !mountRef.current) return;

    const container = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffd700, 4);
    spotLight.position.set(3, 3, 4);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-3, -2, 2);
    scene.add(dirLight);

    // Texture Plane
    let mesh;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;

      const aspect = texture.image.width / texture.image.height;
      const height = 2.2;
      const width = height * aspect;

      const geometry = new THREE.PlaneGeometry(width, height, 64, 64);

      // Subtle bump simulation for depth feel
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.1,
        side: THREE.DoubleSide
      });

      mesh = new THREE.Mesh(geometry, material);

      // Add a metallic gold frame border
      const frameGeom = new THREE.PlaneGeometry(width + 0.08, height + 0.08);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xc59b27,
        metalness: 0.85,
        roughness: 0.25
      });
      const frame = new THREE.Mesh(frameGeom, frameMat);
      frame.position.z = -0.01;
      mesh.add(frame);

      scene.add(mesh);
    });

    // Mouse Drag Controls
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !mesh) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mesh.rotation.y += deltaX * 0.008;
      mesh.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (mesh && isRotating && !isDragging) {
        mesh.rotation.y = Math.sin(time * 0.5) * 0.15;
        mesh.rotation.x = Math.cos(time * 0.4) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [open, imageUrl, isRotating]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="art-3d-modal-overlay" onClick={onClose}>
      <div
        className="art-3d-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="art-3d-modal-header">
          <div>
            <span className="art-3d-badge">3D Sculptural View</span>
            <h3>{title || "Xem tác phẩm 3D đa chiều"}</h3>
          </div>
          <button className="art-3d-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="art-3d-stage-wrapper">
          <div ref={mountRef} className="art-3d-viewport" />
          <div className="art-3d-hint">
            💡 Bấm giữ & kéo chuột để xoay tác phẩm 3D đa chiều trong không gian ánh sáng
          </div>
        </div>

        <footer className="art-3d-modal-footer">
          <button
            className={`art-3d-toggle-btn ${isRotating ? "active" : ""}`}
            onClick={() => setIsRotating(!isRotating)}
          >
            {isRotating ? "⏸ Đứng yên" : "▶ Xoay tự động"}
          </button>
          <button className="art-3d-close-footer-btn" onClick={onClose}>
            Đóng
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
