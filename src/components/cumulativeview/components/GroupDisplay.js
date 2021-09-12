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
          {grades.concat(["6"]).map((grade) => (
            <tr key={`grade-${grade}`}>
              <td>
                <label className="switch" style={{ marginTop: "0.2em" }}>
                  <input
                    className="gradeswitch"
                    id={`input-${grade}`}
                    type="checkbox"
                    onClick={() => handleClick(grade)}
                    defaultChecked={groupSelected[grade]}
                  ></input>
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ paddingLeft: "0.5em" }}>
                {grade === "6" ? "> avg of grade 5" : `< avg of grade ${grade}`}
              </td>
            </tr>
          ))}
          <tr key="All">
            <td>
              <label className="switch" style={{ margin: "0em 0em" }}>
                <input
                  id={"input-all"}
                  type="checkbox"
                  onClick={() => handleClick("all")}
                  defaultChecked={groupSelected[groupSelected.length -1]}
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
