// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from 'axios'
import { EXERCISE_INDICES, EXERCISE_INDICES_40 } from "./constant";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayInMilliSecs = 24 * 60 * 60 * 1000;
// const courseId = process.env.REACT_APP_COURSE_ID;
// const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');
/**
 * Check if two date objects represent a timestamp on a same day.
 * 
 * @param {Date} firstDate valid date object, order does not matter.
 * @param {Date} secondDate valid date object, order does not matter.
 * @returns {bool} true if day, month and year are same for given dates.
 */
const onSameDay = (firstDate, secondDate) => {
  if (firstDate.getDate() !== secondDate.getDate()) {
    return false  // Different day (1-31)
  }
  if (firstDate.getMonth() !== secondDate.getMonth()) {
    return false  // Different month (0-11)
  }
  if (firstDate.getFullYear() !== secondDate.getFullYear()) {
    return false  // Different year
  }
  return true
}

/**
 * Fetch issue data from server to Array of days
 * 
 * @param {Date} timeframeStart 
 * @param {Date} timeframeEnd 
 * @returns {Array} days containing issue data
 */
const getTimeframe = (timeframeStart, timeframeEnd, studentID, courseID) => {
  const timeframeLengthInDays = Math.floor((timeframeEnd - timeframeStart) / dayInMilliSecs) + 1;
  const emptyDays = new Array(timeframeLengthInDays).fill(null);
  
  // Initialize array of days for the given time range:
  const days = emptyDays.map((day, index) => {
    const date = new Date(timeframeStart.getTime() + (dayInMilliSecs * index));
    const weekDay = weekDays[date.getDay()];
    const month = monthNames[date.getMonth()];

    return {
      date: date,
      key: `${weekDay} ${date.getDate()} ${month} ${date.getFullYear()}`,
      issues: []
    };
  })

  // Attach "issue" data to correct days and return data:
  return getStudentData(studentID, courseID)
    .then(student => {
      for (let module of student.points.modules) {
        for (let exercise of module.exercises) {

          const project = exercise.git_project
          if (project !== undefined) {

            for (let commit of project.commit_meta) {
              commit.commit_date = new Date(commit.commit_date);
              commit.git_project = project;
              commit.exercise = exercise;
              
              days.find(day => {
                if (onSameDay(day.date, commit.commit_date)) {
                  day.issues.push(commit);
                  return true;
                }
                return false;
              });
            }
          }
        }
      }
      return days;
    })
    // .catch(() => console.error("Could not fetch student data"))
}

/**
 * Fetch data for students and select one student for further inspection.
 * 
 * @returns Object. Contains student data on success, empty object on failure. 
 */
const getStudentData = async (studentID, courseID) => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}&username=${studentID}`;
  const request = await axios
    .get(baseUrl, {
      headers:{
          Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
      }
    }).then(response => response.data.results[0])
    .then(data => 
      // const studentData = data.data.hits.hits[0]._source.results.find(
      // person => person.student_id === studentID);
      parseStudentData(data, courseID)
    ).catch(err => console.log(err))
  return request
}

/**
 * Attach commit information to each exercise that has a git project.
 * 
 * @param {*} student object to parse.
 * @returns same student object, but project data copied under exercise field.
 */
const parseStudentData = (student, courseID)=> {
  const exercise_map = courseID === 40 ? EXERCISE_INDICES_40 : EXERCISE_INDICES;

  const modules = student.points.modules

  for (let commitModule of student.commits) {
    const moduleIndex = parseInt(commitModule.module_name.slice(-2)) - 1
    
    for (let gitProject of commitModule.projects) {     
      if (exercise_map[gitProject.name.toLowerCase()] !== undefined) {
        const exerciseIndex = exercise_map[gitProject.name]
        modules[moduleIndex].exercises[exerciseIndex]['git_project'] = gitProject
        // modules[moduleIndex].exercises[exerciseIndex].name = modules[moduleIndex].exercises[exerciseIndex].name.raw
      }
      else {
        console.log(`Could not find exercise for git project '${gitProject.name}' module ${commitModule.module_name}`);
      }
    }
  }
  return student
}

export default getTimeframe
