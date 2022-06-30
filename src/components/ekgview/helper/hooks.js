// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

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

