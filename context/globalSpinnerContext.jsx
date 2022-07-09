import { createContext, React, useState, useContext } from "react";

export const GlobalSpinnerContext = createContext();

export default function GlobalSpinnerContextProvider(props) {
  const [isGlobalSpinnerOn, setGlobalSpinner] = useState(true);

  return (
    <GlobalSpinnerContext.Provider
      value={[isGlobalSpinnerOn, setGlobalSpinner]}
    >
      {props.children}
    </GlobalSpinnerContext.Provider>
  );
}

export function useGlobalSpinner() {
  return useContext(GlobalSpinnerContext);
}
