// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from "axios";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";

// const getAllStudentIDs = async courseID => {
//     const studentsUrl = AdapterConfiguration.createUrl(`general/artifacts?pageSize=1000&type=course_points&query=data.course_id==${courseID}&data=none&links=constructs`);
//     const studentIDs = await axios.get(studentsUrl, {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//     }).then(response => {
//         const studentIDsList = response.data.results.map(data => data.related_constructs.filter(event => event.type === "aplus_user").map(user => user.id)).flat();
//         return studentIDsList
//     });
  
//     return studentIDs;
// };

// export const getStatusData = async (courseID, selectecWeek) => {
//     const modulesUrl = AdapterConfiguration.createUrl(`general/metadata?page=1&pageSize=100&type=module&query=data.course_id==${courseID}&data=module_number,module_id,exercises&links=none`);
//     const modulesData = await axios.get(modulesUrl, {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     }).then(res => res && Promise.all(res.data.results.map(async module => {
//       const mUrl = AdapterConfiguration.createUrl(`general/single?type=module&uuid=${module.id}`);
//       const moduleDetail = await axios.get(mUrl, {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       }).then(res => res && res.data);
      
//       return ({
//       name: module.name,
//       module_number: module.data.module_number,
//       exercises: module.data.exercises,
//       maxPoints: moduleDetail.data.max_points
//     })}).sort((a,b) => a.module_number - b.module_number)));
  
//     const uniqueModulesData = [];
//     modulesData.forEach(m => {
//       const foundM = uniqueModulesData.find(d => d.module_number === m.module_number);
//       if (!foundM) {
//         uniqueModulesData.push(m);
//       } else {
//         foundM.name += m.name;
//         foundM.exercises = foundM.exercises.concat(m.exercises).sort((a,b) => a -b);
//         foundM.maxPoints += m.maxPoints;
//       }
//     });
//     const studentIDs = await getAllStudentIDs(courseID);
  
//     let cumulativePoint = 0;
//     const request = await Promise.all(uniqueModulesData.filter(module => module.module_number === selectecWeek).map(async u => {
//       const ex = u.exercises;
//       const studentDetail = await Promise.all(studentIDs.map(async s => {
//         const singleStudentUrl = AdapterConfiguration.createUrl(`general/single?type=aplus_user&uuid=${s}`);
//           const userID = await axios.get(singleStudentUrl, {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           }).then(res => res && res.data.data.user_id)
//           .catch(err => console.log(err));
  
//         const exDetail = await Promise.all(ex.map(async e => {
//           const exUrl = AdapterConfiguration.createUrl(`general/artifacts?type=exercise_points&links=none&query=data.exercise_id==${e};data.user_id==${userID}`);
//           const exObj = await axios.get(exUrl, {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//           }).then(res => {
//             if (res) {
//               if (res.data.results.length > 0) {
//                 return res.data.results[0].data;
//               }
//             }
//             return null;
//           })
//           .catch(err => console.log(err));
//           return ({
//             passed: exObj ? exObj.passed : true,
//             submissions: exObj ? exObj.submission_count : 0,
//             commit_counts: exObj ? exObj.commit_count : 0,
//           })
//         }));
  
//         cumulativePoint += parseInt(u.maxPoints);
       
//         const studentObject = {
//           id: s,
//           username: s,
  
//           commit_counts: exDetail.map(e => e.commit_counts),
//           passed: exDetail.map(e => e.passed),
//           submissions: exDetail.map(e => e.submissions),

//           cumulativePoints: cumulativePoint,
//         }; 
  
//         ex.forEach((exercise, i) => {
//           studentObject[`exercise-${i+1}`] = 1
//         })
//         return studentObject;
//       }));
      
//       return({
//         week: u.module_number,
//         data: studentDetail,
//       })
//     }));
   
//     return request.length > 0 ? request[0] : null;
//   }

