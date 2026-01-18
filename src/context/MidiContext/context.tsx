import { createContext } from "react";

export interface IMidiContext {
  midiAccess: MIDIAccess | null;
  permissionState: PermissionState | null;
  registerKeyPress: (
    noteId: number,
    pressHandler: (velocity: number) => void,
    releaseHandler?: () => void
  ) => () => void;
}

export const MidiContext = createContext<IMidiContext | null>(null);
