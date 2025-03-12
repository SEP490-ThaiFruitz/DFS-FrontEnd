import { useEffect, useState } from "react";

export const useFromStore = <TInput, TOutPut>(
  store: (callback: (state: TInput) => unknown) => unknown,
  storeCallback: (state: TInput) => TOutPut
) => {
  const [state, setState] = useState<TOutPut>();

  const stateOfOrders = store(storeCallback) as TOutPut;

  useEffect(() => {
    setState(stateOfOrders);
  }, [stateOfOrders]);

  return state;
};