export const getAllModules = async (courseId) => {
  const modulesUrl = AdapterConfiguration.createUrl(`/general/metadata?page=1&pageSize=100&type=module&query=data.course_id==${courseId}&data=module_number,module_id,exercises,max_points&links=none`);
  const moduleData = axios.get(modulesUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .then(response => {
      const moduleWithExercises = response.data.results.filter(module => module.data.exercises.length != 0);
      return (moduleWithExercises.map(module => {
        return {
          id: module.id,
          moduleId: module.data.module_id,
          name: module.name,
          module_number: module.data.module_number,
        }
     }).sort((a,b) => a.module_number - b.module_number));
    });
  return moduleData
}

export const getStatusData = async (courseID, selectedWeek) => {
  const selectedModuleUrl = AdapterConfiguration.createUrl(`/general/metadata?page=1&pageSize=100&type=module&query=data.course_id==${courseID};data.module_number==${selectedWeek}&data=module_number,module_id,exercises,max_points&links=none`)
  const selectedModule = await axios.get(selectedModuleUrl, {
    "Accept": "application/json",
    "Content-Type": "application/json",
  })
  .then(response => {
      return response.data.results.find(module => module.data.exercises.length > 0).data;
  })

  const {exercises, max_points} = selectedModule;

  const studentData = []
  // let cumulativePoints = 0;
  for (const exercise of exercises){
      const currentExerciseUrl = AdapterConfiguration.createUrl(`/general/artifacts?pageSize=1000&links=constructs&type=exercise_points&query=data.exercise_id==${exercise}&data=exercise_id,user_id,points,passed,submission_count,commit_count`) 
      await axios.get(currentExerciseUrl, {
        "Accept": "application/json",
        "Content-Type": "application/json",  
      })
      .then((response) => {
        response.data.results.map(exercisePoint => {
          const studentId = exercisePoint.related_constructs.find(construct => construct.type === "aplus_user").id;
          const {points, passed, commit_count, submission_count} = exercisePoint.data;
          const foundStudent = studentData.find(student => student.id == studentId);

          if(foundStudent) {
            foundStudent['commit_counts'].push(commit_count)
            foundStudent['passed'].push(passed)
            foundStudent['submissions'].push(submission_count)

          }
          else{
            const studentExObj = {
              id: studentId,
              username: studentId,
              commit_counts: [commit_count],
              passed: [passed],
              submissions: [submission_count],
              cumulativePoints: points
            }
            exercises.forEach((exercise, i) => {
              studentExObj[`exercise-${i+1}`] = 1
            })
            studentData.push(studentExObj)
          }
        })
      })
      .catch(err => console.log(err));
    }
    return studentData;
}


export const getExerciseData = async (courseID, selectedWeek) => {
  const modules = await getAllModules(courseID);
  const weeks = modules.map(module => module.module_number);

  let totalPointsOfWeek = 0;
  let totalExerciseOfWeek = 0;
  const currentModule = modules.find(module => module.module_number == selectedWeek);
  const modulePointUrl = AdapterConfiguration.createUrl(`/general/artifacts?pageSize=1000&links=constructs&type=module_points&query=data.module_id==${currentModule.moduleId}`);
  
  const moduleStudentData = [] 
  await axios.get(modulePointUrl, {
      "Accept": "application/json",
      "Content-Type": "application/json",
    })
    .then(response => {
      response.data.results.map((modulePoint) => {
        const studentId = modulePoint.related_constructs.find(construct => construct.type === "aplus_user").id;
        const {
          cumulative_points,
          cumulative_max_points,
          cumulative_exercise_count,
          cumulative_max_exercise_count,
          max_points,
          max_exercise_count,
          points,
          exercise_count
        } = modulePoint.data;
        
        const totalPoints = cumulative_points - points;
        const totalExercises = cumulative_exercise_count - exercise_count;
       
        const studentData = {
          id: studentId,
          username: studentId,
          maxPts: cumulative_max_points,
          totPts: cumulative_max_points - max_points,
          week: cumulative_points,
          missed:  cumulative_max_points - cumulative_points - (max_points - points),
          maxExer: cumulative_max_exercise_count,
          totExer: cumulative_max_exercise_count - max_exercise_count,
          weekExer: cumulative_exercise_count,
          missedExer: cumulative_max_exercise_count - cumulative_exercise_count - (max_exercise_count - exercise_count),
        };
        moduleStudentData.push(studentData);
        totalPointsOfWeek += totalPoints;
        totalExerciseOfWeek += totalExercises;
      });
    })
    .catch(err => console.log(err));

    const moduleAverageUrl = AdapterConfiguration.createUrl("/general/artifacts?type=module_average");
    const moduleAverages = await axios.get(moduleAverageUrl, {
      "Accept": "application/json",
      "Content-Type": "application/json",
    })
    .then(response => {
      return response.data.results;
    })

    let cumulatives = {}
    if(selectedWeek > 1 && selectedWeek !== 16){
      const previousModule = modules.find(module => module.module_number === selectedWeek - 1);
      const previousModuleAvgs = moduleAverages.filter(moduleAvg => moduleAvg.related_constructs.find(reletedCons => reletedCons.id === previousModule.id));
      const midExpected = previousModuleAvgs.find(previousModuleAvg => previousModuleAvg.data.grade === 3);
      const minExpected = previousModuleAvgs.find(previousModuleAvg => previousModuleAvg.data.grade === 1);

      cumulatives = {
        cumulativeAvgs: Math.round(totalPointsOfWeek / moduleStudentData.length),
        cumulativeMidExpected: Math.round(midExpected.data ? midExpected.data.avg_cum_points : 0),
        cumulativeMinExpected: Math.round(minExpected.data ? minExpected.data.avg_cum_points : 0),
      
        cumulativeAvgsExercises: Math.round(totalExerciseOfWeek / moduleStudentData.length),
        cumulativeMidExpectedExercises: Math.round(midExpected.data ? midExpected.data.avg_cum_exercises: 0),
        cumulativeMinExpectedExercises: Math.round(minExpected.data ? minExpected.data.avg_cum_exercises: 0),  
      };
    }
    return {
      data: moduleStudentData,
      weeks: weeks,
      cumulatives,
    };
}
