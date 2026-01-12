import { useContext } from "react";

import { IMidiContext, MidiContext } from "@/context/MidiContext/context";

const useMidi = (): IMidiContext => {
  const contextValue = useContext(MidiContext);

  if (!contextValue) {
    throw new Error("useMidi must be used within a MidiContextProvider.");
  }

  return contextValue;
};

export default useMidi;
