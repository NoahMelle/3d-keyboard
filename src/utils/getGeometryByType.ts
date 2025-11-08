import * as THREE from "three";

import { GLTFResult } from "@/components/organisms/Keyboard";
import { TGeometryType } from "@/hooks/useKeyboardLayout";

const getGeometryByType = (
  geometryType: TGeometryType,
  nodes: GLTFResult["nodes"]
): THREE.Mesh["geometry"] => {
  switch (geometryType) {
    case "full":
      return nodes.fullSizeKey.geometry;
    case "leftToBlack":
      return nodes.leftToBlackMesh.geometry;
    case "middle":
      return nodes.middleKeyMesh.geometry;
    case "rightToBlack":
      return nodes.rightToBlackMesh.geometry;
  }
};

export { getGeometryByType };
