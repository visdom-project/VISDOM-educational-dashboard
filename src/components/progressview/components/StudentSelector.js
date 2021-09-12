/* eslint-disable react/prop-types */
import React from "react";

const StudentSelector = ({ students, handleClick }) => {
  return (
    <div style={{ marginLeft: "1em", marginTop: "0em", fontSize: "x-small" }}>
      <ul
        style={{
          columns: 6,
          width: "fit-content",
          listStyleType: "none",
          marginTop: "0em",
          borderLeft: "1px lightgrey solid",
          paddingLeft: "2em",
          columnWidth: "10em",
        }}
      >
        {students.map((student) => (
          <li
            key={student}
            onClick={() => handleClick(student)}
            id={`li-${student}`}
          >
            {student}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentSelector;
