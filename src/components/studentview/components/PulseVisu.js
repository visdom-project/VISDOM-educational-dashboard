/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";
import pulseData from "../services/pulseData";
import DropdownMenu from "./DropdownMenu";
import "../stylesheets/dropdown.css";

import { Card } from "react-bootstrap";
import {
  useMessageDispatch,
  useMessageState,
} from "../../../contexts/messageContext"

// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
import moment from "moment";

export const StudentList = ({ setStudentID, studentID, courseID }) => {
  const [studentData, setStudentData] = useState([]);
  const [student, setStudent] = useState({});
  // const student = studentData.find((item) => item.student_id === studentID);

  useEffect(() => {
    pulseData
      .getAllStudentData(courseID)
      .then(res => {
        setStudentData(res)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    pulseData
      .getStudentInfo(studentID, courseID)
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
};

const PulseVisu = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  // const [client, setClient] = useState(null);
  // const [studentID, setStudentID] = useState("");
  const [data, setData] = useState([]);

  const [graphKey, graphShouldUpdate] = useState(0);

  //hard coding without metadata
  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength - 1,
  });

  // handle course ID selection
  const handleCourseDataSelected = option => {
    if (option !== state.courseID) {
      dispatch({
        ...state,
        instances: [],
        courseID: option
      });
    }
  };

  const setStudentInstance = currentInstance => {
    if (state.instances.length === 0) {
      dispatch({
        ...state,
        instances: [currentInstance],
      })
    };
    const index = state.instances.findIndex(instance => instance === currentInstance);
    if (index === -1) {
      const newInstances = [...state.instances];
      newInstances.splice(0, 0, currentInstance);
      dispatch({
        ...state,
        instances: newInstances,
      })
      return;
    }
    const newInstances = [...state.instances];
    newInstances[index] = state.instances[0];
    newInstances[0] = currentInstance;
    dispatch({
      ...state,
      instances: newInstances,
    })
    return;
  }

  useEffect(() => {
    if (state.instances.length && state.instances[0].length !== 0) {
    pulseData
      .getData(state.instances[0], state.courseID)
      .then((response) => setData(response[0]))
      .catch((err) => console.log(err));
    }
  }, [state.instances, state.courseID]);

  // useEffect(() => {
  //   // if empty array then render nothing, if more than one intance(s), render first one;
  //   const currentIntance = state.instances[0] || "";
  //   setStudentID(currentIntance);
  // }, [state.instances]); //eslint-disable-line

  // useEffect(() => {
  //   dispatch({...state,
  //     timescale: timescale
  //   })
  // }, [timescale])

  useEffect(() => {
    if (!state.timescale) {
      return;
    }
    if (
      state.timescale.start !== timescale.start ||
      state.timescale.end !== timescale.end
    ) {
      if (state.timescale.end > maxlength - 1) {
        setTimescale({
          ...timescale,
          end: maxlength - 1,
        });
      } else {
        setTimescale(state.timescale);
      }
      graphShouldUpdate(graphKey + 1);
    }
  }, [state.timescale]); //eslint-disable-line

  return (
    <div className="" style={{ minHeight: "700px" }}>
      <h2>Pulse Visualization</h2>
      <h3>Student Commits Status</h3>
      <DropdownMenu
        handleClick={handleCourseDataSelected}
        options={[40, 90, 117]}
        selectedOption={state.courseID}
        title="Course ID: "
      />
      <StudentList
        studentID={state.instances[0] || ""}
        setStudentID={setStudentInstance}
        courseID={state.courseID}
      />
      {state.instances.length > 0 && data &&
      <>
        <ResponsiveContainer minWidth="300px" minHeight="700px">
          <BarChart
            key={graphKey}
            margin={{ top: 10, right: 15, left: 25, bottom: 100 }}
            data={data}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              height={140}
              dataKey="dateInSecond"
              tickFormatter={(tickItem) =>
                moment(tickItem * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
              }
              angle={-90}
              textAnchor="end"
              scale="time"
              tickCount={7}
              interval={0}
            />
            <YAxis allowDataOverflow={true} />
            <Tooltip
              labelFormatter={(label) =>
                moment(label * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
              }
            />
            <Bar dataKey="earlyCommit" stackId="a" fill="#74ee15" barSize={15} />
            <Bar dataKey="inTimeCommit" stackId="a" fill="#ffe700" barSize={15} />
            <Bar dataKey="lateCommit" stackId="a" fill="#e0301e" barSize={15} />
            <Brush
              startIndex={timescale.start}
              endIndex={timescale.end}
              tickFormatter={(tickItem) =>
                moment(tickItem * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
              }
              height={25}
              stroke="#8884d8"
              onChange={e => {
                setTimescale({
                  start: e.startIndex,
                  end: e.endIndex,
                });
                dispatch({...state,
                  timescale: {
                    start: e.startIndex,
                    end: e.endIndex,
                  }
                })
              }}
            />
          </BarChart>
        </ResponsiveContainer>
        {/* <button
          onClick={() => {
              const instances = studentID ? [studentID] : [];
              dispatch({...state,
                timescale: timescale,
                instances: instances,
              });
            }}
        >
          Sync
        </button> */}
      </>
    }
    </div>
  );
};

export default PulseVisu
