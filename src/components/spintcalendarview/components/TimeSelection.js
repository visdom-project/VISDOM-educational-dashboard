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

  const handleChange = newValue => {
    setTimescale({
      start: newValue[0],
      end: newValue[1],
    })
  }

  return (
    <div className="fit-row" style={{ paddingTop: "20px" }}>
      <TwoThumbInputRange
        values={Object.keys(timescale).map(key => timescale[key])}
        min={0}
        max={maxlength}
        onChange={handleChange}
      />
      <button key="reset-date" onClick={resetDate}>Reset</button>
    </div>
  )
}

export default TimeSelection
