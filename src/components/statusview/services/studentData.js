// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

/* eslint-disable camelcase */
import axios from "axios";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { EXERCISE_INDICES, EXERCISE_INDICES_40 } from "./constant";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";

// const courseId = process.env.REACT_APP_COURSE_ID;

const singleObjectQueryUrl = (type, uuid) => AdapterConfiguration.createUrl(`general/single?type=${type}&uuid=${uuid}`);


const getStudentData = (studentID, courseID) => {
  if (!studentID) return {};
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/general/single?type=aplus_user&uuid=${studentID}`;
  
  const request = axios
    .get(baseUrl)
    .then(response => response.data)
    .then(async response => {
      const student = response;
      if (!student) return {};

      const moduleDataIDs = student.related_constructs.filter(construct => construct.type === "module_points");
      const moduleDetails = await Promise.all(moduleDataIDs.map((module) =>  {
        const url = singleObjectQueryUrl(module.type, module.id)
        const singleModuleData = axios.get(url, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(async response => {
            const module = response.data;
            const descriptionSplit = module.description.split(" ")[1] || [];

            const moduleRef = module.related_constructs.find(construct => construct.type === "module");
            const exercisePointsIDs = module.related_constructs.filter(construct => construct.type === "exercise_points");
            const moduleRefUrl = moduleRef && singleObjectQueryUrl(moduleRef.type, moduleRef.id);
            // const parentModule = await axios.get(moduleRefUrl,{
            //     Accept: "application/json",
            //     "Content-Type": "application/json",
            // }).then (response => response.data);

            // return module
            return {
                moduleNo: parseInt(descriptionSplit.slice(0, -1)) || 0,
                name: module.description,
                maxPoints: module.data.max_points,
                points: module.data.points,
                passed: module.data.passed,
                submission: module.data.submission_count,
                exercises: await Promise.all(exercisePointsIDs.map(async exercise => {
                    const exercisePointUrl = singleObjectQueryUrl(exercise.type, exercise.id);
                    const singleExercisePoint = await axios.get(exercisePointUrl, {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                }).then(response => response.data);
                //   const exerciseType = singleExercisePoint.related_constructs.find(construct => construct.type === 'exercise');
                //   const exerciseUrl = singleObjectQueryUrl(exerciseType.type, exerciseType.id);
                //   const maxPoints = await axios.get(exerciseUrl, {
                //       Accept: "application/json",
                //       "Content-Type": "application/json",
                // }).then(response => response.data.data.max_points);
             
                  return {
                    commit_name: "",
                    name: singleExercisePoint.description,
                    points: singleExercisePoint.data.points,
                    max_points: singleExercisePoint.data.max_points,
                    id: singleExercisePoint.id,
                    submissions: singleExercisePoint.data.submission_count,
                    commits: singleExercisePoint.data.commit_count,
                  };
              })),
            }
        });

        return singleModuleData
    }));

    const uniqueData = [];
    moduleDetails.sort((a,b) => a.moduleNo - b.moduleNo).forEach((module, i) => {
        const foundModule = uniqueData.find(data => data.moduleNo === module.moduleNo);
        if (!foundModule) {
            uniqueData.push(module);
        } else {
            foundModule.passed = foundModule.passed && module.passed;
            foundModule.submission += module.submission;
            foundModule.points += module.points;
            foundModule.maxPoints += module.maxPoints;
            foundModule.exercises.concat(module.exercises)
        }
    });
     uniqueData.splice(15, 1);


      const studentData = {
        personal_information: {
          id: student.data.user_id,
          username: student.data.username,
          student_id: student.data.student_id,
          email: student.data.email,
        },
        modules: uniqueData 
      }

      return studentData
    })
    .catch(() => [[], []]);

  
  // OLD ADAPTER CODE
  // const baseUrl = ElasticSearchConfiguration.createUrl(
  //   "gitlab-course-40-commit-data-anonymized/_search"
  // );
  // const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}&username=${studentID}`;
  // const request = axios
  //   .get(baseUrl, {
  //     // Accept: "application/json",
  //     // "Content-Type": "application/json",
  //     headers:{
  //       Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     }
  //   }).then(response => response.data.results[0])
  //   .then(response => {
  //     // const student = response && response.data.hits.hits[0]._source.results.find(
  //     //   s => s.student_id === studentID
  //     // );
  //     const student = response;

  //     if (!student) return {};

  //     const studentData = {
  //       personal_information: {
  //         id: student.id,
  //         username: student.username,
  //         student_id: student.student_id,
  //         email: student.email,
  //         full_name: student.full_name,
  //       },
  //       modules: student.points.modules.map(module => ({
  //         name: module.name.raw,
  //         max_points: module.max_points,
  //         points: module.points,
  //         passed: module.passed,
  //         submissions: module.submission_count,
  //         exercises: module.exercises.map(ex => ({
  //           commit_name: "",
  //           name: ex.name.raw,
  //           points: ex.points,
  //           max_points: ex.max_points,
  //           submissions: ex.submission_count,
  //           commits: 0
  //         }))
  //       }))
  //     };

    

  //     student.commits.forEach(module => {
  //       const moduleIndex = parseInt(module.module_name.slice(-2)) - 1;
  //       const commitModule = studentData.modules[moduleIndex];

  //       module.projects.forEach(project => {
  //         const exerciseIndex = courseID === 40
  //           ? EXERCISE_INDICES_40[project.name.toLowerCase()]
  //           : EXERCISE_INDICES[project.name.toLowerCase()];
          
  //         if (exerciseIndex !== undefined) {
  //           const exercise = commitModule.exercises[exerciseIndex]
  //           exercise.commits = project.commit_count;
  //           exercise.commit_name = project.name
  //         } else {
  //           console.log(`Could not find exercise for git project '${project.name}' module ${module.module_name}`);
  //         }
  //       });
  //     });

  //     return studentData;
  //   })
  //   .catch(() => [[], []]);

  return request;
};



//eslint-disable-next-line
export default { getStudentData };
