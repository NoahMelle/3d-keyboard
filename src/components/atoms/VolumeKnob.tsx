import * as THREE from "three";

interface IVolumeKnob {
  geometry: THREE.Mesh["geometry"];
  material: THREE.MeshStandardMaterial;
}

const VolumeKnob = ({ geometry, material }: IVolumeKnob) => {
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
      position={[0.33, 0.033, -0.086]}
      scale={[0.018, 0.006, 0.018]}
    />
  );
};

export default VolumeKnob;
