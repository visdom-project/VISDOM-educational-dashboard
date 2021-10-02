import axios from "axios";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

// const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');
const NUMBER_OF_WEEKS = 14;
const courseId = process.env.REACT_APP_COURSE_ID;

export const getAllStudentData = () => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}adapter/usernames?courseId=${courseId}`
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

export const getStudentInfo = async studentID => {
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

export const getTimePeriod = studentID => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseId}&username=${studentID}`;
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
    // const student = response.data.hits.hits[0]._source.results.find(
    //   person => person.student_id === studentID);
    const student = response;
    let studentCommit = [];
    if (student) {
      studentCommit = student.commits;
    }
    if (studentCommit) {
      const commitDate = new Date(studentCommit[0].projects[0].commit_meta[0].commit_date);
      if (commitDate) {
        let startDate = new Date(commitDate);
        while (startDate.getDay() !== 1) {
          startDate.setDate(startDate.getDate() - 1);
        }
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7*NUMBER_OF_WEEKS - 1);

        return {startDate, endDate}
      }
      return {startDate: null, endDate: null};
    }
    return {startDate: null, endDate: null};
  })
  .catch(error => console.log(error))

  return request;
};
