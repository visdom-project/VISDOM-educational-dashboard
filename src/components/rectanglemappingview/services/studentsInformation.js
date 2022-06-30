// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from 'axios'
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

// const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');
// const courseId = process.env.REACT_APP_COURSE_ID;

// const studentsInformation = () => {
//   const request = axios
//     .get(baseUrl, {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//     })
//     .then(response => (
//       response.data.hits.hits[0]._source.results.map(student => (
//         {
//           username: student.username,
//           student_id: student.student_id,
//           email: student.email,
//           fullname: student.full_name,
//         }
//       ))
//     ))
//     .catch(someErrors => console.log(someErrors))

//   return request;
// }

const getAllStudentData = async(courseID) => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/usernames?courseId=${courseID}`
  const request = await axios
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

const getStudentInfo = async (studentID, courseID) => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}&username=${studentID}`;
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

export default { getAllStudentData, getStudentInfo }
