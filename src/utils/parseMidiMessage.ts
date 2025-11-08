export interface IParsedMidiMessage {
  command: number;
  channel: number;
  note: number;
  velocity: number;
}

const parseMidiMessage = (
  message: MIDIMessageEvent
): IParsedMidiMessage | null => {
  if (!message.data) {
    return null;
  }

  return {
    command: message.data[0] >> 4,
    channel: message.data[0] & 0xf,
    note: message.data[1],
    velocity: message.data[2] / 127,
  };
};
export { parseMidiMessage };
