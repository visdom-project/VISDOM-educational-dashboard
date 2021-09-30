import { useRef, useState } from "react";

export const useReferredState = initialValue => {
  const [state, setState] = useState(initialValue);
  const ref = useRef(state);

  const onStateChange = newValue => {
    ref.current = newValue;
    setState(newValue);
  };

  return [ref, onStateChange];
};

