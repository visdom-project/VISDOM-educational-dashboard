// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

/* eslint-disable react/prop-types */
import React from "react";
import "../stylesheets/groupdisplay.css";

const GroupDisplay = ({ grades, handleClick, groupSelected }) => {
  return (
    <div style={{ paddingLeft: "2em" }}>
      <h3 style={{ paddingLeft: "0em", marginTop: "0em", width: "15em" }}>
        Filter students by predicted grade:
      </h3>
      <table style={{ width: "13em", fontSize: "small" }}>
        <tbody>
          {grades.concat([grades[grades.length-1]+1]).map((grade) => (
            <tr key={`grade-${grade}`}>
              <td>
                <label className="switch" style={{ marginTop: "0.2em" }}>
                  <input
                    className="gradeswitch"
                    id={`input-${grade}`}
                    type="checkbox"
                    onChange={(event) => handleClick(grade, event.target.checked)}
                    checked={groupSelected[grade]}
                  ></input>
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ paddingLeft: "0.5em" }}>
                {grade === grades[grades.length-1]+1 ? `> avg of grade ${grades[grades.length-1]}` : `< avg of grade ${grade}`}
              </td>
            </tr>
          ))}
          <tr key="grade-all">
            <td>
              <label className="switch" style={{ margin: "0em 0em" }}>
                <input
                  id={"input-all"}
                  type="checkbox"
                  onChange={(event) => handleClick("all", event.target.checked)}
                  checked={groupSelected[groupSelected.length - 1]}
                ></input>
                <span className="slider round"></span>
              </label>
            </td>
            <td style={{ paddingLeft: "0.3em" }}>all students</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GroupDisplay;
