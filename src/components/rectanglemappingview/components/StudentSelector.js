// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useEffect, useState } from "react";

import { Card } from "react-bootstrap";

import studentsInformationService from "../services/studentsInformation";

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
  
const StudentSelector = ({ studentID, setStudentID, courseID }) => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({});

  useEffect(() => {
    studentsInformationService
      .getAllStudentData(courseID)
      .then(res => {setStudents(res)})
      .catch(err => console.log(err))
  },[courseID]); //eslint-disable-line

  useEffect(() => {
    if (studentID && students) {
      studentsInformationService
        .getStudentInfo(studentID, courseID)
        .then(res => setStudent(res))
        .catch(err => console.log(err))
    }
  },[studentID, courseID]) //eslint-disable-line

  return (
    <div className="fit-row">
      <DropdownMenu 
        handleClick={setStudentID}
        options={students}
        selectedOption={studentID}
        title={"Student ID:"}
      />
      {student && <Card className="student-info-card" style={{ width: "20rem", border: "none" }}>
        <Card.Body>
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