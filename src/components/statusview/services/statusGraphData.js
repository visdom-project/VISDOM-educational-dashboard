import axios from "axios";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";

const getAllStudentIDs = async courseID => {
    const studentsUrl = AdapterConfiguration.createUrl(`general/artifacts?pageSize=1000&type=course_points&query=data.course_id==${courseID}&data=none&links=constructs`);
    const studentIDs = await axios.get(studentsUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => {
        const studentIDsList = response.data.results.map(data => data.related_constructs.filter(event => event.type === "aplus_user").map(user => user.id)).flat();
        return studentIDsList
    });
  
    return studentIDs;
};

export const getStatusData = async (courseID, selectecWeek) => {
    const modulesUrl = AdapterConfiguration.createUrl(`general/metadata?page=1&pageSize=100&type=module&query=data.course_id==${courseID}&data=module_number,module_id,exercises&links=none`);
    const modulesData = await axios.get(modulesUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    }).then(res => res && Promise.all(res.data.results.map(async module => {
      const mUrl = AdapterConfiguration.createUrl(`general/single?type=module&uuid=${module.id}`);
      const moduleDetail = await axios.get(mUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
      }).then(res => res && res.data);
      
      return ({
      name: module.name,
  
      module_number: module.data.module_number,
      exercises: module.data.exercises,
      maxPoints: moduleDetail.data.max_points
    })}).sort((a,b) => a.module_number - b.module_number)));
  
    const uniqueModulesData = [];
    modulesData.forEach(m => {
      const foundM = uniqueModulesData.find(d => d.module_number === m.module_number);
      if (!foundM) {
        uniqueModulesData.push(m);
      } else {
        foundM.name += m.name;
        foundM.exercises = foundM.exercises.concat(m.exercises).sort((a,b) => a -b);
        foundM.maxPoints += m.maxPoints;
      }
    });
    const studentIDs = await getAllStudentIDs(courseID);
  
    let cumulativePoint = 0;
  
    const request = await Promise.all(uniqueModulesData.filter(module => module.module_number === selectecWeek).map(async u => {
      const ex = u.exercises;
      const studentDetail = await Promise.all(studentIDs.map(async s => {
        const singleStudentUrl = AdapterConfiguration.createUrl(`general/single?type=aplus_user&uuid=${s}`);
          const userID = await axios.get(singleStudentUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
          }).then(res => res && res.data.data.user_id)
          .catch(err => console.log(err));
  
        const exDetail = await Promise.all(ex.map(async e => {
          const exUrl = AdapterConfiguration.createUrl(`general/artifacts?type=exercise_points&links=none&query=data.exercise_id==${e};data.user_id==${userID}`);
          const exObj = await axios.get(exUrl, {
              Accept: "application/json",
              "Content-Type": "application/json",
          }).then(res => {
            if (res) {
              if (res.data.results.length > 0) {
                return res.data.results[0].data;
              }
            }
            return null;
          })
          .catch(err => console.log(err));
          return ({
            passed: exObj ? exObj.passed : true,
            submissions: exObj ? exObj.submission_count : 0,
            commit_counts: exObj ? exObj.commit_count : 0,
          })
        }));
  
        cumulativePoint += parseInt(u.maxPoints);
  
        const studentObject = {
          id: s,
          username: s,
  
          commit_counts: exDetail.map(e => e.commit_counts),
          passed: exDetail.map(e => e.passed),
          submissions: exDetail.map(e => e.submissions),
  
          cumulativePoints: cumulativePoint,
        }; 
  
        ex.forEach((exercise, i) => {
          studentObject[`exercise-${i+1}`] = 1
        })
        return studentObject;
      }));
  
      return({
        week: u.module_number,
        data: studentDetail,
      })
    }));
  
    return request.length > 0 ? request[0] : null;
  }
