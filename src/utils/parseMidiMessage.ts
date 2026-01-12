export interface IParsedMidiMessage {
  command: number;
  channel: number;
  note: number;
  velocity: number;
}

const parseMidiMessage = (
  message: MIDIMessageEvent
): IParsedMidiMessage | null => {
  if (!message.data || message.data.length < 2) {
    return null;
  }

  const command = message.data[0] >> 4;
  const channel = message.data[0] & 0xf;
  const note = message.data[1];
  // Velocity defaults to 0 if not provided (for Note Off messages)
  const velocity = (message.data[2] ?? 0) / 127;

  return {
    command,
    channel,
    note,
    velocity,
  };
};
export { parseMidiMessage };
