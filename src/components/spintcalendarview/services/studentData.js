import axios from "axios";
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');
const NUMBER_OF_WEEKS = 14;

export const getAllStudentData = () => {
  const request = axios
    .get(baseUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .then((response) => {
      const allStudentData = response.data.hits.hits[0]._source.results.map(student => ( 
        {
          username: student.username,
          student_id: student.student_id,
          email: student.email,
          fullname: student.full_name
        })
      );
      return allStudentData;
    })
    .catch((someError) => console.log(someError));

  return request;
};

export const getTimePeriod = studentID => {
  const request = axios
  .get(baseUrl, {
    Accept: "application/json",
    "Content-Type": "application/json",
  })
  .then(response => {
    const student = response.data.hits.hits[0]._source.results.find(
      person => person.student_id === studentID);
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
