// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>

/* eslint-disable react/prop-types */
import React from "react";

const CheckBoxMenu = ({ options, handleClick, showAvg, showExpected }) => {
  const labelStyle = {
    paddingRight: "0.5em",
    marginBottom: "0em",
    paddingLeft: "0.5em",
  };
  return (
    <div
      className="fit-row"
      style={{
        border: "1px #c7c7c7b5 solid",
        borderRadius: "0.25em",
        padding: "0.25em 0.5em",
      }}
    >
      <div>
        {options.map((option) => {
          return (
            <div key={option} className="fit-row">
              <input
                onClick={() => handleClick(option)}
                type="checkbox"
                style={{ margin: "auto 0" }}
                id={option}
                defaultChecked={true}
              ></input>
              <label htmlFor={option} style={labelStyle}>
                {" "}
                {option}
              </label>
              <br></br>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CheckBoxMenu;
