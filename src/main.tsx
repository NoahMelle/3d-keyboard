import "./index.css";

import { Canvas } from "@react-three/fiber";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import SynthesizerControls from "@/components/organisms/SynthesizerControls";
import { MidiContextProvider } from "@/context/MidiContext/provider.tsx";
import { SynthesizerContextProvider } from "@/context/SynthesizerContext/provider.tsx";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="relative h-screen w-full">
      <MidiContextProvider>
        <SynthesizerContextProvider>
          <Suspense fallback={"Loading..."}>
            <Canvas shadows>
              <App />
            </Canvas>
          </Suspense>
          <SynthesizerControls />
          <p className="absolute bottom-8 text-center left-1/2 -translate-x-1/2 w-full max-w-3xl">
            A playable 3D piano keyboard made with React, Three.js, and
            TypeScript. <br />
            Use the left mouse button to play the keys and the right or middle
            mouse button to rotate the camera.
          </p>
        </SynthesizerContextProvider>
      </MidiContextProvider>
    </div>
  </StrictMode>
);
