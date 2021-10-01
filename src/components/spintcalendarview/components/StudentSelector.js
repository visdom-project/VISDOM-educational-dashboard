import React, { useEffect, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import { getAllStudentData } from "../services/studentData";
import { Card } from "react-bootstrap";

const StudentSelector = ({ studentID, setStudentID }) => {
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
        <DropdownMenu
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
  
  export default StudentSelector