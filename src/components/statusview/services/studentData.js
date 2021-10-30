/* eslint-disable camelcase */
import axios from "axios";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { EXERCISE_INDICES, EXERCISE_INDICES_40 } from "./constant";

// const courseId = process.env.REACT_APP_COURSE_ID;

const getStudentData = (studentID, courseID) => {
  if (!studentID) return {};

  // const baseUrl = ElasticSearchConfiguration.createUrl(
  //   "gitlab-course-40-commit-data-anonymized/_search"
  // );
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}&username=${studentID}`;
  const request = axios
    .get(baseUrl, {
      // Accept: "application/json",
      // "Content-Type": "application/json",
      headers:{
        Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    }).then(response => response.data.results[0])
    .then(response => {
      // const student = response && response.data.hits.hits[0]._source.results.find(
      //   s => s.student_id === studentID
      // );
      const student = response;

      if (!student) return {};

      const studentData = {
        personal_information: {
          id: student.id,
          username: student.username,
          student_id: student.student_id,
          email: student.email,
          full_name: student.full_name,
        },
        modules: student.points.modules.map(module => ({
          name: module.name.raw,
          max_points: module.max_points,
          points: module.points,
          passed: module.passed,
          submissions: module.submission_count,
          exercises: module.exercises.map(ex => ({
            commit_name: "",
            name: ex.name.raw,
            points: ex.points,
            max_points: ex.max_points,
            submissions: ex.submission_count,
            commits: 0
          }))
        }))
      };

      student.commits.forEach(module => {
        const moduleIndex = parseInt(module.module_name.slice(-2)) - 1;
        const commitModule = studentData.modules[moduleIndex];

        module.projects.forEach(project => {
          const exerciseIndex = courseID === 40
            ? EXERCISE_INDICES_40[project.name.toLowerCase()]
            : EXERCISE_INDICES[project.name.toLowerCase()];
          
          if (exerciseIndex !== undefined) {
            const exercise = commitModule.exercises[exerciseIndex]
            exercise.commits = project.commit_count;
            exercise.commit_name = project.name
          } else {
            console.log(`Could not find exercise for git project '${project.name}' module ${module.module_name}`);
          }
        });
      });

      return studentData;
    })
    .catch(() => [[], []]);

  return request;
};

//eslint-disable-next-line
export default { getStudentData };
