import { nanoid } from "nanoid";
import * as THREE from "three";

interface IKeyboardKnobs {
  geometry: THREE.Mesh["geometry"];
  material: THREE.MeshStandardMaterial;
}

const KeyboardKnobs = ({ geometry, material }: IKeyboardKnobs) => {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => {
        const xOffset = i * 0.04;

        return (
          <mesh
            key={nanoid()}
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
            position={[-0.162 + xOffset, 0.033, -0.086]}
            scale={[0.01, 0.006, 0.01]}
          />
        );
      })}
    </group>
  );
};

export default KeyboardKnobs;
