import { nanoid } from "nanoid";
import * as THREE from "three";

interface IKeyboardButtons {
  geometry: THREE.Mesh["geometry"];
  material: THREE.MeshStandardMaterial;
}

const KeyboardButtons = ({ geometry, material }: IKeyboardButtons) => {
  return (
    <group>
      {Array.from({ length: 4 }).map((_, i) => {
        const xOffset = i * 0.04;

        return Array.from({ length: 3 }).map((_, j) => {
          const yOffset = j * 0.025;

          return (
            <mesh
              key={nanoid()}
              castShadow
              receiveShadow
              geometry={geometry}
              material={material}
              position={[-0.345 + xOffset, 0.033, -0.111 + yOffset]}
              scale={[0.014, 0.003, 0.007]}
            />
          );
        });
      })}
    </group>
  );
};

export default KeyboardButtons;
