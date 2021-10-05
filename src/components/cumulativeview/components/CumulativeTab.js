/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
  ResponsiveContainer,
} from "recharts";
import DropdownMenu from "./DropdownMenu";
import CheckBoxMenu from "./CheckBoxMenu";
import ConfigDialog from "./ConfigDialog";
import GroupDisplay from "./GroupDisplay.js";
import StudentSelector from "./StudentSelector";

// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
import { 
  // getAllStudentsData, 
  // fetchStudentData, 
  fetchStudentsData } from "../services/studentData";
import { getAgregateData } from "../services/courseData";

import {
  useMessageState,
  useMessageDispatch,
} from "../../../contexts/messageContext";

// Helper:
const MODE_MAPPING = {
  "points": "cumPoints",
  "exercises": "cumExercises",
  "commits": "cumCommit",
  "submissions": "cumSubmission",
};
const MODE_AVG_MAPPING = {
  "points": "avg_cum_points",
  "exercises": "avg_cum_exercises",
  "commits": "avg_cum_commits",
  "submissions": "avg_cum_submissions",
}

const studentsDataMappingToChartData = (studentsData, mode) => {
  const attribute = MODE_MAPPING[mode];
  if (!Object.keys(studentsData).length)
  {
    return [];
  }
  const numberOfWeeks = Object.values(studentsData)[0].length;
  const transformedData = [...Array(numberOfWeeks).keys()].map(week => {
    const weekObj = {week: week + 1};
    Object.entries(studentsData).map(([student, studentData]) => weekObj[student] = studentData[week][attribute]);
    return weekObj;
  })
  return transformedData;
}
const getAverageData = (studentsData, selectedMode) => {
  const data = Object.values(studentsData);
  if (!data.length){
    return null;
  }
  const numberOfWeeks = Object.values(studentsData)[0].length;
  const dataKey = MODE_MAPPING[selectedMode];
  const sumData = Object.values(studentsData).reduce((prev, current) => {
    current.forEach((element, index) => prev[index] = prev[index] + element[dataKey]);
    return prev;
  }, new Array(numberOfWeeks).fill(0));
  return sumData.map(e => e / Object.values(data).length);
}
const getExpectData = (courseData, selectedMode) => courseData.map(gradeData => gradeData.map(weekData => weekData[MODE_AVG_MAPPING[selectedMode]]));

/////////////////////////


const Controls = (props) => {
  const {
    handleClick,
    modes,
    selectedMode,
    showableLines,
    showOptions,
    setShowOptions,
  } = props;

  return (
    <div className="fit-row" style={{ display: "flex" }}>
      <CheckBoxMenu
        options={showableLines}
        handleClick={(option) => setShowOptions({...showOptions, [option]: !showOptions[option]})}
      />
      <DropdownMenu
        handleClick={handleClick}
        options={modes}
        selectedOption={selectedMode}
        title={"Visualization mode:"}
      />
      {/* This feature feature is not implemented (Vivian's idea) */}
      {/* <button
        id={"showGradesButton"}
        onClick={() => console.log("TODO: Show grades")}
      >
        Show grades
      </button> */}
    </div>
  );
};

const ExpectedLabel = ({ index, x, y, strokeColor, grade, display }) => {
  if (display && index % 2 === 1) {
    return (
      <text
        x={x + 4}
        y={y}
        dy={4}
        fill={strokeColor}
        fontSize={12}
        textAnchor="start"
      >
        {grade}
      </text>
    );
  }
  return <></>;
};

