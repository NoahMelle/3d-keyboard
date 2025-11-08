import { useMemo } from "react";

export type TGeometryType = "full" | "middle" | "leftToBlack" | "rightToBlack";

interface KeyLayout {
  id: number;
  xPos: number;
  geometryType: TGeometryType;
}

interface BlackKeyLayout {
  id: number;
  xPos: number;
}

interface KeyboardLayoutConfig {
  whiteKeyCount?: number;
  blackKeyCount?: number;
  startingOctave?: number;
  startingKey?: number;
}

export const useKeyboardLayout = (
  whiteKeyWidth: number,
  allWhiteKeysLength: number,
  config: KeyboardLayoutConfig = {}
) => {
  const {
    whiteKeyCount = 19,
    blackKeyCount = 17,
    startingOctave = 4,
    startingKey = 3, // Starting at F (semitone 5 in an octave)
  } = config;

  const whiteKeys = useMemo(() => {
    const keys: KeyLayout[] = [];
    // White key semitones: C=0, D=2, E=4, F=5, G=7, A=9, B=11
    const whiteKeySemitones = [0, 2, 4, 5, 7, 9, 11];

    for (let i = 0; i < whiteKeyCount; i++) {
      const geometryIndex = i % 7;

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

      const xPos =
        i * whiteKeyWidth - allWhiteKeysLength / 2 + 0.5 * whiteKeyWidth;

      // Calculate MIDI note
      const keyInOctave = (startingKey + i) % 7;
      const octavesFromStart = Math.floor((startingKey + i) / 7);
      const octave = startingOctave + octavesFromStart;
      const semitone = whiteKeySemitones[keyInOctave];
      const id = octave * 12 + semitone;

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
    const blackKeyPositions = [0, 1, 2, 4, 5]; // Positions in the 7-white-key pattern
    // Black key semitones: C#=1, D#=3, F#=6, G#=8, A#=10

    for (let i = 0; i < blackKeyCount; i++) {
      const geometryIndex = i % 7;

      if (!blackKeyPositions.includes(geometryIndex)) {
        continue;
      }

      const xPos =
        i * whiteKeyWidth - (allWhiteKeysLength - whiteKeyWidth * 2) / 2;

      // Calculate which white key we're associated with
      const keyInOctave = (startingKey + i) % 7;
      const octavesFromStart = Math.floor((startingKey + i) / 7);
      const octave = startingOctave + octavesFromStart;

      // Map the key index (0-6) to the black key semitone
      // C(0)→C#(1), D(1)→D#(3), E(2) -> skip, F(3)→F#(6), G(4)→G#(8), A(5)→A#(10), B(6)→skip
      const whiteKeyToBlackSemitone: { [key: number]: number } = {
        0: 1, // C → C#
        1: 3, // D → D#
        3: 6, // E → F#
        4: 8, // G → G#
        5: 10, // A → A#
      };

      const semitone = whiteKeyToBlackSemitone[keyInOctave];
      const id = octave * 12 + semitone;

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
