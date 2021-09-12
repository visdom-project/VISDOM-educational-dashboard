import React, { useEffect, useState } from "react";
import { getAllStudentData } from "../services/studentData";
import "../stylesheets/dropdown.css";
import { TwoThumbInputRange } from "react-two-thumb-input-range";
import { Card } from "react-bootstrap";

const DropdownList = ({ handleClick, options, selectedOption, title }) => {
  return (
    <div style={{ marginRight: "10px" }}>
      <label style={{ paddingRight: "10px" }}>{title}</label>
      <div className="dropdown">
        <button className="dropdown-title-button">{selectedOption}</button>
        <div
          className="dropdown-options"
          style={{ maxHeight: "200px", overflow: "scroll" }}
        >
          {options && options.map((option, i) => (
            <button key={option} onClick={() => handleClick(option)} >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TimeSelection = ({ 
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

export const DropDownMenu = ({ studentID, setStudentID }) => {
  const [studentData, setStudentData] = useState([]);
  const [student, setStudent] = useState({});

  useEffect(() => {
    getAllStudentData()
      .then(res => {
        setStudentData(res)
        res && setStudent(res.find(person => person.student_id === studentID))
      })
      .catch(error => console.log(error))
  },[studentID])

  return(
    <div className="fit-row">
      <DropdownList
        handleClick={setStudentID}
        options={studentData && studentData.map((student) => student.student_id)}
        selectedOption={studentID}
        title={"Chosen student:"}
      />
      {(student && studentData) && (
        <Card className="student-info-card" style={{ width: "20rem", border: "none" }}>
          <Card.Body>
            <Card.Title>
              {studentID}
            </Card.Title>
            <Card.Text>
              <b>Full name</b>: {student.fullname}
              <br />
              <b>Username</b>: {student.username}
              <br />
              <b>Email</b>: {student.email}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default DropDownMenu
