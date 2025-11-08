import { createContext } from "react";

import { IKeyEvent } from "@/context/MidiContext/provider";
import { IParsedMidiMessage } from "@/utils/parseMidiMessage";

export interface IMidiContext {
  midiAccess: MIDIAccess | null;
  permissionState: PermissionState | null;
  lastMessage: IParsedMidiMessage | null;
  lastKeyEvent: IKeyEvent | null;
}

export const MidiContext = createContext<IMidiContext | null>(null);
