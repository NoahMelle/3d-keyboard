import { createContext } from "react";

export interface ISynthesizerParams {
  volume: number; // -60 to 0 dB
  attack: number; // 0 to 2 seconds
  decay: number; // 0 to 2 seconds
  sustain: number; // 0 to 1
  release: number; // 0 to 2 seconds
  oscillatorType: OscillatorType; // "sine" | "square" | "sawtooth" | "triangle"
}

export interface ISynthesizerContext {
  params: ISynthesizerParams;
  setParams: (params: Partial<ISynthesizerParams>) => void;
  triggerNote: (note: number, velocity?: number) => void;
  releaseNote: (note: number) => void;
}

export const SynthesizerContext = createContext<ISynthesizerContext | null>(
  null
);
