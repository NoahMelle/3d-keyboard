import { GearIcon } from "@phosphor-icons/react";
import { useState } from "react";

import WaveShapeSelector from "@/components/molecules/WaveShapeSelector";
import { Slider } from "@/components/ui/slider";
import useSynthesizer from "@/hooks/useSynthesizer";

export default function SynthesizerControls() {
  const { params, setParams } = useSynthesizer();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-0 right-0 w-full p-4 flex justify-end">
      <button
        className="bg-white px-4 py-2 rounded-lg flex gap-1 items-center text-sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open synthesizer controls"
      >
        <GearIcon size={18} />
        Edit synth
      </button>

      {isOpen && (
        <div className="absolute bottom-2 translate-y-full right-4 bg-white rounded-lg p-4 w-full max-w-64">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="oscillator" className="text-black/50 text-xs">
                Oscillator Type
              </label>
              <WaveShapeSelector
                selectedWaveShape={params.oscillatorType}
                onValueChange={(oscillatorType) =>
                  setParams({ oscillatorType })
                }
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="attack" className="text-black/50 text-xs">
                Attack: {params.attack.toFixed(2)}s
              </label>
              <Slider
                id="attack"
                min={0}
                max={2}
                step={0.01}
                value={[params.attack]}
                onValueChange={(value) => setParams({ attack: value[0] })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="decay" className="text-black/50 text-xs">
                Decay: {params.decay.toFixed(2)}s
              </label>
              <Slider
                id="decay"
                min={0}
                max={2}
                step={0.01}
                value={[params.decay]}
                onValueChange={(value) => setParams({ decay: value[0] })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="sustain" className="text-black/50 text-xs">
                Sustain: {(params.sustain * 100).toFixed(0)}%
              </label>
              <Slider
                id="sustain"
                min={0}
                max={1}
                step={0.01}
                value={[params.sustain]}
                onValueChange={(value) => setParams({ sustain: value[0] })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="release" className="text-black/50 text-xs">
                Release: {params.release.toFixed(2)}s
              </label>
              <Slider
                id="release"
                min={0}
                max={2}
                step={0.01}
                value={[params.release]}
                onValueChange={(value) => setParams({ release: value[0] })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
