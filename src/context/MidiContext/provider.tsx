import { useCallback, useEffect, useRef, useState } from "react";

import { parseMidiMessage } from "@/utils/parseMidiMessage";

import { MidiContext } from "./context";

interface IMidiContextProviderProps {
  children: React.ReactNode;
}

export function MidiContextProvider({ children }: IMidiContextProviderProps) {
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);

  // registered handlers
  const keyPressHandlersRef = useRef<Map<number, (velocity: number) => void>>(
    new Map(),
  );
  const keyReleaseHandlersRef = useRef<Map<number, () => void>>(new Map());

  // track currently active notes
  const activeNotesRef = useRef<Set<number>>(new Set());

  // release all notes that are currently pressed
  const releaseAllNotes = useCallback(() => {
    activeNotesRef.current.forEach((note) => {
      keyReleaseHandlersRef.current.get(note)?.();
    });

    activeNotesRef.current.clear();
  }, []);

  const queryPermission = async () => {
    const result = await navigator.permissions.query({ name: "midi" });
    setPermissionState(result.state);
  };

  const onMIDIFailure = (message: string) => {
    console.error(`Failed to get MIDI access: ${message}`);
  };

  const onMidiMessage = (event: MIDIMessageEvent) => {
    const parsed = parseMidiMessage(event);
    if (!parsed) return;

    const { command, note, velocity } = parsed;

    // only handle note on/off messages
    if (command !== 8 && command !== 9) return;

    const isNoteOff = command === 8 || (command === 9 && velocity === 0);
    const isActive = activeNotesRef.current.has(note);

    if (!isNoteOff) {
      // suppress duplicate note ons
      if (isActive) return;

      activeNotesRef.current.add(note);
      keyPressHandlersRef.current.get(note)?.(velocity);
    } else {
      // suppress stray note offs
      if (!isActive) return;

      activeNotesRef.current.delete(note);
      keyReleaseHandlersRef.current.get(note)?.();
    }
  };

  const registerKeyPress = useCallback(
    (
      noteId: number,
      pressHandler: (velocity: number) => void,
      releaseHandler?: () => void,
    ) => {
      keyPressHandlersRef.current.set(noteId, pressHandler);
      if (releaseHandler) {
        keyReleaseHandlersRef.current.set(noteId, releaseHandler);
      }

      return () => {
        if (activeNotesRef.current.has(noteId)) {
          activeNotesRef.current.delete(noteId);
          keyReleaseHandlersRef.current.get(noteId)?.();
        }

        keyPressHandlersRef.current.delete(noteId);
        keyReleaseHandlersRef.current.delete(noteId);
      };
    },
    [],
  );

  useEffect(() => {
    const requestMIDIAccess = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);
      } catch (error) {
        onMIDIFailure(error instanceof Error ? error.message : String(error));
      }
    };

    requestMIDIAccess();
  }, []);

  useEffect(() => {
    queryPermission();
    if (!midiAccess) return;

    const setupInputs = () => {
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = onMidiMessage;
      });
    };

    setupInputs();

    const handleStateChange = () => {
      // If device is unplugged, release all notes
      releaseAllNotes();
      setupInputs();
    };

    midiAccess.addEventListener("statechange", handleStateChange);

    return () => {
      releaseAllNotes();
      midiAccess.removeEventListener("statechange", handleStateChange);
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
    };
  }, [midiAccess, releaseAllNotes]);

  // browser safety to release notes when tab is hidden or window loses focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) releaseAllNotes();
    };

    const handleBlur = () => releaseAllNotes();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [releaseAllNotes]);

  return (
    <MidiContext.Provider
      value={{
        midiAccess,
        permissionState,
        registerKeyPress,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}
