/* eslint-disable react/prop-types */
import React from "react";
import "../stylesheets/dropdown.css";
const DropdownMenu = ({ handleClick, options, selectedOption, title, selectAllOption, handleSelectAll }) => {
  return (
    <div>
      <label style={{ paddingRight: "10px" }}>{title}</label>
      <div className="dropdown">
        <button className="dropdown-title-button">{selectedOption}</button>
        <div
          className="dropdown-options"
          style={{ maxHeight: "200px", overflow: "scroll" }}
        >
          {selectAllOption ?
          <button key="all" onClick={() => handleSelectAll()}>
            ALL
          </button> : null}
          {options && options.map((option) => (
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
