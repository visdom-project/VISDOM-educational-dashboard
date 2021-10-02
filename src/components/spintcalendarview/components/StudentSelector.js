import React, { useEffect, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import { getAllStudentData, getStudentInfo } from "../services/studentData";
import { Card } from "react-bootstrap";

const StudentSelector = ({ studentID, setStudentID }) => {
  const [studentData, setStudentData] = useState([]);
  const [student, setStudent] = useState({});
  // const student = studentData.find((item) => item.student_id === studentID);

  useEffect(() => {
    getAllStudentData()
      .then((res) => {
        setStudentData(res)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getStudentInfo(studentID)
      .then(res => setStudent(res))
  }, [studentID]) //eslint-disable-line

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