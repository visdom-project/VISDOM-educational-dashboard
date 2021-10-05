import axios from 'axios'
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { 
  EXERCISE_INDICES,
  timeDiff,
  _DAYS_OF_WEEK_,
  _NUMBER_OF_WEEKS_
} from "./helpers";

// const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');
const courseId = process.env.REACT_APP_COURSE_ID;

const timeframe = date => {
  let startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  // If this date not the first date of the week (e.g. Monday)
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const emptyDays = new Array(_NUMBER_OF_WEEKS_).fill(null);

  const courseTime = emptyDays.map((day, i) => {
    const s = new Date(startDate);
    s.setDate(s.getDate() + i*_DAYS_OF_WEEK_);

    const e = new Date(s);
    e.setDate(e.getDate() + _DAYS_OF_WEEK_)

    return {
      name: (i+1).toString(),
      startDate: s,
      endDate: e,
    };
  });
  return courseTime;

}

const studentData = async studentID => {
  if (!studentID) return null;

  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseId}&username=${studentID}`;

  const request = await
    axios
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
        const student = response
        if (student) {
          let moduleTime = [];
          if (student.commits.length > 0){
            if (student.commits[0].projects.length > 0){
              if (student.commits[0].projects[0].commit_meta.length > 0) {
                if (moduleTime.length === 0){
                  moduleTime = timeframe(student.commits[0].projects[0].commit_meta[0].commit_date)
                }
              }
            }
          }

          const studentModules = student.points.modules.map((module, i) => {
            return {
              name: module.name.raw,
              startDate: moduleTime && moduleTime[i].startDate,
              endDate: moduleTime && moduleTime[i].endDate,
              maxPoints: module.max_points,
              submissions: module.submission_count,
              points: module.points,
              passed: module.points > 0,
              commits: 0,
              firstCommitDate: null,
              commitDays: 0,
              difficulty: module.exercises.map(m => m.difficulty).includes("P") ? "P" : "",
              exercises: module.exercises.map(exercise => ({
                name: exercise.name.raw,
                maxPoints: exercise.max_points,
                points: exercise.points,
                passed: exercise.points > 0,
                submissions: exercise.submission_count,
                difficulty: exercise.difficulty,
                commits: 0,
                firstCommitDate: null,
                commitDays: 0
              }))
            };
          });

          student.commits.forEach(module => {
            const moduleIndex = parseInt(module.module_name.slice(-2)) - 1;
            const commitModule = studentModules[moduleIndex];

            module.projects.forEach(project => {
              const exerciseIndex = EXERCISE_INDICES[project.name.toLowerCase()];

              if (exerciseIndex !== undefined) {
                const commitExercise = commitModule.exercises[exerciseIndex];
                commitModule.commits += project.commit_count;
                commitExercise.commits = project.commit_count;
                project.commit_meta.forEach(commit => {
                  const commitDate = new Date(commit.commit_date);
                  commitDate.setHours(0, 0, 0, 0);

                  if (!commitModule.firstCommitDate) {
                    commitModule.firstCommitDate = commitDate;
                    commitModule.commitDays = 1;
                  } else if (timeDiff(commitModule.firstCommitDate, commitDate) > commitModule.commitDays) {
                    commitModule.commitDays = timeDiff(commitModule.firstCommitDate, commitDate)
                  } else if (timeDiff(commitModule.firstCommitDate, commitDate) < 0) {
                    commitModule.commitDays += Math.abs(timeDiff(commitModule.firstCommitDate, commitDate))
                    commitModule.firstCommitDate = commitDate;
                  }

                  if (!commitExercise.firstCommitDate) {
                    commitExercise.firstCommitDate = commitDate;
                    commitExercise.commitDays = 1;
                  } else if (timeDiff(commitExercise.firstCommitDate, commitDate) 
                              > commitExercise.exerciseDays) {
                    commitExercise.commitDays = timeDiff(commitExercise.firstCommitDate, commitDate);
                  } else if (timeDiff(commitExercise.firstCommitDate, commitDate) < 0) {
                    commitExercise.firstCommitDate = commitDate;
                    commitExercise.commitDays = Math.abs(timeDiff(commitExercise.firstCommitDate, commitDate));
                  }
                })
              } else {
                console.log(`Could not find exercise for git project '${project.name}' module ${module.module_name}`);
              }
            })
          });

          return studentModules;
        }
      }).catch(err => {
        console.lof(err)
        return [];
      })
  return request;
}

export default studentData
