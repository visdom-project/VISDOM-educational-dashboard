import React, { useState, useEffect } from "react";
import { Form} from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range"
import VisGraph from "./VisGraph";

import { getAllStudentsData, fetchStudentData } from "../services/studentData";
import { useMessageDispatch, useMessageState } from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";


import ConfigurableFieldSelector from "./ConfigurableFieldSelector";


const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  // const [client, setClient] = useState(null);

  const [studentList, setStudentList] = useState([]);
  const [studentID, setStudentID] = useState("");

  const [displayData, setDisplayData] = useState([]);
  // const [expectedGrade, setExpectedGrade] = useState(1);

  // const [numberOfWeeks, setNumberOfweeks] = useState(0);
  const [displayedWeek, setDisplayedWeek] = useState([1, 0]);

  const selectableFields = [
    "Attemped exercises",
    "NO submissions",
    "NO commits",
    "Points",
    "p/maxp ratio",
];
  const [configs, setConfigs] = useState(selectableFields);

  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength - 1,
  });


  // const maxlength = 98;

  // useEffect(() => {
  //   const newClient = MQTTConnect(dispatch).then( client => {
  //     setClient(client);
  //     return client;
  //   });
  //   // return;
  //   return () => newClient.end();
  // }, []);

  useEffect(() => {
    getAllStudentsData().then(list => setStudentList(list));
  }, []);

  // useEffect(() => {
  //   updateLocalState(dispatch, {
  //     timescale: {
  //       start: 0,
  //       end: maxlength-1,
  //     },
  //     instances: [],
  //   });
  // }, []);

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
        setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil((maxlength - 1) / 7) + 1]);
      } else {
        setTimescale(state.timescale);
        setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7) + 1]);
      }
    }
  }, [state.timescale]); //eslint-disable-line

  useEffect(() => {
    if (studentID.length !== 0) {
      fetchStudentData(studentID)
        .then(data => {
          setDisplayData(data)
          setDisplayedWeek([Math.floor(timescale.start / 7) + 1, Math.ceil(timescale.end / 7) + 1])
        })
        .catch(err => console.log(err))
    }
  }, [studentID, timescale])

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
      <h2>EKG Visualization</h2>
        <DropdownMenu
          options={studentList}
          selectedOption={ studentID.length ? studentID : null }
          handleClick={ instance => setStudentID(instance)}
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

        <div>
          <VisGraph data={displayData} displayedWeek={displayedWeek} configs={configs}/>
        </div>
        {
          studentID &&
          <>
            <div className="timescale-slider" style={{ width: "400px", padding: "10px 0 10px 100px" }}>
              <Form.Label id="range-slider">
                Week range
              </Form.Label>
              <TwoThumbInputRange
                values={displayedWeek}
                min={1}
                max={15}
                onChange={newValue => {
                  const val = newValue.sort( (a, b) => a-b);
                  setDisplayedWeek(val)
                  setTimescale({
                    start: (newValue[0] - 1) * 7,
                    end: (newValue[1] - 1) * 7 -1
                  })
                }}
              />
            </div>
            <button
              onClick={() => {
                const instances = studentID ? [studentID] : [];
                dispatch({...state,
                  timescale: timescale,
                  instances: instances,
                });
              }}
            >
              Sync
            </button>
          </>
        }
    </div>
  );
};


export default EKGTab;