// eslint-disable-next-line max-lines-per-function
const CumulativeTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();


  // const setDisplayedStudents = (instances) => dispatch({ ...state, instances: instances});
  const setTimescale = (timescale) => dispatch({ ...state, timescale: timescale });
  const setSelectedMode = (newMode) => dispatch({ ...state, mode: newMode});

  // const [client, setClient] = useState(null);

  const [studentIds, setStudentIds] = useState([]);
  const [studentsData, setStudentsData] = useState({});
  const [courseData, setCourseData] = useState([]);
  const [maxlength, setMaxlength] = useState(0);
  const [displayedStudents, setDisplayedStudents] = useState([]);

  // TODO: maybe a constant file for this
  const modes = ["points", "exercises", "commits", "submissions"];
    // TODO: change this to use context
  // const [selectedMode, setSelectedMode] = useState(modes[0]);

  const selectableModes = modes.filter((mode) => mode !== state.mode);

  const grades = [0, 1, 2, 3, 4, 5];
  const initialGradeGroup = new Array(grades.length + 2).fill(true); // for > max point option & "all students" option
  const [gradeGroup, setGradeGroup] = useState(initialGradeGroup);

  // depencies from rechart: the brush doesnt update the timerange itself with the props
  // const [linechartShouldUpdate, setLineChartShouldUpdate] = useState(0);

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
    // setLineChartShouldUpdate(linechartShouldUpdate+1);

  }, [state.timescale, maxlength]);

  useEffect(() => {
    // fetch every student (make many requests)
    // getAllStudentsData().then(list => {
    //   setStudentIds(list);
    //   const studentsDtataList = list.map(student => fetchStudentData(student));
      // const studentDataObj = {};
      // const studentDataPromise = Promise.all(studentsDtataList).then(data => data.map( (studentData,index) => studentDataObj[list[index]]= studentData))
      // .then(() => setStudentsData(studentDataObj));
    // });
    // fetch whole data at once
    fetchStudentsData().then(data => {
      setStudentsData(data);
      setStudentIds(Object.keys(data));
      setDisplayedStudents(Object.keys(data));

      // setup timescale
      try {
        setMaxlength((Object.values(data)[0].length) * 7);
      }
      catch (err){
        // Do nothing
      }         
    });
    Promise.all( grades.map(grade => getAgregateData(grade)) ).then(expectValues => setCourseData(expectValues));
  }, []);
  


  const showableLines = ["Average", "Expected"];
  const [showOptions, setShowOptions] = useState({
    Average: true,
    Expected: true,
  });
  
  const [displayedCumulativeData, setDisplayedCumulativeData] = useState([
    { name: "init" },
  ]);
  // hard coding const without metadata
  // const maxlength = 98;
  // const defaultTimescale = {
  //   start: 0,
  //   end: 0
  // }
  // const timescale = state.timescale || defaultTimescale;

  // console.log(state.timescale);
  // console.log(!state.timescale ? 0 : Math.floor(state.timescale.end / 7))
  // const [timescale, setTimescale] = useState({
  //   start: 0,
  //   end: maxlength,
  // });

  // graph configure
  const axisNames = ["Week", ""];
  const syncKey = "syncKey";
  const avgDataKey = "weeklyAvgs";
  const dataKey = "name";
  const avgStrokeWidth = 3;
  const studentStrokeWidth = 2;
  const studentStrokeColor = "#8884d861";
  const expectedStrokeColor = "#46ddae82";
  const avgStrokeColor = "#b1b1b1";
  const margins = { top: 10, right: 10, left: 20, bottom: 25 };

  // const determineMode = (s) => s && s.mode ? s.mode : modes[0];


  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    if (!state.mode) {
      setSelectedMode(modes[0]);
      return;
    }
    //average goes here ...
    
    const avgData = {
      [avgDataKey]: getAverageData(studentsData, state.mode),
    };

    const expectData = getExpectData(courseData, state.mode).reduce( (obj, currentValue, currentIndex) => {
           obj[`avg_expect_${currentIndex}`] = currentValue;
           return obj;
         }, {});
    const newData = studentsDataMappingToChartData({...studentsData}, state.mode);

    Object.entries({...avgData, ...expectData}).forEach(([dataKey, data]) => {
      newData.forEach((weekData, index) => weekData[dataKey] = data[index]);
    });

    setDisplayedData(newData);
  }, 
  [state.mode, studentIds, studentsData, courseData]
  );

  // useEffect(() => {
  //   if (!state.instances || !state.instances[0]) {
  //     // setDisplayedStudents(studentIds);
  //     return;
  //   }
  //   // setDisplayedStudents(state.instances);
  // }, [state.instances]); //eslint-disable-line


  // Toggle selection of a student that is clicked in the student list:
  const handleListClick = (id) => {
    const targetNode = document.querySelector(`#li-${id}`);

    if (targetNode === null) {
      console.log(`Node with id: ${id} was null!`);
      return;
    }

    if (targetNode.style.color === "grey") {
      // setDisplayedStudents(displayedStudents.concat(targetNode.textContent));
      targetNode.style.color = "black";
    } else {
      handleStudentLineClick(id);
      document.querySelector(`#li-${id}`).style.color = "grey";
    }
  };

  // Hide student that was clicked from the chart:
  const handleStudentLineClick = (id) => {
    setDisplayedStudents(
      displayedStudents.filter((student) => student !== id)
    );
  };

  const handleModeClick = (newMode) => {
    if (state.mode === newMode) {
      return;
    }
    setSelectedMode(newMode);
  };

  const handleToggleStudentGroupClick = (groupIdentifier, groupState) => {
    if (groupIdentifier === "all") {
      setDisplayedStudents(groupState ? studentIds : []);
      setGradeGroup(new Array(8).fill(groupState));
    } else {
      const newGroup = [...gradeGroup];
      newGroup[groupIdentifier] = groupState;

      if (groupState === false) {
        newGroup[newGroup.length - 1] = false;
      }

      if (!newGroup.slice(0, newGroup.length - 1).some((e) => e === false)) {
        newGroup[newGroup.length - 1] = true;
      }
      setGradeGroup(newGroup);

      const targetData =
        displayedCumulativeData[displayedCumulativeData.length - 1];
      const targetGrade = parseInt(groupIdentifier);

      // Calculate point range of target students:
      const pointMinimum =
        targetGrade < 1
          ? 0
          : targetData[`avg_cum_${state.mode}_grade_${targetGrade - 1}`];
      const pointMaximum =
        targetGrade < 6
          ? targetData[`avg_cum_${state.mode}_grade_${targetGrade}`]
          : 2000;

      // Select students that belong to given point range:
      const targetStudents = Object.keys(targetData).filter(
        (studentId) =>
          pointMinimum <= targetData[studentId] &&
          pointMaximum >= targetData[studentId]
      );

      // TODO: have state of student visibility instead of doing this
      // Toggle the "visibility" of the selected students in the student listing:
      // targetStudents
      //   .filter(
      //     (student) =>
      //       !["week", "weeklyAvgs"].includes(student) &&
      //       !student.startsWith("avg_")
      //   )
      //   .forEach(
      //     (studentId) =>
      //       (document.querySelector(`#li-${studentId}`).style.color = color)
      //   );

      // Toggle the visibility of students by selecting correct group of students to be displayed:
      const disp = groupState
        ? displayedStudents.concat(
            targetStudents.filter((student) => !student.startsWith("avg_"))
          )
        : displayedStudents.filter(
            (student) =>
              !targetStudents.includes(student) && !student.startsWith("avg_")
          );
      setDisplayedStudents(disp);
    }
  };
  if (!state.mode) {
    return null;
  }

  return (
    <div className="chart" style={{ paddingTop: "30px" }}>
      <h1>Cumulative Visualization</h1>
      <h2>{`Weekly ${state.mode}`}</h2>
      
      <ConfigDialog
        title={{
          button: "Show view configuration",
          dialog: "Select Student Group",
          confirm: "OK",
        }}
      >
        <div className="fit-row">
          <GroupDisplay
            grades={grades}
            handleClick={handleToggleStudentGroupClick}
            groupSelected={gradeGroup}
          />
          <StudentSelector students={studentIds} handleClick={handleListClick} />
        </div>

        <div className="fit-row">
          <Controls
            handleClick={handleModeClick}
            modes={selectableModes}
            selectedMode={state.mode}
            showableLines={showableLines}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
          ></Controls>
        </div>
      </ConfigDialog>
      <ResponsiveContainer
        minWidth="300px"
        minHeight="700px"
      >
        <LineChart
          className="intendedChart"
          data={displayedData}
          syncId={syncKey}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKey}
            label={{ value: axisNames[0], position: "bottom" }}
          />
          <YAxis
            label={{
              value: `${state.mode}`,
              angle: -90,
              position: "left",
              offset: -10,
            }}
          />

          {
            // Draw average point lines for each grade from history data:
            grades.map((index) => (
              <Line
                key={`avg_expect_${index}`}
                type="linear"
                dot={false}
                label={
                  <ExpectedLabel
                    grade={index}
                    strokeColor={"#78b5a2"}
                    display={showOptions["Expected"]}
                  />
                }
                dataKey={`avg_expect_${index}`}
                stroke={expectedStrokeColor}
                strokeWidth={avgStrokeWidth}
                style={{ display: showOptions["Expected"] ? "" : "none" }}
              ></Line>
            ))
          }

          {displayedStudents.map((student) => (
            <Line
              key={student}
              // onClick={(id) => handleStudentLineClick(id)}
              className="hoverable"
              type="linear"
              dot={false}
              dataKey={student}
              stroke={studentStrokeColor}
              strokeWidth={studentStrokeWidth}
            ></Line>
          ))}

          <Line
            id={avgDataKey}
            type="linear"
            dataKey={avgDataKey}
            dot={false}
            stroke={avgStrokeColor}
            strokeWidth={avgStrokeWidth}
            style={{ display: showOptions["Average"] ? "" : "none" }}
          />
          {state.timescale && <Brush
          // key={`brush-cumulative-${linechartShouldUpdate}`}
            startIndex={Math.floor(state.timescale.start / 7)}
            endIndex={Math.floor(state.timescale.end / 7)}
            tickFormatter={(tick) => tick + 1}
            onChange={(e) => {
              const newTimescale = {
                start: e.startIndex * 7,
                end: (e.endIndex + 1) * 7 - 1,
              }             

              if (state.timescale.start !== newTimescale.start ||
                state.timescale.end !== newTimescale.end) {
                  setTimescale(newTimescale);
              }
            }}
          />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeTab;
