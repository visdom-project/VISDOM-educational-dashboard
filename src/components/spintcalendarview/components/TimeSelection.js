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
