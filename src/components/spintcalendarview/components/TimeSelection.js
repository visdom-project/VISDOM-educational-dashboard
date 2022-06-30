// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React from "react";
import { TwoThumbInputRange } from "react-two-thumb-input-range";

const TimeSelection = ({ 
  timescale,
  setTimescale, 
  maxlength
}) => {

  const resetDate = (e) => {
    e.preventDefault();
    setTimescale({
      start: 0,
      end: maxlength,
    })
  }

  return (
    <div className="fit-row" style={{ paddingTop: "20px" }}>
      <TwoThumbInputRange
        values={Object.keys(timescale).map(key => timescale[key])}
        min={0}
        max={maxlength}
        onChange={setTimescale}
      />
      <button key="reset-date" onClick={resetDate}>Reset</button>
    </div>
  )
}

export default TimeSelection
