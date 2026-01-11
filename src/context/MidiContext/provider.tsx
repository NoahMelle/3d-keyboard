import { useCallback, useEffect, useRef, useState } from "react";

import { IParsedMidiMessage, parseMidiMessage } from "@/utils/parseMidiMessage";

import { MidiContext } from "./context";

interface IMidiContextProviderProps {
  children: React.ReactNode;
}

export interface IKeyEvent {
  note: number;
  velocity: number;
  direction: "up" | "down";
}

export function MidiContextProvider({ children }: IMidiContextProviderProps) {
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [lastMessage, setLastMessage] = useState<IParsedMidiMessage | null>(
    null
  );
  const [lastKeyEvent, setLastKeyEvent] = useState<IKeyEvent | null>(null);
  
  // Map of note IDs to press and release handlers
  const keyPressHandlersRef = useRef<Map<number, () => void>>(new Map());
  const keyReleaseHandlersRef = useRef<Map<number, () => void>>(new Map());

  const queryPermission = async () => {
    const result = await navigator.permissions.query({
      name: "midi",
    });

    setPermissionState(result.state);
  };

  const onMIDIFailure = (message: string) => {
    console.log(`Failed to get MIDI access - ${message}`);
  };

  const onMidiMessage = (message: MIDIMessageEvent) => {
    const parsedMessage = parseMidiMessage(message);

    if (!parsedMessage) {
      return;
    }

    setLastMessage(parsedMessage);
  };

  // Register/unregister key press and release handlers
  const registerKeyPress = useCallback(
    (
      noteId: number,
      pressHandler: () => void,
      releaseHandler?: () => void
    ) => {
      keyPressHandlersRef.current.set(noteId, pressHandler);
      if (releaseHandler) {
        keyReleaseHandlersRef.current.set(noteId, releaseHandler);
      }
      // Return cleanup function
      return () => {
        keyPressHandlersRef.current.delete(noteId);
        keyReleaseHandlersRef.current.delete(noteId);
      };
    },
    []
  );

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const { command, channel, note, velocity } = lastMessage;

    // Command 8 = Note Off, Command 9 = Note On
    // Note On with velocity 0 is treated as Note Off
    if (command !== 8 && command !== 9) {
      return;
    }

    const isNoteOff = command === 8 || (command === 9 && velocity === 0);

    const keyEvent: IKeyEvent = {
      direction: isNoteOff ? "up" : "down",
      note,
      velocity,
    };

    setLastKeyEvent(keyEvent);

    // Trigger key press for Note On events (down)
    if (!isNoteOff) {
      const handler = keyPressHandlersRef.current.get(note);
      if (handler) {
        handler();
      }
    } else {
      // Trigger key release for Note Off events (up)
      const handler = keyReleaseHandlersRef.current.get(note);
      if (handler) {
        handler();
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const requestMIDIAccess = async () => {
      console.log("Requesting MIDI access...");

      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);
        console.log("MIDI access granted");
      } catch (error) {
        onMIDIFailure(error instanceof Error ? error.message : String(error));
      }
    };

    requestMIDIAccess();
  }, []);

  useEffect(() => {
    queryPermission();

    if (!midiAccess) {
      return;
    }

    // Set up handlers for existing inputs
    const setupInputHandlers = () => {
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = onMidiMessage;
      });
    };

    setupInputHandlers();

    // Handle new inputs being connected
    const handleStateChange = () => {
      console.log("MIDI device state changed");
      setupInputHandlers();
    };

    midiAccess.addEventListener("statechange", handleStateChange);

    return () => {
      midiAccess.removeEventListener("statechange", handleStateChange);
      // Clean up message handlers
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
    };
  }, [midiAccess]);

  return (
    <MidiContext.Provider
      value={{
        midiAccess,
        permissionState,
        lastMessage,
        lastKeyEvent,
        registerKeyPress,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}
