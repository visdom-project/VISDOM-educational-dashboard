import React, { useState, useEffect} from "react"

import { 
  _NUMBER_OF_WEEKS_,
  _COLOR_PALETTES_ 
} from "../services/helpers";
import studentData from "../services/studentData";
import {
  useMessageDispatch,
  useMessageState,
} from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import ConfigurationTable from "./ConfigurationTable";
import StudentSelector from "./StudentSelector";
import AllWeeksVisu from "./AllWeeksVisu";
import CalendarModeVisu from "./CalendarModeVisu";

const RectangleVisu = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  // const [client, setClient] = useState([]);
  const [graphKey, graphShouldUpdate] = useState(0);

  const [studentID, setStudentID] = useState("");
  const [data, setData] = useState([]);
  const [configProps, setConfigProps] = useState({
    dayMode: "summary",
    width: "commitDay-width",
    height: "commit-height",
    opacity: "",
    color: "",
    pointMode: {
      "commit": "value",
      "points": "value",
      "maxPoints": "value",
      "submissions": "value"
    },
    fillMode: _COLOR_PALETTES_.default
  })
  const [mode, setMode] = useState(false);
  const [weekDisplay, setWeekDisplay] = useState([1, _NUMBER_OF_WEEKS_]);
  const [radarMode, setRadarMode] = useState(false);
  const [radarConfigProps, setRadarConfigProps] = useState({
    dayMode: "summary",
    display: ["submissions", "commits", "points"],
    color: "",
    opacity: "",
    fillMode: _COLOR_PALETTES_.default
  })

  //  hard coding without metadata
   const maxlength = 98;
   const [timescale, setTimescale] = useState({
     start: 0,
     end: maxlength - 1,
   });

  useEffect(() => {
    if (studentID) {
      studentData(studentID)
        .then(res => setData(res))
        .catch(err => console.log(err))
    }
  },[studentID]) //eslint-disable-line

  // useEffect(() => {
  //   MQTTConnect(dispatch).then(client => setClient(client));
  //   return () => client.end();
  // }, []);

  useEffect(() => {
    // if empty array then render nothing, if more than one intance(s), render first one;
    const currentIntance = state.instances[0] || "";
    setStudentID(currentIntance);
  }, [state.instances]); //eslint-disable-line

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
        setWeekDisplay([Math.floor(state.timescale.start / 7) + 1, Math.ceil((maxlength - 1) / 7) + 1]);
      } else {
        setTimescale(state.timescale);
        setWeekDisplay([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7) + 1]);
      }
      graphShouldUpdate(graphKey + 1);
    }
  }, [state.timescale]); //eslint-disable-line

  return(
    <div className="rectangle-visu">
      <h2>Rectangle Mapping Visualization</h2>
      <StudentSelector 
        studentID={studentID} 
        setStudentID={setStudentID} 
      />
      {studentID.length !== 0 && <ConfigurationTable 
        configProps={configProps} 
        setConfigProps={setConfigProps}
        mode={mode}
        setMode={setMode}
        weekDisplay={weekDisplay}
        setWeekDisplay={setWeekDisplay}
        radarMode={radarMode}
        setRadarMode={setRadarMode}
        radarConfigProps={radarConfigProps}
        setRadarConfigProps={setRadarConfigProps}
      />}
      {studentID && <button
        onClick={() => {
          const instances = studentID ? [studentID] : [];
          dispatch({...state,
            timescale: timescale,
            instances: instances,
          });
        }}
      >
        sync
      </button>}
      {!mode && <AllWeeksVisu 
        rawData={data} 
        configProps={configProps} 
        weekDisplay={weekDisplay}
        setWeekDisplay={setWeekDisplay}
        setTimescale={setTimescale}
      />}
      {mode && <CalendarModeVisu
        studentID={studentID}
        radarConfigProps={radarConfigProps}
        configProps={configProps}
        radarMode={radarMode}
      />}
    </div>
  )
}

export default RectangleVisu
