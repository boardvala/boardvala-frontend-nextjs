"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";

// LED Frame 3D Model
function LEDFrame({ photoTexture, frameTexture, ledOn }) {
  const frameRef = useRef();

  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  const frameW = 2.2;
  const frameH = 2.8;
  const frameD = 0.05;
  const photoW = frameW - 0.16;
  const photoH = frameH - 0.16;

  return (
    <group ref={frameRef}>
      {/* Layer 1: Thin box (depth) */}
      <RoundedBox args={[frameW, frameH, frameD]} radius={0.01} smoothness={4}>
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Layer 2: Frame image (border) */}
      {frameTexture && (
        <mesh position={[0, 0, frameD / 2 + 0.001]}>
          <planeGeometry args={[frameW, frameH]} />
          <meshBasicMaterial map={frameTexture} toneMapped={false} />
        </mesh>
      )}

      {/* Layer 3: User photo (ON TOP — covers white center!) */}
      {photoTexture && (
        <mesh position={[0, 0, frameD / 2 + 0.003]}>
          <planeGeometry args={[photoW, photoH]} />
          <meshBasicMaterial
            map={photoTexture}
            toneMapped={false}
            color={ledOn ? "#ffffff" : "#666666"}
          />
        </mesh>
      )}
    </group>
  );
}
// Wall background
function Wall() {
  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[14, 10]} />
      <meshBasicMaterial color="#3a3a3e" />
    </mesh>
  );
}

// Main 3D Preview Component
export default function LED3DPreview({ photoSrc, onClose }) {
  const [ledOn, setLedOn] = useState(true);

  // Load photo as texture
  const photoTexture = useMemo(() => {
    if (!photoSrc) return null;
    const texture = new THREE.TextureLoader().load(photoSrc);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [photoSrc]);

  const frameTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load("/studio/led-frame.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div>
          <h5 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
            <i className="bi bi-badge-3d me-2"></i>3D Preview
          </h5>
          <small style={{ color: "rgba(255,255,255,0.5)" }}>
            Drag to rotate • Scroll to zoom • Pinch on mobile
          </small>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          ✕
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={ledOn ? 1.5 : 0.6} />
        <directionalLight position={[3, 4, 5]} intensity={ledOn ? 0.8 : 0.3} />
        {ledOn && (
          <rectAreaLight
            width={3}
            height={4}
            intensity={2}
            color="#fff8e8"
            position={[0, 0, -0.3]}
            rotation={[0, 0, 0]}
          />
        )}

        <LEDFrame
          photoTexture={photoTexture}
          frameTexture={frameTexture}
          ledOn={ledOn}
        />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Controls — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setLedOn(!ledOn)}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: ledOn ? "#fbbf24" : "#374151",
            color: ledOn ? "#1b263b" : "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
          }}
        >
          {ledOn ? "💡 LED ON" : "🌙 LED OFF"}
        </button>

        <button
          onClick={onClose}
          className="btn btn-light"
          style={{
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          ← Close Preview
        </button>
      </div>
    </div>
  );
}
