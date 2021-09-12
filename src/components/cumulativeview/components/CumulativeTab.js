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
import dataService from "../services/progressData";
import GroupDisplay from "./GroupDisplay.js";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
import {
  useMessageState,
  useMessageDispatch,
} from "../../../contexts/messageContext";

const Controls = (props) => {
  const {
    handleClick,
    modes,
    selectedMode,
    showableLines,
    handleToggleRefLineVisibilityClick,
    showAvg,
    showExpected,
  } = props;

  return (
    <div className="fit-row" style={{ display: "flex" }}>
      <CheckBoxMenu
        options={showableLines}
        handleClick={handleToggleRefLineVisibilityClick}
        showAvg={showAvg}
        showExpected={showExpected}
      />
      <DropdownMenu
        handleClick={handleClick}
        options={modes}
        selectedOption={selectedMode}
        title={"Visualization mode:"}
      />
      <button
        id={"showGradesButton"}
        onClick={() => console.log("TODO: Show grades")}
      >
        Show grades
      </button>
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

  // const [client, setClient] = useState(null);
  const [lineChartShouldUpdate, setLineChartShouldUpdate] = useState(0);

  const [studentIds, setStudentIds] = useState([]);
  // const [weeklyPoints, setWeeklyPoints] = useState([]);
  const [cumulativePoints, setCumulativePoints] = useState([{ name: "init" }]);
  // const [weeklyExercises, setWeeklyExercises] = useState([]);
  const [cumulativeExercises, setCumulativeExercises] = useState([
    { name: "init" },
  ]);
  // const [weeklyCommits, setWeeklyCommits] = useState([]);
  const [cumulativeCommits, setCumulativeCommits] = useState([
    { name: "init" },
  ]);
  // const [weeklySubmissions, setWeeklySubmissions] = useState([]);
  const [cumulativeSubmissions, setCumulativeSubmissions] = useState([
    { name: "init" },
  ]);

  const modes = ["points", "exercises", "commits", "submissions"];
  
  const initialSelectedGroup = Array(8).fill(true);
  const [group, setGroup] = useState(initialSelectedGroup);

  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [displayedModes, setdisplayedModes] = useState(
    modes.filter((mode) => mode !== selectedMode)
  );
  
  const showableLines = ["Average", "Expected"];
  const [showAvg, setShowAvg] = useState(true);
  const [showExpected, setShowExpected] = useState(true);

  const [displayedStudents, setDisplayedStudents] = useState([]);
  // const [displayedData, setDisplayedData] = useState([]);
  const [displayedCumulativeData, setDisplayedCumulativeData] = useState([
    { name: "init" },
  ]);
  
//  hard coding const without metadata
  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength,
  });

  const axisNames = ["Week", "Points"];
  const avgDataKey = "weeklyAvgs";
  const dataKey = "name";

  const selectorHeight = 40;
  const avgStrokeWidth = 3;
  const studentStrokeWidth = 2;
  const studentStrokeColor = "#8884d861";
  const expectedStrokeColor = "#46ddae82";
  const avgStrokeColor = "#b1b1b1";

  const grades = ["0", "1", "2", "3", "4", "5"];

  const determineMode = (s) => {
    if (s && s.mode) {
      return s.mode;
    }
    return modes[0];
  };

  useEffect(() => {
    dataService.getData().then((response) => {
      const [
        weeklyPts,
        cumulativePts,
        // weeklyExers,
        cumulativeExers,
        // weeklyComms,
        cumulativeComms,
        // weeklySubs,
        cumulativeSubs,
      ] = response;

      // setWeeklyPoints(weeklyPts);
      setCumulativePoints(cumulativePts);
      // setWeeklyExercises(weeklyExers);
      setCumulativeExercises(cumulativeExers);

      //get student ids list
      const ids = dataService.getStudentIds(weeklyPts);
      setStudentIds(ids);
      setDisplayedStudents(ids);

      // setDisplayedData(weeklyPts);
      setDisplayedCumulativeData(cumulativePts);
      // setWeeklyCommits(weeklyComms);
      setCumulativeCommits(cumulativeComms);
      // setWeeklySubmissions(weeklySubs);
      setCumulativeSubmissions(cumulativeSubs);
    });
  }, []);

  // useEffect(() => {
  //   return MQTTConnect(dispatch)
  //     .then((newClient) => setClient(newClient))
  //     .then((newClient) => () => newClient.end());
  // }, []);

  useEffect(() => {
    let _mode = determineMode(state);
    if (selectedMode !== _mode) {
      // handleModeClick(_mode);
      setSelectedMode(_mode);
      setdisplayedModes(modes.filter((name) => name !== _mode));
      if (_mode === "points") {
        // setDisplayedData(weeklyPoints);
        setDisplayedCumulativeData(cumulativePoints);
      } else if (_mode === "exercises") {
        // setDisplayedData(weeklyExercises);
        setDisplayedCumulativeData(cumulativeExercises);
      } else if (_mode === "commits") {
        // setDisplayedData(weeklyCommits);
        setDisplayedCumulativeData(cumulativeCommits);
      } else if (_mode === "submissions") {
        // setDisplayedData(weeklySubmissions);
        setDisplayedCumulativeData(cumulativeSubmissions);
      } else {
        console.log("Selected unimplemented mode:", _mode);
      }
    }
  }, [state.mode]); //eslint-disable-line

  useEffect(() => {
    if (!state.timescale) {
      return;
    }
    if (
      state.timescale.start !== timescale.start ||
      state.timescale.end !== timescale.end
    ) {
      setTimescale(state.timescale);
      setLineChartShouldUpdate(lineChartShouldUpdate + 1);
    }
  }, [state.timescale]); //eslint-disable-line

  useEffect(() => {
    if (!state.instances || !state.instances[0]) {
      setDisplayedStudents(studentIds);
      return;
    }
    setDisplayedStudents(state.instances);
  }, [state.instances]); //eslint-disable-line

  // Toggle selection of a student that is clicked in the student list:
  // const handleListClick = (id) => {
  //   const targetNode = document.querySelector(`#li-${id}`);

  //   if (targetNode === null) {
  //     console.log(`Node with id: ${id} was null!`);
  //     return;
  //   }

  //   if (targetNode.style.color === "grey") {
  //     setDisplayedStudents(displayedStudents.concat(targetNode.textContent));
  //     targetNode.style.color = "black";
  //   } else {
  //     handleStudentLineClick(id);
  //   }
  // };

  // Hide student that was clicked from the chart:
  const handleStudentLineClick = (id) => {
    setDisplayedStudents(
      displayedStudents.filter((student) => !student.includes(id))
    );
    document.querySelector(`#li-${id}`).style.color = "grey";
  };

  const handleModeClick = (newMode) => {
    if (selectedMode === newMode) {
      return;
    }

    setSelectedMode(newMode);
    setdisplayedModes(modes.filter((name) => name !== newMode));

    if (newMode === "points") {
      // setDisplayedData(weeklyPoints);
      setDisplayedCumulativeData(cumulativePoints);
    } else if (newMode === "exercises") {
      // setDisplayedData(weeklyExercises);
      setDisplayedCumulativeData(cumulativeExercises);
    } else if (newMode === "commits") {
      // setDisplayedData(weeklyCommits);
      setDisplayedCumulativeData(cumulativeCommits);
    } else if (newMode === "submissions") {
      // setDisplayedData(weeklySubmissions);
      setDisplayedCumulativeData(cumulativeSubmissions);
    } else {
      console.log("Selected unimplemented mode:", newMode);
    }
  };

  const handleToggleRefLineVisibilityClick = (targetLine) => {
    const lines = document.querySelectorAll(
      "g.recharts-layer.recharts-line>path.recharts-curve.recharts-line-curve"
    );

    // Toggle the visibility of drawn reference lines:
    if (targetLine === "Expected") {
      lines.forEach((node) => {
        if (node.outerHTML.includes(`stroke="${expectedStrokeColor}"`)) {
          node.style.display = showExpected ? "none" : "";
        }
      });
      document
        .querySelectorAll(".recharts-layer .recharts-label-list")
        .forEach((node) => (node.style.display = showExpected ? "none" : ""));
      setShowExpected(!showExpected);
    } else {
      lines.forEach((node) => {
        if (node.outerHTML.includes(`stroke="${avgStrokeColor}"`)) {
          node.style.display = showAvg ? "none" : "";
        }
      });
      setShowAvg(!showAvg);
    }
  };



  const handleToggleStudentGroupClick = (groupIdentifier) => {
    console.log(groupIdentifier)
    const showGroup = document.getElementById(
      `input-${groupIdentifier}`
    ).checked;
    const gradeSwitches = document.querySelectorAll(".gradeswitch");
    // const color = showGroup ? "black" : "grey";
    if (groupIdentifier === "all") {
      setDisplayedStudents(showGroup ? studentIds : []);
      gradeSwitches.forEach((node) => (node.checked = showGroup));
      // studentIds.forEach(
      //   (studentId) =>
      //     (document.querySelector(`#li-${studentId}`).style.color = color)
      // );

      setGroup( new Array(8).fill(showGroup));
    } else {
      const newGroup = [...group];
      newGroup[groupIdentifier] = !newGroup[groupIdentifier];

      if (newGroup[groupIdentifier] === false) {
        newGroup[newGroup.length-1] = false;
      }
      if ( !newGroup.slice(0, newGroup.length-1).some(e => e === false)) {
        newGroup[newGroup.length-1] = true;
      }
      setGroup(newGroup);
      const targetData =
        displayedCumulativeData[displayedCumulativeData.length - 1];
      const targetGrade = parseInt(groupIdentifier);

      // Calculate point range of target students:
      const pointMinimum =
        targetGrade < 1
          ? 0
          : targetData[`avg_cum_${selectedMode}_grade_${targetGrade - 1}`];
      const pointMaximum =
        targetGrade < 6
          ? targetData[`avg_cum_${selectedMode}_grade_${targetGrade}`]
          : 2000;

      // Select students that belong to given point range:
      const targetStudents = Object.keys(targetData).filter(
        (studentId) =>
          pointMinimum <= targetData[studentId] &&
          pointMaximum >= targetData[studentId]
      );

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
      const disp = showGroup
        ? displayedStudents.concat(
            targetStudents.filter((student) => !student.startsWith("avg_"))
          )
        : displayedStudents.filter(
            (student) =>
              !targetStudents.includes(student) && !student.startsWith("avg_")
          );

      setDisplayedStudents(disp);

      if (showGroup) {
        // Figure out if all grade groups are selected:
        let allChecked = true;
        gradeSwitches.forEach((node) => {
          if (!node.checked) {
            allChecked = false;
          }
        });

        if (allChecked) {
          // Activate "all students selected" switch:
          const allSwitch = document.getElementById("input-all");
          if (!allSwitch.checked) {
            allSwitch.checked = true;
          }
        }
      } else {
        // Hiding student groups
        // Make sure "all students selected" button is inactive:
        const allSwitch = document.getElementById("input-all");
        if (allSwitch.checked) {
          allSwitch.checked = false;
        }
      }
    }
  };

  return (
    
    <div className="chart" style={{ paddingTop: "30px" }}>
      <h2>{`Cumulative weekly ${selectedMode}`}</h2>

      <ConfigDialog
        title={{button: "Show view configuration",
            dialog: "Select Student Group",
            confirm: "OK"}}
      >
        <div className="fit-row">
          <GroupDisplay
            grades={grades}
            handleClick={handleToggleStudentGroupClick}
            groupSelected={group}
          />
          {/* <StudentSelector students={studentIds} handleClick={handleListClick} /> */}
        </div>

        <div className="fit-row">
          <h2>{`Weekly ${selectedMode}`}</h2>
          <Controls
            handleClick={handleModeClick}
            modes={displayedModes}
            selectedMode={selectedMode}
            showableLines={showableLines}
            handleToggleRefLineVisibilityClick={
              handleToggleRefLineVisibilityClick
            }
            showAvg={showAvg}
            showExpected={showExpected}
          ></Controls>
        </div>
      </ConfigDialog>

      <ResponsiveContainer
        minWidth="300px"
        minHeight="500px"
        key={lineChartShouldUpdate}
      >
        <LineChart
          className="intendedChart"
          data={displayedCumulativeData}
          margin={{ top: 10, right: 10, left: 20, bottom: selectorHeight }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKey}
            label={{ value: axisNames[0], position: "bottom" }}
          />
          <YAxis
            label={{
              value: `cumulative ${selectedMode}`,
              angle: -90,
              position: "left",
              offset: -10,
            }}
          />

          {
            // Draw average point lines for each grade from history data:
            grades.map((index) => (
              <Line
                key={`avg_cum_${selectedMode}_grade_${index}`}
                label={
                  <ExpectedLabel
                    grade={index}
                    strokeColor={"#78b5a2"}
                    display={showExpected}
                  />
                }
                type="linear"
                dot={false}
                dataKey={`avg_cum_${selectedMode}_grade_${index}`}
                stroke={expectedStrokeColor}
                strokeWidth={avgStrokeWidth}
                style={{ display: showExpected ? "" : "none" }}
              ></Line>
            ))
          }

          {
            // Draw student lines:z`
            displayedStudents.map((key) => (
              <Line
                key={key}
                onClick={() => handleStudentLineClick(key)}
                className="hoverable"
                type="linear"
                dot={false}
                dataKey={key}
                stroke={studentStrokeColor}
                strokeWidth={studentStrokeWidth}
              ></Line>
            ))
          }

          <Line
            id={avgDataKey}
            type="linear"
            dataKey={avgDataKey}
            dot={false}
            stroke={avgStrokeColor}
            strokeWidth={avgStrokeWidth}
            style={{ display: showAvg ? "" : "none" }}
          />
          <Brush
            startIndex={Math.floor(timescale.start / 7)}
            endIndex={Math.ceil(timescale.end / 7)}
            tickFormatter={(tick) => tick + 1}
            onChange={(e) => {
              setTimescale({
                start: e.startIndex * 7,
                end: e.endIndex * 7 - 1,
              });
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <button
        onClick={() => {
          dispatch({...state, 
            mode: selectedMode,
            timescale: timescale,
            instances: displayedStudents,
            });
        }}
      >
        Sync
      </button>
    </div>
  );
};

export default CumulativeTab;
