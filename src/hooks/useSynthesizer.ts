import { useContext } from "react";

import {
  ISynthesizerContext,
  SynthesizerContext,
} from "@/context/SynthesizerContext/context";

const useSynthesizer = (): ISynthesizerContext => {
  const contextValue = useContext(SynthesizerContext);

  if (!contextValue) {
    throw new Error(
      "useSynthesizer must be used within a SynthesizerContextProvider."
    );
  }

  return contextValue;
};

export default useSynthesizer;
