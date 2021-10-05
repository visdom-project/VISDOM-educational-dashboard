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
  }

  const handleTimeChange = newValue => {
    const time = newValue.sort((a,b) => a-b)
    setWeekDisplay(time)
    setTimescale({
      start: (time[0] - 1) * 7,
      end: (time[1] - 1) * 7 - 1
    })
    dispatch({...state,
      timescale: {
        start: (time[0] - 1) * 7,
        end: (time[1] - 1) * 7 -1
      }
    })
  }

  useEffect(() => {
    if (state.instances.length && state.instances[0].length !== 0) {
      studentData(state.instances[0])
        .then(res => setData(res))
        .catch(err => console.log(err))
    }
  },[state.instances]) //eslint-disable-lisapsane

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
        studentID={state.instances[0] || ""} 
        setStudentID={setStudentInstance} 
      />
      {studentID.length && <ConfigurationTable 
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
      {/* {studentID && data.length > 0 && <button
        onClick={() => {
          const instances = studentID ? [studentID] : [];
          dispatch({...state,
            timescale: timescale,
            instances: instances,
          });
        }}
      >
        sync
      </button>} */}
      {data.length > 0 && !mode && <AllWeeksVisu 
        rawData={data} 
        configProps={configProps} 
        weekDisplay={weekDisplay}
        setTimescale={handleTimeChange}
      />}
      {data.length > 0 && mode && <CalendarModeVisu
        studentID={studentID}
        radarConfigProps={radarConfigProps}
        configProps={configProps}
        radarMode={radarMode}
      />}
    </div>
  )
}

export default RectangleVisu
