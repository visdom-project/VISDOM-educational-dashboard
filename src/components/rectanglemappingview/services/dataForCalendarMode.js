import axios from 'axios'
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import {
  _NUMBER_OF_WEEKS_,
  _DAYS_OF_WEEK_,
  _MS_PER_DAY_,
  EXERCISE_INDICES,
  onSameDay
} from "./helpers"

const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');

const getTimeFrame = date => {
  let startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const emptyDays = new Array(_NUMBER_OF_WEEKS_ * _DAYS_OF_WEEK_).fill(null);

  const days = emptyDays.map((d, i) => {
    const day = new Date(startDate.getTime() + (_MS_PER_DAY_ * i));

    return {
      date: day,
      data: []
    };
  });
  return days
}

const dataForCalendarMode = studentID => {
  if (!studentID) return null;

  const request =
    axios
      .get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
      })
      .then(response => {
        const student = response && response.data.hits.hits[0]._source.results.find(
          s => s.student_id === studentID
        );

        if (student) {
          let timeFrame = [];
          if (student.commits.length > 0){
            if (student.commits[0].projects.length > 0){
              if (student.commits[0].projects[0].commit_meta.length > 0) {
                if (timeFrame.length === 0){
                  timeFrame = getTimeFrame(student.commits[0].projects[0].commit_meta[0].commit_date);
                };
              };
            };
          };

          const studentModules = student.points.modules;

          student.commits.forEach(module => {
            const moduleIndex = parseInt(module.module_name.slice(-2)) - 1;
            const commitModule = studentModules[moduleIndex];

            module.projects.forEach(project => {
              const exerciseIndex = EXERCISE_INDICES[project.name.toLowerCase()];

              if (exerciseIndex !== undefined) {
                const commitExercise = commitModule.exercises[exerciseIndex];

                project.commit_meta.forEach(commit => {
                  const dayData = timeFrame.findIndex(d => onSameDay(d.date, new Date(commit.commit_date)));
                  if (dayData !== -1) {
                    const commitData = timeFrame[dayData].data.findIndex(d => d.name === commitExercise.name);
                    if (commitData !== -1) {
                      timeFrame[dayData].data[commitData].commits += 1
                    } else {
                      timeFrame[dayData].data.push({
                        name: commitExercise.name,
                        difficulty: commitExercise.difficulty,
                        maxPoints: commitExercise.max_points,
                        points: commitExercise.points,
                        submissions: commitExercise.submission_count,
                        passed: commitExercise.passed,
                        commits: 1,
                        pointRatio: commitExercise.max_points !== 0 ? (commitExercise.points / commitExercise.max_points) : 0,
                        fill: "",
                        stroke: "#000000"
                      })
                    };
                  };
                });
              } else{
                console.log(`Could not find exercise for git project '${project.name}' module ${module.module_name}`);
              };
            });
          });

          return timeFrame;
        };
      })
      .catch(err => console.log(err));
  
  return request;
}

export default dataForCalendarMode
