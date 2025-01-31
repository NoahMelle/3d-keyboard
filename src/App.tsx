import Scene from "./Scene";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import {
    Environment,
    CameraControls,
    PerspectiveCamera,
} from "@react-three/drei";

function App() {
    return (
        <Canvas>
            <Environment
                files="/assets/hdris/lebombo_1k.exr"
                environmentIntensity={0.8}
            />
            <ambientLight intensity={0.5} />
            <PerspectiveCamera makeDefault position={[.6, .6, 1]} />
            <CameraControls
                mouseButtons={{ left: 0, middle: 1, right: 2, wheel: 0 }}
            />
            <Scene />
        </Canvas>
    );
}

export default App;
