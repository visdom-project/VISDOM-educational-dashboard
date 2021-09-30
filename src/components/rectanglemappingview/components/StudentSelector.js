import React, { useEffect, useState } from "react";

import { Card } from "react-bootstrap";

import studentsInformation from "../services/studentsInformation";

import "../stylesheets/dropdown.css";

export const DropdownMenu = ({ handleClick, options, selectedOption, title }) => {
  return (
    <div style={{ marginRight: "2em" }}>
      <label style={{ paddingRight: "10px" }}>{title}</label>
      <div className="dropdown">
        <button className="dropdown-title-button">{selectedOption}</button>
        <div
          className="dropdown-options"
          style={{ maxHeight: "200px", overflow: "scroll" }}
        >
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
  
const StudentSelector = ({ studentID, setStudentID }) => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({});

  useEffect(() => {
    studentsInformation()
      .then(res => {
        setStudents(res)
        setStudent(res.find(s => s.student_id === studentID))
      })
      .catch(err => console.log(err))
  },[]); //eslint-disable-line

  useEffect(() => {
    if (studentID && students) {
      setStudent(students.find(s => s.student_id === studentID))
    }
  },[studentID]) //eslint-disable-line

  return (
    <div className="fit-row">
      <DropdownMenu 
        handleClick={setStudentID}
        options={students && students.map((student) => student.student_id)}
        selectedOption={studentID}
        title={"Student ID:"}
      />
      {student && <Card className="student-info-card" style={{ width: "20rem", border: "none" }}>
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
      </Card>}
    </div>
  )
}

export default StudentSelector