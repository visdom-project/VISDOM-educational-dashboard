/* eslint-disable no-console */
/* eslint-disable camelcase */

import axios from "axios";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
const courseId = process.env.REACT_APP_COURSE_ID;
// TODO: fix this
// const baseUrl = ElasticSearchConfiguration.createUrl(
//   "gitlab-course-40-commit-data-anonymized/_search"
// );

const getAllStudentData = () => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/usernames?courseId=${courseId}`
  const request = axios
    .get(baseUrl, {
      // Accept: "application/json",
      // "Content-Type": "application/json",
      headers:{
        Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => response.data.results)
    .catch((someError) => console.log(someError));

  return request;
};

const getStudentInfo = async studentID => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseId}&username=${studentID}`;
  const studentData = await axios.get(baseUrl, {
    headers:{
        Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    }
  }).then(response => response.data.results[0])

  if (!studentData) return {};
  return {
    username: studentData.username,
    student_id: studentData.student_id,
    email: studentData.email,
    fullname: studentData.full_name
  }
};

const getData = (studentId) => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseId}&username=${studentId}`;
  const CheckCommitDate = (deadline, date) => {
    if (deadline - date === 1) return "IN-TIME";
    if (deadline - date > 1) return "EARLY";
    if (deadline - date < 1) return "LATE";
  };
  const getNumberOfDay = (date) =>
    date && Math.round(date.getTime() / (1000 * 60 * 60 * 24));

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
      // const studentData = response.data.hits.hits[0]._source.results.find(
      //   (student) => student.student_id === studentId
      // );
      const studentData = response;
      const commitData = [];
      const WEEKLY_DEADLINE = {};
      const NUMBER_OF_WEEK = 14;

      if (studentData && response) {
        studentData.commits.forEach((module) => {
          module.projects.forEach((project) => {
            project.commit_meta.forEach((commit) => {
              const commitDate = new Date(commit.commit_date);
              commitDate.setHours(0, 0, 0, 0);
              if (Object.keys(WEEKLY_DEADLINE).length === 0) {
                let deadlDate = new Date(commitDate);
                while (deadlDate.getDay() !== 1) {
                  deadlDate.setDate(deadlDate.getDate() - 1);
                }
                deadlDate.setHours(0, 0, 0, 0);
                WEEKLY_DEADLINE["start-date"] = deadlDate;
                let endDate = new Date(WEEKLY_DEADLINE["start-date"]);
                endDate.setDate(endDate.getDate() + 7 * NUMBER_OF_WEEK);
                WEEKLY_DEADLINE["end-date"] = endDate;
              }
              if (!Object.keys(WEEKLY_DEADLINE).includes(module.module_name)) {
                let newDeadl = new Date(WEEKLY_DEADLINE["start-date"]);
                while (
                  Object.keys(WEEKLY_DEADLINE).find(
                    (item) =>
                      getNumberOfDay(WEEKLY_DEADLINE[item]) ===
                      getNumberOfDay(newDeadl)
                  )
                ) {
                  newDeadl.setDate(newDeadl.getDate() + 7);
                  newDeadl.setHours(0, 0, 0, 0);
                }
                WEEKLY_DEADLINE[module.module_name] = newDeadl;
              }
              let initialDate = new Date(WEEKLY_DEADLINE["start-date"]);
              while (commitData.length < 98) {
                if (
                  !commitData
                    .map((item) => item.dateInSecond)
                    .includes(getNumberOfDay(initialDate))
                ) {
                  let newObj = {
                    dateInSecond: getNumberOfDay(initialDate),
                    earlyCommit: 0,
                    inTimeCommit: 0,
                    lateCommit: 0,
                  };
                  commitData.push(newObj);
                  initialDate.setDate(initialDate.getDate() + 1);
                }
              }
              const moduleDeadline = WEEKLY_DEADLINE[module.module_name];
              const datecheck = CheckCommitDate(
                getNumberOfDay(moduleDeadline),
                getNumberOfDay(commitDate)
              );
              let singleDate = commitData.find(
                (item) => item.dateInSecond === getNumberOfDay(commitDate)
              );
              if (singleDate) {
                if (datecheck === "EARLY") {
                  singleDate.earlyCommit += 1;
                } else if (datecheck === "IN-TIME") {
                  singleDate.inTimeCommit += 1;
                } else if (datecheck === "LATE") {
                  singleDate.lateCommit += 1;
                }
              }
            });
          });
        });
      }
      return [
        commitData,
        [
          getNumberOfDay(WEEKLY_DEADLINE["start-date"]),
          getNumberOfDay(WEEKLY_DEADLINE["end-date"]),
        ],
      ];
    })
    .catch((someError) => console.log(someError));

  return request;
};

//eslint-disable-next-line
export default { getData, getStudentInfo, getAllStudentData };
