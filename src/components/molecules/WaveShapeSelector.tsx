import {
  Icon,
  WaveSawtoothIcon,
  WaveSineIcon,
  WaveSquareIcon,
  WaveTriangleIcon,
} from "@phosphor-icons/react";

interface IWaveShapeSelectorProps {
  selectedWaveShape: OscillatorType;
  onValueChange: (waveShape: OscillatorType) => void;
}

export default function WaveShapeSelector({
  selectedWaveShape,
  onValueChange,
}: IWaveShapeSelectorProps) {
  const oscillatorTypes: {
    name: OscillatorType;
    Icon: Icon;
  }[] = [
    {
      name: "sine",
      Icon: WaveSineIcon,
    },
    {
      name: "square",
      Icon: WaveSquareIcon,
    },
    {
      name: "sawtooth",
      Icon: WaveSawtoothIcon,
    },
    {
      name: "triangle",
      Icon: WaveTriangleIcon,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {oscillatorTypes.map((oscillatorType) => (
        <button
          key={oscillatorType.name}
          className="flex items-center justify-center aspect-square rounded-md transition-colors aria-pressed:bg-blue-400 not-aria-pressed:bg-blue-50"
          aria-pressed={oscillatorType.name === selectedWaveShape}
          onClick={() => onValueChange(oscillatorType.name)}
        >
          <oscillatorType.Icon
            color={
              oscillatorType.name === selectedWaveShape ? `white` : "black"
            }
            weight="regular"
            size={28}
          />
        </button>
      ))}
    </div>
  );
}
