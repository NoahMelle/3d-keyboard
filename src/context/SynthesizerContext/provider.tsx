import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

import { ISynthesizerParams, SynthesizerContext } from "./context";

interface ISynthesizerContextProviderProps {
  children: React.ReactNode;
}

const DEFAULT_PARAMS: ISynthesizerParams = {
  volume: -24,
  attack: 0.01,
  decay: 0.1,
  sustain: 0.7,
  release: 0.3,
  oscillatorType: "sawtooth",
};

export function SynthesizerContextProvider({
  children,
}: ISynthesizerContextProviderProps) {
  const [params, setParamsState] = useState<ISynthesizerParams>(DEFAULT_PARAMS);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const activeNotesRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: params.oscillatorType,
      },
      envelope: {
        attack: params.attack,
        decay: params.decay,
        sustain: params.sustain,
        release: params.release,
      },
    }).toDestination();

    synthRef.current.volume.value = params.volume;

    const startAudio = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
    };

    const handleInteraction = () => {
      startAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      synthRef.current?.dispose();
    };
  }, []);

  // Update synthesizer parameters when they change
  useEffect(() => {
    if (!synthRef.current) return;

    const synth = synthRef.current;

    // Update volume
    synth.volume.value = params.volume;

    // Update oscillator type
    synth.set({
      oscillator: {
        type: params.oscillatorType,
      },
    });

    // Update envelope
    synth.set({
      envelope: {
        attack: params.attack,
        decay: params.decay,
        sustain: params.sustain,
        release: params.release,
      },
    });
  }, [params]);

  const setParams = (newParams: Partial<ISynthesizerParams>) => {
    setParamsState((prev) => ({ ...prev, ...newParams }));
  };

  const triggerNote = useCallback((note: number, velocity: number = 0.8) => {
    if (!synthRef.current) return;

    // Convert MIDI note number to frequency
    const frequency = Tone.Frequency(note, "midi").toFrequency();
    const vel = Math.max(0, Math.min(1, velocity));

    // Store the note for tracking
    activeNotesRef.current.set(note, vel);

    // Trigger the note
    synthRef.current.triggerAttack(frequency, undefined, vel);
  }, []);

  const releaseNote = useCallback((note: number) => {
    if (!synthRef.current) return;

    const frequency = Tone.Frequency(note, "midi").toFrequency();
    synthRef.current.triggerRelease(frequency);
    activeNotesRef.current.delete(note);
  }, []);

  return (
    <SynthesizerContext.Provider
      value={{
        params,
        setParams,
        triggerNote,
        releaseNote,
      }}
    >
      {children}
    </SynthesizerContext.Provider>
  );
}
