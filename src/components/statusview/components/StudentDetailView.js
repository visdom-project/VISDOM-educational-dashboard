/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import dataService from "../services/studentData";
import { Spinner, Pagination, Tabs, Tab } from "react-bootstrap";
import { WEEK_NUMBER } from "../services/constant";

const parseName = (name) => {
  const index = name.indexOf("|fi:");
  return name.slice(index + "|fi:".length, name.length - 1);
};

const ProjectDisplay = ({ project }) => {

  const exerciseNumber = project.name.split("|")[0];
  const projectName = parseName(project.name).split("|en:")[0];
  const isGitProject = project.commit_name.length > 0;

  return (
    <div className="partial-border" style={{ width: "18vw" }}>
      <h3>
        {exerciseNumber} {projectName}
      </h3>
      <div style={{ paddingLeft: "8vh" }}>
        Gathered points: {project.points}/{project.max_points}
        <br/>
        Exercise passed: {project.passed}
        <br/>
        Submissions: {project.submissions}
        <br/>
        <div
          style={{
            paddingTop: "0.5em",
            color: isGitProject ? "black" : "lightgrey",
            fontStyle: isGitProject ? "normal" : "italic",
          }}
        >
          Qt project name: {isGitProject ? project.commit_name : " –"}
          <br/>
          Commits: {project.commits}
        </div>
      </div>
    </div>
  );
};

const ModuleDisplay = ({ module, index }) => {

  return (
    <div className="student-info-box">
      <div
        style={{
          backgroundColor: "darkgrey",
          border: "lightgrey 1px solid",
          borderRadius: "3px",
          width: "12px",
        }} />

      <div>
        <h3>
          Module {index + 1}: {parseName(module.name)}
        </h3>
        <div
          id={`module-${index}`}
          style={{
            paddingLeft: "4vh",
            marginTop: "1em",
            marginBottom: "1.2em",
            width: "20vw",
          }}
        >
          Gathered points: {module.points}/{module.max_points}
          <br/>
          Module passed: {module.passed ? "true" : "false"}
          <br/>
          Total submissions: {module.submissions}
        </div>
      </div>

      <div id={`module-${module.name}`}>
        <div
          className="fit-row"
          style={{ flexWrap: "wrap", paddingBottom: "1em", width: "37vw" }}
        >
          {module.exercises.map(exercise => (
            <ProjectDisplay key={exercise.name} project={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PointsDisplay = ({ data, selectedWeek}) => {
  const [week, setWeek] = useState(selectedWeek);
  const paginationItems = Array.from({length: WEEK_NUMBER}, (_, i) => i + 1);
  console.log(week)
  return (
    <Tabs defaultActiveKey="detail" id="student-info-tab">
      <Tab eventKey="summary" title="Summary">
        <div>
          {data.map((module, index) => (
            <ModuleDisplay
              key={module.name}
              module={module}
              index={index}
            />
          ))}
      </div>
      </Tab>
      <Tab eventKey="detail" title="Week detail">
        <ModuleDisplay
          key={data[week - 1].name}
          module={data[week - 1]}
          index={week - 1}
        />
        <Pagination style={{ justifyContent: "center" }}>
          <Pagination.First onClick={() => setWeek(1)}/>
          <Pagination.Prev onClick={() => setWeek(week === 1 ? 1 : week - 1)}/>
          {paginationItems.map(p => (
            <Pagination.Item 
              key={p}
              value={p}
              active={parseInt(p, 10) === parseInt(week, 10)}
              onClick={e => {
                e.preventDefault();
                setWeek(parseInt(e.target.text, 10))}
              }
            >
              {p}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setWeek(week === WEEK_NUMBER ? WEEK_NUMBER : week + 1)}/>
          <Pagination.Last onClick={() => setWeek(WEEK_NUMBER)}/>
        </Pagination>
      </Tab>
    </Tabs>
  );
};

const StudentDetailView = ({ selectedStudentID, selectedWeek }) => {
  const [student, setStudent] = useState({});

  useEffect(() => {
    dataService
      .getStudentData(selectedStudentID)
      .then(response => response && setStudent(response));
  }, [selectedStudentID]); // eslint-disable-line

  return (
    Object.keys(student).length > 0 ?
      <div style={{ marginBottom: document.documentElement.clientHeight * 0.1 }}>
        <h2>Exercise completion details</h2>
        <h3>
          <strong>Student: {student.personal_information.email}</strong>
        </h3>
        <PointsDisplay data={student.modules} selectedWeek={selectedWeek} />
      </div>
      : <Spinner animation="border" />
  );
};

export default StudentDetailView;
