// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useState, useEffect } from "react";
import { Form} from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range"
import VisGraph from "./VisGraph";

import { getCourseIDs } from "../services/courseData";
import { fetchStudentData, getAllStudentsIDs, getStudentData } from "../services/studentData";
import { useMessageDispatch, useMessageState } from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";


import ConfigurableFieldSelector from "./ConfigurableFieldSelector";


const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  const setStudentInstance = (currentInstance) => {
    if (state.instances.length === 0) {
      dispatch({
        ...state,
        instances: [currentInstance],
      })
    };
    const index = state.instances.findIndex( instance => instance === currentInstance);
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
    });
    return;
  }
  const setTimescale = (timescale) => dispatch({...state, timescale: timescale});

  const [studentList, setStudentList] = useState([]);

  const [displayData, setDisplayData] = useState([]);
  const [displayedWeek, setDisplayedWeek] = useState([1, 0]);

  const selectableFields = [
    "Attemped exercises",
    "NO submissions",
    "NO commits",
    "Points",
    "p/maxp ratio",
];
  const [configs, setConfigs] = useState(selectableFields);

  const [maxlength, setMaxlength] = useState(0);
  
  const [courseIDs, setCourseIDs] = useState([]);

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

  useEffect(() => {
    getCourseIDs().then(data => setCourseIDs(data));
  }, [])

  useEffect(() => {
    getAllStudentsIDs(state.courseID).then(data => setStudentList(data));
  }, [state.courseID, courseIDs]);

  // useEffect(() => {
  //   getAllStudentsData(state.courseID).then(list => setStudentList(list));
  // }, [state.courseID]);
  
  useEffect(() => {
    if (!state.timescale) {
      if (maxlength !== 0) {
        setTimescale({
          start: 0,
          end: maxlength - 1,
        });
      }
      return;
    }

    if (state.timescale.end > maxlength - 1 && maxlength - 1 > 0){
      setTimescale({
        ...state.timescale,
        end: maxlength - 1,
      });
      return;      
    }
    setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7)]);
  }, [state.timescale, maxlength]); //eslint-disable-line

  useEffect(() => {
    if (state.instances.length && state.instances[0].length){
      // fetchStudentData(state.instances[0], state.courseID)
      //   .then(data => {
      //     setDisplayData(data);
      //     setMaxlength(data.length * 7);
      // });
      getStudentData(state.instances[0], state.courseID)
        .then(data => {
          setDisplayData(data);
          setMaxlength(data.length * 7);
        });
    };
  }, [state.instances, state.courseID]);

  // useEffect(() => {
  //   if (!state.instances.length)
  //   {
  //     return;
  //   }
  //   fetchStudentData(state.instances[0])
  //     .then(data => {
  //       setDisplayData(data);
  //       // setNumberOfweeks(data.length);
  //       setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7) + 1]);
  //     });
  // }, [studentID]); //eslint-disable-line
  return (
    <div className="container-body">
      <h2>Radar Visualization</h2>
      <DropdownMenu
        handleClick={handleCourseDataSelected}
        options={courseIDs}
        selectedOption={state.courseID}
        title="Course ID: "
      />
        <DropdownMenu
          options={studentList}
          selectedOption={ state.instances[0] || ""}
          handleClick={setStudentInstance}
          title="Student ID:"
          selectAllOption={false}
        />

        <div className="config-board">
          <ConfigDialog
          title={{
            button: "Show view configuration",
            dialog: "Modify show configuration",
            confirm: "OK",
          }}>
            <Form.Label>Configs:</Form.Label>
            <ConfigurableFieldSelector
              selected={configs}
              setSelected={setConfigs}
              allSelections={selectableFields}
            />
          </ConfigDialog>
        </div>
        {
          state.instances[0] && maxlength !== 0 &&
          <>
            <div>
              <VisGraph 
                data={displayData} 
                displayedWeek={displayedWeek}
                configs={configs}
              />
            </div>
            <div className="timescale-slider" style={{ width: "400px", padding: "10px 0 10px 100px" }}>
              <Form.Label id="range-slider">
                Week range
              </Form.Label>
              <TwoThumbInputRange
                values={displayedWeek}
                min={1}
                max={Math.ceil(maxlength / 7)}
                onChange={newValue => {
                  const val = newValue.sort( (a, b) => a-b);
                  setDisplayedWeek(val)
                  setTimescale({
                    start: (newValue[0] - 1) * 7,
                    end: (newValue[1]) * 7 - 1
                  })
                }}
              />
            </div>
          </>
        }
    </div>
  );
};


export default EKGTab;
