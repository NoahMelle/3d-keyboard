import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <div className="container">
            <Suspense fallback={"Loading..."}>
                <Canvas shadows>
                    <App />
                </Canvas>
            </Suspense>
            <p className="description">
                A playable 3D piano keyboard made with React, Three.js, and
                TypeScript. <br />
                Use the left mouse button to play the keys and the right or
                middle mouse button to rotate the camera.
            </p>
        </div>
    </StrictMode>
);
