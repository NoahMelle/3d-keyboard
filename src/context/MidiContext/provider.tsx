import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const { command, channel, note, velocity } = lastMessage;

    if ((command !== 8 && command !== 9) || channel !== 0) {
      return;
    }

    setLastKeyEvent({
      direction: command === 8 ? "up" : "down",
      note,
      velocity,
    });
  }, [lastMessage]);

  useEffect(() => {
    const requestMIDIAccess = async () => {
      console.log("Requesting midi access...");

      navigator
        .requestMIDIAccess()
        .then((access) => setMidiAccess(access), onMIDIFailure);
    };

    requestMIDIAccess();
  }, []);

  useEffect(() => {
    queryPermission();

    if (!midiAccess) {
      return;
    }

    midiAccess.inputs.forEach((input) => {
      input.onmidimessage = onMidiMessage;
    });
  }, [midiAccess]);

  useEffect(() => {}, []);

  return (
    <MidiContext.Provider
      value={{ midiAccess, permissionState, lastMessage, lastKeyEvent }}
    >
      {children}
    </MidiContext.Provider>
  );
}
