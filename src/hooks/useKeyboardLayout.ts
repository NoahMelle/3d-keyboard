import { useMemo } from "react";

export type TGeometryType = "full" | "middle" | "leftToBlack" | "rightToBlack";

interface KeyLayout {
  id: string;
  xPos: number;
  geometryType: TGeometryType;
}

interface BlackKeyLayout {
  id: string;
  xPos: number;
}

interface KeyboardLayoutConfig {
  whiteKeyCount?: number;
  blackKeyCount?: number;
  startingOctave?: number;
  startingKey?: number;
}

const indexToNote = (index: number): string => {
  const noteMap = ["c", "d", "e", "f", "g", "a", "b"];
  return noteMap[index] || "c";
};

export const useKeyboardLayout = (
  whiteKeyWidth: number,
  allWhiteKeysLength: number,
  config: KeyboardLayoutConfig = {}
) => {
  const {
    whiteKeyCount = 19,
    blackKeyCount = 17,
    startingOctave = 4,
    startingKey = 3,
  } = config;

  const whiteKeys = useMemo(() => {
    const keys: KeyLayout[] = [];

    for (let i = 0; i < whiteKeyCount; i++) {
      const geometryIndex = i % 7;

      // Determine geometry type based on position in octave
      const middleKeys = [1, 2, 5];
      const leftToBlackKeys = [0, 4];
      const rightToBlackKeys = [3, 6];

      let geometryType: KeyLayout["geometryType"] = "full";

      if (i === whiteKeyCount - 1) {
        geometryType = "full";
      } else if (middleKeys.includes(geometryIndex)) {
        geometryType = "middle";
      } else if (leftToBlackKeys.includes(geometryIndex)) {
        geometryType = "leftToBlack";
      } else if (rightToBlackKeys.includes(geometryIndex)) {
        geometryType = "rightToBlack";
      }

      // Calculate position
      const xPos =
        i * whiteKeyWidth - allWhiteKeysLength / 2 + 0.5 * whiteKeyWidth;

      // Generate note ID
      const fullKey = startingKey + i;
      const octave = Math.floor(fullKey / 7) + startingOctave;
      const note = indexToNote(fullKey % 7);
      const id = `${note}${octave}`;

      keys.push({ id, xPos, geometryType });
    }

    return keys;
  }, [
    whiteKeyWidth,
    allWhiteKeysLength,
    whiteKeyCount,
    startingOctave,
    startingKey,
  ]);

  const blackKeys = useMemo(() => {
    const keys: BlackKeyLayout[] = [];
    const blackKeyPositions = [0, 1, 2, 4, 5]; // Positions in octave that have black keys

    for (let i = 0; i < blackKeyCount; i++) {
      const geometryIndex = i % 7;

      // Skip positions that don't have black keys
      if (!blackKeyPositions.includes(geometryIndex)) {
        continue;
      }

      // Calculate position
      const xPos =
        i * whiteKeyWidth - (allWhiteKeysLength - whiteKeyWidth * 2) / 2;

      // Generate note ID
      const fullKey = i + startingKey;
      const octave = Math.floor(fullKey / 7) + startingOctave;
      const note = indexToNote(fullKey % 7);
      const id = `${note}-sharp${octave}`;

      keys.push({ id, xPos });
    }

    return keys;
  }, [
    whiteKeyWidth,
    allWhiteKeysLength,
    blackKeyCount,
    startingOctave,
    startingKey,
  ]);

  return { whiteKeys, blackKeys };
};
