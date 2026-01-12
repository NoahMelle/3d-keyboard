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
  startingNote?: number; // corresponds to MIDI note number
}

// White key semitones: C=0, D=2, E=4, F=5, G=7, A=9, B=11
const WHITE_KEY_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
// Keys that have black keys after them: C, D, F, G, A (indices 0, 1, 3, 4, 5)
const WHITE_KEYS_WITH_BLACK_AFTER = [0, 1, 3, 4, 5];

export const useKeyboardLayout = (
  whiteKeyWidth: number,
  allWhiteKeysLength: number,
  config: KeyboardLayoutConfig = {}
) => {
  const {
    whiteKeyCount = 19,
    startingNote = 60, // default is C4, you can find a conversion table at https://inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
  } = config;

  const whiteKeys = useMemo(() => {
    const keys: KeyLayout[] = [];

    // Calculate starting position in white key pattern (MIDI note 0 would correspond to a C, so we can easily use the modulo operator for this)
    const startingSemitone = startingNote % 12;

    // Config is invalid when the startingNote is a black key
    if (!WHITE_KEY_SEMITONES.includes(startingSemitone)) {
      throw new Error(
        "Error: starting note must be the MIDI number of a white key"
      );
    }

    const startingKeyIndex = WHITE_KEY_SEMITONES.indexOf(startingSemitone);

    for (let i = 0; i < whiteKeyCount; i++) {
      // Get the key index
      const keyInOctave = (startingKeyIndex + i) % 7;

      // Key indices
      const middleKeys = [1, 4, 5]; // D, G, A
      const leftToBlackKeys = [0, 3]; // C, F
      const rightToBlackKeys = [2, 6]; // F, B

      let geometryType: KeyLayout["geometryType"] = "full";

      if (middleKeys.includes(keyInOctave)) {
        if (i === 0) {
          // First key of piano
          geometryType = "leftToBlack";
        } else if (i === whiteKeyCount - 1) {
          // Last key of piano
          geometryType = "rightToBlack";
        } else {
          geometryType = "middle";
        }
      } else if (leftToBlackKeys.includes(keyInOctave)) {
        if (i === whiteKeyCount - 1) {
          // Last key of piano
          geometryType = "full";
        } else {
          geometryType = "leftToBlack";
        }
      } else if (rightToBlackKeys.includes(keyInOctave)) {
        if (i === 0) {
          // First key of piano
          geometryType = "full";
        } else {
          geometryType = "rightToBlack";
        }
      }

      // The center of the screen is also the center of our model, so we have to offset everything
      const xPos =
        i * whiteKeyWidth - allWhiteKeysLength / 2 + 0.5 * whiteKeyWidth;

      // Calculate MIDI note
      const octavesFromStart = Math.floor((startingKeyIndex + i) / 7);
      const baseOctave = Math.floor(startingNote / 12);
      const octave = baseOctave + octavesFromStart;
      const semitone = WHITE_KEY_SEMITONES[keyInOctave];
      const id = octave * 12 + semitone;

      keys.push({ id, xPos, geometryType });
    }

    return keys;
  }, [whiteKeyWidth, allWhiteKeysLength, whiteKeyCount, startingNote]);

  const blackKeys = useMemo(() => {
    const keys: BlackKeyLayout[] = [];

    // Calculate starting position in white key pattern
    const startingSemitone = startingNote % 12;
    const startingKeyIndex = WHITE_KEY_SEMITONES.indexOf(startingSemitone);

    // Map white key index to black key semitone
    const whiteKeyToBlackSemitone: { [key: number]: number } = {
      0: 1, // C → C#
      1: 3, // D → D#
      3: 6, // F → F#
      4: 8, // G → G#
      5: 10, // A → A#
    };

    // Iterate over white keys and skip if white key doesn't have a black key next to it
    for (let i = 0; i < whiteKeyCount - 1; i++) {
      // Get the key index
      const keyInOctave = (startingKeyIndex + i) % 7;

      // Only create black key if this white key has one after it
      if (!WHITE_KEYS_WITH_BLACK_AFTER.includes(keyInOctave)) {
        continue;
      }

      // Position black key between white key i and i+1
      // Use the same base calculation as white keys, but offset by whiteKeyWidth
      const xPos = (i + 1) * whiteKeyWidth - allWhiteKeysLength / 2;

      // Calculate MIDI note
      const octavesFromStart = Math.floor((startingKeyIndex + i) / 7);
      const baseOctave = Math.floor(startingNote / 12);
      const octave = baseOctave + octavesFromStart;
      const semitone = whiteKeyToBlackSemitone[keyInOctave];
      const id = octave * 12 + semitone;

      keys.push({ id, xPos });
    }

    return keys;
  }, [whiteKeyWidth, allWhiteKeysLength, whiteKeyCount, startingNote]);

  return { whiteKeys, blackKeys };
};
