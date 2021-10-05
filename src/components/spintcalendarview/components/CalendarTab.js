import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import getTimeframe from "../services/timeframe";
import { getTimePeriod } from "../services/studentData";
import StudentSelector from "./StudentSelector";
import TimeSelection from "./TimeSelection";

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

  useEffect(() => {
    if (studentID) {
      getTimePeriod(studentID)
        .then(res => res && setTimePeriod(res))
        .catch(error => console.log(error)) 
      const instances = studentID ? [studentID] : [];
      dispatch({...state,
        instances: instances,
      });
    }
  },[studentID])

  useEffect(() => {
    dispatch({...state,
      timescale: timescale
    })
  }, [timescale])

  useEffect(() => {
    if (timePeriod.startDate && timePeriod.endDate) {
      getTimeframe(timePeriod.startDate, timePeriod.endDate, studentID)
      .then(frame => 
        // console.log(frame)
        setTimeframe(frame)
      )
      .catch(error => console.log(error))
    }
  }, [timePeriod]) // eslint-disable-line

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
      <StudentSelector studentID={studentID} setStudentID={setStudentID} />
      {studentID && 
      <>
        <TimeSelection 
          timescale={timescale}
          setTimescale={setTimescale}
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
