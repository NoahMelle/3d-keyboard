import Scene from "./Scene";
import "./App.css";
import {
    Environment,
    CameraControls,
    PerspectiveCamera,
} from "@react-three/drei";
import { useRef, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function App() {
    const planeRef = useRef<THREE.Mesh | null>(null);
    const cameraControlsRef = useRef<CameraControls>(null);

    useFrame(() => {
        if (
            planeRef.current &&
            cameraControlsRef.current?.colliderMeshes.length === 0
        ) {
            cameraControlsRef.current.colliderMeshes = [planeRef.current];
        }
    });

    return (
        <>
            <Environment environmentIntensity={0.8} preset="apartment" />
            <Plane args={[4, 4]} ref={planeRef} />
            <spotLight castShadow position={[0, 10, 0]} />
            <ambientLight intensity={0.5} />
            <PerspectiveCamera
                makeDefault
                position={[0.6, 0.6, 1]}
                near={0.1}
                far={1000}
            />
            <CameraControls
                mouseButtons={{ left: 0, middle: 1, right: 0, wheel: 0 }}
                ref={cameraControlsRef}
            />
            <Scene />
        </>
    );
}

export default App;

const Plane = forwardRef<THREE.Mesh, { args: [number, number] }>(
    ({ args, ...props }, ref) => {
        return (
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.6, 0]}
                receiveShadow
                ref={ref}
                {...props}
            >
                <planeGeometry args={args} />
                <shadowMaterial transparent opacity={0.1} />
            </mesh>
        );
    }
);
