// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useEffect, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import { getAllStudentData, getStudentInfo } from "../services/studentData";
import { Card } from "react-bootstrap";

const StudentSelector = ({ studentID, setStudentID, courseID }) => {
  const [studentData, setStudentData] = useState([]);
  const [student, setStudent] = useState({});
  // const student = studentData.find((item) => item.student_id === studentID);

  useEffect(() => {
    getAllStudentData(courseID)
      .then((res) => {
        setStudentData(res)
      })
      .catch((err) => console.log(err));
  }, [courseID]);

  useEffect(() => {
    getStudentInfo(studentID, courseID)
      .then(res => setStudent(res))
  }, [studentID, courseID]) //eslint-disable-line

  if (!studentData || !student)
    return (
      <DropdownMenu
        handleClick={setStudentID}
        options={studentData}
        selectedOption={studentID}
        title={"Chosen student:"}
      />
    );
  return (
    <div className="fit-row">
      <DropdownMenu
        handleClick={setStudentID}
        options={studentData}
        selectedOption={studentID}
        title={"Chosen student:"}
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
  );
}
  
export default StudentSelector