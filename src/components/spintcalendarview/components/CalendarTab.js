// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import getTimeframe from "../services/timeframe";
import { getTimePeriod } from "../services/studentData";
import StudentSelector from "./StudentSelector";
import TimeSelection from "./TimeSelection";
import DropdownMenu from "./DropdownMenu";

import {
  useMessageDispatch,
  useMessageState,
} from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../../../contexts/messageContext";

const CalendarTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  // const [client, setClient] = useState([]);
  const [graphKey, graphShouldUpdate] = useState(0);

  const [timeframe, setTimeframe] = useState([]);
  const [studentID, setStudentID] = useState("");
  const [timePeriod, setTimePeriod] = useState({
    startDate: null, endDate: null})

  //hard coding without metadata
  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength - 1,
  });

  const handleTimeChange = newValue => {
    setTimescale({
      start: newValue[0],
      end: newValue[1],
    })
    dispatch({...state,
      timescale: {
        start: newValue[0],
        end: newValue[1],
      }
    })
  }

  const setStudentInstance = (currentInstance) => {
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
  };

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
    if (state.instances.length && state.instances[0].length !== 0) {
      getTimePeriod(state.instances[0], state.courseID)
        .then(res => res && setTimePeriod(res))
        .catch(error => console.log(error)) 
    }
  },[state.instances, state.courseID])

  useEffect(() => {
    if (timePeriod.startDate && timePeriod.endDate) {
      getTimeframe(timePeriod.startDate, timePeriod.endDate, studentID, state.courseID)
      .then(frame => 
        // console.log(frame)
        setTimeframe(frame)
      )
      .catch(error => console.log(error))
    }
  }, [timePeriod, state.courseID]) // eslint-disable-line

  useEffect(() => {
    // if empty array then render nothing, if more than one intance(s), render first one;
    const currentIntance = state.instances[0] || "";
    setStudentID(currentIntance);
  }, [state.instances]);

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
    <div className="calendar-tab">
      <h2>Sprint Calendar Visualization</h2>
      <DropdownMenu
        handleClick={handleCourseDataSelected}
        options={[40, 90, 117]}
        selectedOption={state.courseID}
        title="Course ID: "
      />
      <StudentSelector 
        studentID={state.instances[0] || ""} 
        setStudentID={setStudentInstance}
        courseID={state.courseID}
      />
      {studentID && 
      <>
        <TimeSelection 
          timescale={timescale}
          setTimescale={handleTimeChange}
          maxlength={maxlength}
        />
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
        {timeframe && <Calendar
          key={graphKey} 
          timeframe={timeframe.slice(timescale.start, timescale.end)} 
        />}
      </>
      }
    </div>
  );
}

export default CalendarTab
