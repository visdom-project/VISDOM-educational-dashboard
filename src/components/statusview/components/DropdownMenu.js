/* eslint-disable react/prop-types */
import React from "react";
import "../stylesheets/dropdown.css";

const DropdownMenu = ({ handleClick, options, selectedOption, title }) => {
  return (
    <div className="dropdown-menu">
      <label style={{ margin: "auto 1em", height: "1.2em" }}>{title}</label>
      <div className="dropdown">
        <button className="dropdown-title-button">{selectedOption}</button>
        <div 
          className="dropdown-options"
          style={{ maxHeight: "200px", overflow: "scroll" }}
        >
          {options.map((option) => (
            <button key={option} onClick={() => handleClick(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
