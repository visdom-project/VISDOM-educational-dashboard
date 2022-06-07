/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import dataService from "../services/statusData";
import MultiChart from "./StatusChart";
// import DropdownMenu from "./DropdownMenu";
// import CheckBoxMenu from "./CheckBoxMenu";
import StudentDetailView from "./StudentDetailView";
import ControlAccordion from "./ControlAccordion";
import {
  useMessageState,
  useMessageDispatch,
} from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
import ConfigDialog from "./ConfigDialog";
import DropdownMenu from "./DropdownMenu";
import helpers from "../services/helpers";
import { TwoThumbInputRange } from "react-two-thumb-input-range";
import { getCourseIDs } from "../services/courseData";
import { getExerciseData, getStatusData } from "../services/statusGraphData";

const InputRange = ({ values, maxlength, setStudentRange }) => {
  if (maxlength === 0) return null;

  return (
    <>
      <div className="student-range-slider">
        <p>Student range:</p>
        <TwoThumbInputRange
          values={values}
          min={1}
          trackColor="#caf0f8"
          max={maxlength}
          onChange={newValue => setStudentRange(newValue.sort((a, b) => a-b))}
          style={{ marginBottom: "20px" }}
        />
      </div>
      <div 
        className="student-range-selector"
        style={{ paddingLeft: "43%" }}
      >
        <input 
          type="number" 
          min="1"
          max={values[1]}
          value={values[0]}
          onChange={e => setStudentRange(values.map((v, i) => i === 0 ? e.target.value : v))}
          required
        />
        <span> - </span>
        <input
          type="number"
          min={values[0]}
          max={maxlength}
          value={values[1]}
          onChange={e => setStudentRange(values.map((v, i) => i === 1 ? e.target.value : v))}
          required
        />
      </div>
    </>
  )
}

// eslint-disable-next-line max-lines-per-function
const StatusTab = ({ graphIndex, sortProps, setSortProps, sameSortProps }) => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  // const [client, setClient] = useState(null);

  const [progressData, setProgressData] = useState([]);
  const [commonData, setCommonData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [commonDataToDisplay, setcommonDataToDisplay] = useState({});
  const [max, setMax] = useState(1);

  const [weeks, setWeeks] = useState(["1"]);
  const [selectedWeek, setSelectedWeek] = useState(Object.keys(state.statusProps.props).includes(graphIndex.toString())
    ? state.statusProps.props[graphIndex.toString()].week
    : "1");
  const [selectedWeekData, setSelectedWeekData] = useState([]);
  const [selectedCountData, setSelectedCountData] = useState([]);

  const modes = ["points", "exercises", "submissions", "commits"];
  const [selectedMode, setSelectedMode] = useState(Object.keys(state.statusProps.props).includes(graphIndex.toString())
    ? state.statusProps.props[graphIndex.toString()].mode
    : modes[0]);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [treshold, setTreshold] = useState(0.4);
  const [studentsBelowTreshold, setStudentsBelowTreshold] = useState(-99);
  const [pointExerciseData, setPointExerciseData] = useState([]);
  const [commitSubmissionData, setCommitSubmissionData] = useState([]);

  const [sortConfig, setSortConfig] = useState(sortProps);
  const [studentRange, setStudentRange] = useState([1,0]);
  const [maxlength, setMaxlength] = useState(0)
  const [courseIDs, setCourseIDs] = useState([]);
  const [courseID, setCourseID] = useState(Object.keys(state.statusProps.props).includes(graphIndex.toString())
    ? state.statusProps.props[graphIndex.toString()].courseID 
    : parseInt(process.env.REACT_APP_COURSE_ID));

  const allKeys = {
    points: {
      max: "maxPts",
      week: "week",
      totalPoints: "totPts",
      missed: "missed",

      cumulativeAvgs: "cumulativeAvgs",
      cumulativeMidExpected: "cumulativeMidExpected",
      cumulativeMinExpected: "cumulativeMinExpected",
    },
    exercises: {
      max: "maxExer",
      week: "weekExer",
      totalPoints: "totExer",
      missed: "missedExer",

      cumulativeAvgs: "cumulativeAvgsExercises",
      cumulativeMidExpected: "cumulativeMidExpectedExercises",
      cumulativeMinExpected: "cumulativeMinExpectedExercises",
    },
    submissions: {},
    commits: {},
  };
  const [dataKeys, setDataKeys] = useState(allKeys[selectedMode]);
  const commonKeys = {
    average: "avg",
    expectedMinimum: "min",
    expectedMedium: "mid",
  };

  const axisNames = {
    points: ["Students", "Points"],
    exercises: ["Students", "Exercises"],
    commits: ["Students", "Commits"],
    submissions: ["Students", "Exercises"],
  };

  const showableLines = ["Average", "Expected"];
  const [showAvg, setShowAvg] = useState(true);
  const [showExpected, setShowExpected] = useState(true);

  // const [selectedStudent, setSelectedStudent] = useState("");

  const boundingDiv = document.getElementsByClassName("card")[0];
  const chartWidth =
    boundingDiv === undefined
      ? 1000
      : boundingDiv.getBoundingClientRect().width * 0.955;
  const chartHeight = document.documentElement.clientHeight * 0.5;

  const determineMode = (s) => {
    if (s && s.mode) {
      return s.mode;
    }
    return modes[0];
  };

  const handleCourseDataSelected = option => {
    const graphIndexStr = graphIndex.toString();
    dispatch({
      ...state,
      statusProps: {
        ...state.statusProps,
        props: {
          ...state.statusProps.props,
          [graphIndexStr]: {
            ...state.statusProps.props[graphIndexStr],
            courseID: graphIndex === 0 ? state.courseID : option,
          }
        }
      }
    })
    if (graphIndex === 0) {
      if (option !== state.courseID) {
        dispatch({
          ...state,
          instances: [],
          courseID: option
        });
      } 
    } else {
      if (option !== courseID) {
        setCourseID(option);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleStudentClick = (data, barIndex) => {
    if (data !== undefined) {
      if (graphIndex === 0) {
        const instances = data.username ? [data.username] : [];
        dispatch({...state,
          // mode: selectedMode,
          instances: instances,
        });
      } 
      dispatch({
        ...state,
        statusDialogProps: {
          studentID: data.username,
          courseID: graphIndex === 0 ? state.courseID : courseID,
          mode: selectedMode
        }
      })
      setOpenStatusDialog(true);
    }
  };

  const handleModeSwitchClick = (newMode) => {
    setSelectedMode(newMode);
    // if (graphIndex === 0) {
    //   console.log(newMode)
    //   dispatch({...state,
    //     mode: newMode,
    //   });
    // }

    const newKeys = allKeys[newMode];
    setDataKeys(newKeys);

    handleWeekSwitch(
      undefined,
      undefined,
      undefined,
      newKeys,
      undefined,
      newMode
    );
  };

  const handleWeekSwitch = async(
    newWeek,
    data,
    commons,
    keys,
    submissions,
    mode
  ) => {
    if (newWeek === undefined) {
      newWeek = selectedWeek;
    }
    if (data === undefined) {
      data = progressData;
    }
    if (commons === undefined) {
      commons = commonData;
    }
    if (keys === undefined) {
      keys = dataKeys;
    }
    if (submissions === undefined) {
      submissions = submissionData;
    }
    if (mode === undefined) {
      mode = selectedMode;
    }

    setSelectedWeek(newWeek);
    const graphIndexStr = graphIndex.toString();
    dispatch({
      ...state,
      mode: graphIndex === 0 ? mode : state.mode,
      statusProps: {
        ...state.statusProps,
        props: {
          ...state.statusProps.props,
          [graphIndexStr]: {
            ...state.statusProps.props[graphIndexStr],
            week: newWeek,
            mode: mode
          }
        }
      }
    });

    if(data.length > 0) {
      setMax(data[0][keys.max]);
      setSelectedWeekData(data);
      setcommonDataToDisplay({
          avg: commons[keys.cumulativeAvgs],
          mid: commons[keys.cumulativeMidExpected],
          min: commons[keys.cumulativeMinExpected],
      });
    }
    // OLD ADAPTER CODE
    // if (
    //   ["exercises", "points"].includes(mode) &&
    //   data[newWeek - 1] !== undefined &&
    //   data[newWeek - 1]["data"] !== undefined
    // ) {
      
     
    //   setMax(data[newWeek - 1]["data"][0][keys.max]);
    //   setSelectedWeekData(data[newWeek - 1].data);
     
   
    // }

    // let newCountData = undefined;

    // if (mode === "submissions") {
    //   if (submissions !== undefined && submissions[newWeek - 1] !== undefined) {
    //     newCountData = submissions[newWeek - 1].data;
    //     // setSelectedCountData(newCountData);
    //   }
    // } else {
    //   if (commitData !== undefined && commitData.length > 1) {
    //     // const weekStr = newWeek.toString();
    //     // const key =
    //     //   weekStr.length < 2
    //     //     ? `0${weekStr}`
    //     //     : weekStr !== "14"
    //     //     ? weekStr
    //     //     : "01-14";
    //     // console.log(newWeek)
    //     // console.log(commitData)
    //     newCountData = commitData.find(module => parseInt(module.week) === parseInt(newWeek)) !== undefined
    //       ? commitData.find(module => parseInt(module.week) === parseInt(newWeek)).data
    //       : []
    //     // console.log(newCountData)
    //     // setSelectedCountData(newCountData);
    //   }
    // }

    // if (newCountData !== undefined && data[newWeek - 1] !== undefined) {
    //   updateTreshold(treshold, data[newWeek - 1].data, newCountData);
    // }
  };

  const handleToggleRefLineVisibilityClick = (targetLine) => {
    // Find reference lines:
    const lines = document.querySelectorAll(
      "g.recharts-layer.recharts-reference-line"
    );

    // Toggle line visibility:
    lines.forEach((node) => {
      const textContent = node.firstChild.nextSibling.textContent;

      if (targetLine === "Expected" && !textContent.includes("Av")) {
        setShowExpected(!showExpected);
        node.style.display = showExpected ? "none" : "";
      } else if (targetLine === "Average" && textContent.includes("Av")) {
        setShowAvg(!showAvg);
        node.style.display = showAvg ? "none" : "";
      }
    });
  };

  const updateTreshold = (newTreshold, selectedData, selectedCountD) => {
    if (selectedData === undefined) {
      selectedData = selectedWeekData;
    }
    if (selectedCountD === undefined) {
      selectedCountD = selectedCountData;
    }

    setTreshold(newTreshold);

    if (selectedData[0] !== undefined) {
      // Calculate how many students fall below required point count:
      const requiredPts = selectedData[0].maxPts * newTreshold;
      const studentCountBelowTreshold = selectedCountD.filter(
        (student) => student.cumulativePoints < requiredPts
      ).length;

      setStudentsBelowTreshold(studentCountBelowTreshold);
    }
  };

  useEffect(() => {
    getCourseIDs().then(data => setCourseIDs(data))
  }, []);

  useEffect(() => {
    const graphIndexStr = graphIndex.toString();
    if (!Object.keys(state.statusProps.props).includes(graphIndexStr)) {
      const newGraphProps = {
        [graphIndexStr]: {
          courseID: courseID,
          mode: selectedMode,
          week: selectedWeek
        }
      };
      dispatch({...state,
        statusProps: {
          ...state.statusProps,
          props: Object.assign(state.statusProps.props, newGraphProps)}
      });
    }
  },[]);

  // OLD ADAPTER CODE
  // useEffect(() => {
  //   if ((graphIndex === 0 && isNaN(state.courseID)) || (graphIndex !== 0 && isNaN(courseID))) return;
  //   const courseData = Object.keys(state.statusProps.props).length > graphIndex
  //   ? state.statusProps.props[graphIndex.toString()].courseID
  //   : courseID
  //   dataService.getData(graphIndex === 0 ? state.courseID : courseData).then(response => {
  //     const [pData, commons, submissions] = response;
      
  //     setProgressData(pData);
  //     setCommonData(commons);
     
  //     setSubmissionData(submissions);
  //     setWeeks(pData.map(week => week.week));

  //     // Set initial UI state:
  //     handleWeekSwitch(
  //       Object.keys(state.statusProps.props).length 
  //         ? state.statusProps.props[graphIndex.toString()].week 
  //         : selectedWeek, 
  //       pData, 
  //       commons, 
  //       undefined, 
  //       submissions,
  //       Object.keys(state.statusProps.props).length 
  //         ? state.statusProps.props[graphIndex.toString()].mode 
  //         : selectedMode);
  //   });

  //   getStatusData(graphIndex === 0 ? state.courseID : courseID, parseInt(selectedWeek)).then(res => {
  //     const commits = res ? res.data : [];
  //     setCommitData(commits);
  //     // Select count data from correct week:
  //     const selected =
  //       commits !== undefined && commits.length > 0
  //         ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)) !== undefined
  //           ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)).data
  //           : []
  //         : [];

  //     // console.log("selected", selected)
  //     setSelectedCountData(selected);

  //     updateTreshold(treshold, undefined, commits);

  //     if (commits !== undefined && commits.length > 0 && commits[0].data) {
  //       setStudentRange([1, commits[0].data.length]);
  //       setMaxlength(commits[0].data.length);
  //     } 
  //   });

  //   dataService.getCommitData(graphIndex === 0 ? state.courseID : courseData).then((response) => {
  //     const commits = response;
     
  //     setCommitData(commits);
  //     // Select count data from correct week:
  //     const selected =
  //       commits !== undefined && commits.length > 0
  //         ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)) !== undefined
  //           ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)).data
  //           : []
  //         : [];

  //     setSelectedCountData(selected);

  //     updateTreshold(treshold, undefined, commits);

  //     if (commits !== undefined && commits.length > 0 && commits[0].data) {
  //       setStudentRange([1, commits[0].data.length]);
  //       setMaxlength(commits[0].data.length);
  //     }
  //   });

  // }, [graphIndex === 0 ? state.courseID : courseID, selectedWeek]); //eslint-disable-line

  // useEffect(() => {
  //   MQTTConnect(dispatch).then((newClient) => setClient(newClient));
  //   return () => client.end();
  // }, []);

  useEffect(() => {
    if (graphIndex === 0) {
      const _mode = determineMode(state);
      if (selectedMode !== _mode) {
        handleModeSwitchClick(_mode);
      }
    }
  }, [state.mode]); //eslint-disable-line

  // useEffect(() => {
  //   // if empty array then render nothing, if more than one intance(s), render first one;
  //   const currentIntance = state.instances[0] || "";
  //   setSelectedStudent(currentIntance);
  // }, [state.instances]);


  useEffect(() => {
    if (sameSortProps) {
      setSortProps(sortConfig)
    }
    let dataToSort = selectedWeekData.map(weekData => {
      let commitData = selectedCountData.find(countData => countData.id === weekData.id)
      return { ...weekData, ...commitData}
    })
    if(dataToSort && dataToSort.length > 0){
      const sortedData = helpers.moduleDataSorting(dataToSort, sortConfig);
      if(selectedMode === "commits" || selectedMode === "submissions" ){ 
        setSelectedCountData(sortedData);
      }else{ 
        setSelectedWeekData(sortedData);
      }
    }
    // if (progressData && submissionData && commitData){
    //   if (progressData.length && submissionData.length && commitData.length) {
        
    //     const result = helpers.dataSorting(progressData, commitData, submissionData, sortConfig)
    //     setProgressData(result.sortedProgress);
    //     setCommitData(result.sortedCommit);
    //     setSubmissionData(result.sortedSubmission);

    //     const key = selectedMode === "commits"
    //       ? selectedWeek.toString().length < 2
    //         ? `0${selectedWeek}`
    //         : selectedWeek.toString()
    //       : selectedWeek.toString();

    //     if (selectedMode === "commits") {
    //       const selected = result.sortedCommit !== undefined && result.sortedCommit.length > 0
    //           ? result.sortedCommit.find(module => module.week === key).data
    //           : [];
    //       setSelectedCountData(selected);
    //     } else if (selectedMode === "submissions") {
    //       const selected = result.sortedSubmission !== undefined && result.sortedSubmission.length > 0
    //         ? result.sortedSubmission.find(module => module.week === key).data
    //         : [];
    //       setSelectedCountData(selected);
    //     } else {
    //       const selected = result.sortedProgress !== undefined && result.sortedProgress.length > 0
    //         ? result.sortedProgress.find(module => module.week === key).data
    //         : [];
          
    //       setSelectedWeekData(selected)
    //     }
    //   }
    // }
  }, [sortConfig, graphIndex === 0 ? state.courseID : courseID]) //eslint-disable-line

  useEffect(() => {
    if ((graphIndex === 0 && isNaN(state.courseID)) || (graphIndex !== 0 && isNaN(courseID))) return;

    // getStatusData(graphIndex === 0 ? state.courseID : courseID, parseInt(selectedWeek)).then(res => {
    //   setSelectedCountData(res ? res.data : []);
    //   updateTreshold(treshold, undefined, res.data);

    //     if (res && res.data.length > 0){
    //       setStudentRange([1, res.data.length]);
    //       setMaxlength(res.data.length);
    //     }
    // });
    getStatusData(graphIndex === 0 ? state.courseID : courseID, parseInt(selectedWeek)).then(res => {
      setSelectedCountData(res ? res : []);
      // setCommitSubmissionData(res ? res : []);
      updateTreshold(treshold, undefined, res);

      if (res && res.length > 0){
        setStudentRange([1, res.length]);
        setMaxlength(res.length);
      }
    });
  }, [graphIndex === 0 ? state.courseID : courseID, selectedWeek, graphIndex === 0 ? state.mode : selectedMode])

  useEffect(() => {
    if (JSON.stringify(sortConfig) !== JSON.stringify(sortProps)) {
      setSortConfig(sortProps);
    }
  }, [sortProps, sameSortProps])

  useEffect(() => {
    getExerciseData(graphIndex === 0 ? state.courseID : courseID, parseInt(selectedWeek)).then(res => {
      const {weeks, data, cumulatives} = res;  
      setWeeks(weeks);
        setPointExerciseData(data);
        handleWeekSwitch(
        Object.keys(state.statusProps.props).length 
          ? state.statusProps.props[graphIndex.toString()].week 
          : selectedWeek, 
        data, 
        cumulatives, 
        undefined, 
        undefined,
        Object.keys(state.statusProps.props).length 
          ? state.statusProps.props[graphIndex.toString()].mode 
          : selectedMode);
    });
  }, [graphIndex === 0 ? state.courseID : courseID, selectedWeek, graphIndex === 0 ? state.mode : selectedMode])

  // console.log(selectedWeek, selectedMode)
  // console.log(state)
  // console.log("selectedCountData", selectedCountData)
  return (
    // (graphIndex !== 0 && selectedCountData.length === 0 || selectedWeekData.length === 0)
    //   ? <Modal show={true} size="sm" centered >
    //     <Modal.Body style={{ paddingLeft: "45%"}}>
    //       <Spinner animation="border" />
    //     </Modal.Body>
    //   </Modal>
    //   : 
      <>
        <DropdownMenu
          handleClick={handleCourseDataSelected}
          options={courseIDs}
          selectedOption={graphIndex === 0 ? state.courseID : courseID}
          title="Course ID: "
        />
        <ControlAccordion
          handleModeClick={handleModeSwitchClick}
          selectedMode={selectedMode}
          showableLines={showableLines}
          handleToggleRefLineVisibilityClick={
            handleToggleRefLineVisibilityClick
          }
          showAvg={showAvg}
          showExpected={showExpected}
          handleWeekClick={handleWeekSwitch}
          weeks={weeks}
          selectedWeek={selectedWeek}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          modes={modes}
          sortProps={sortProps}
          setSortProps={setSortProps}
          sameSortProps={sameSortProps}
        />

        <MultiChart
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          data={selectedWeekData.slice(studentRange[0] - 1, studentRange[1])}
          dataKeys={dataKeys}
          commonData={commonDataToDisplay}
          commonKeys={commonKeys}
          axisNames={axisNames[selectedMode]}
          max={max}
          handleClick={handleStudentClick}
          visuMode={selectedMode}
          countData={selectedCountData.slice(studentRange[0] - 1, studentRange[1])}
          studentsBelowTreshold={studentsBelowTreshold}
          updateTreshold={updateTreshold}
          treshold={treshold}
        />
        <InputRange values={studentRange} maxlength={maxlength} setStudentRange={setStudentRange} />
        {/* {allowSync && <button
          onClick={() => {
            const instances = selectedStudent ? [selectedStudent] : [];
            dispatch({...state,
              mode: selectedMode,
              instances: instances,
            });
          }}
        >
          Sync
        </button>} */}

        <ConfigDialog
          title={{
            button: "Show student detail",
            dialog: "Commit details",
            confirm: "Close",
          }}
          openDialog={openStatusDialog}
          setOpenDialog={ openState => setOpenStatusDialog(openState) }
        >
          <StudentDetailView
            selectedStudentID={state.statusDialogProps.studentID}
            selectedWeek={selectedWeek}
            courseID={state.statusDialogProps.courseID}
          />
        </ConfigDialog>
      </>
  );
};

export default StatusTab;
