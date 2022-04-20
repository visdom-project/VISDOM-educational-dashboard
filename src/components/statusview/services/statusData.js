/* eslint-disable no-console */
/* eslint-disable camelcase */
import axios from "axios";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { PROJECT_MAPPING, PROJECT_MAPPING_117, PROJECT_MAPPING_40 } from "./constant";

// const baseUrl = ElasticSearchConfiguration.createUrl(
//   "gitlab-course-40-commit-data-anonymized/_search"
// );
// const courseId = process.env.REACT_APP_COURSE_ID;
// const courseId = 40;
// const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseId}`
const getWeeklyPoints = (modules, mapping) => {
  const weeklyPts = {};
  const weeklyMaxes = [];
  const weeklyExercises = {};
  const weeklyExerciseMaxes = [];
  const weeklySubmissions = {};
  const weeklyPassed = {};

  modules.forEach(module => {
    // Exclude all fake or ghost modules:
    if (mapping.indexOf(module.id) > -1 || module.id === 570) {
      // Hard coding: ID 570 is a special case: git-course-module that has no points in Programming 2.

      // Deduct which week the module stands for:
      let week = module.name.raw.slice(0, 2);
      if (week[1] === ".") {
        week = week.slice(0, 1);
      }

      // How many points student has received this this module, aka. "week":
      weeklyPts[week] = module.points;

      // How many points it is possible to receive from this module, aka. "week":
      weeklyMaxes.push(module.max_points);

      // How many exercises student has submitted (NOTE: submission doesn't mean any kind of success!):
      weeklyExercises[week] = module.exercises.reduce((sum, exercise) => {
        sum += exercise.submission_count > 0 ? 1 : 0;
        return sum;
      }, 0);

      // How many exercises this module aka. "week" contains:
      weeklyExerciseMaxes.push(module.exercises.length);

      // How many submissions student has made in each exercise:
      weeklySubmissions[week] = module.exercises.map(
        (exercise) => exercise.submission_count
      );

      // Which exercises the student has completed successfully:
      weeklyPassed[week] = module.exercises.map(
        (exercise) => exercise.points > exercise.points_to_pass
      );
    }
  });
  return [
    weeklyPts,
    weeklyMaxes,
    weeklyExercises,
    weeklyExerciseMaxes,
    weeklySubmissions,
    weeklyPassed,
  ];
};

const getModuleMapping = modules => {
  const corrects = [];
  modules.forEach(module => {
    if (module.max_points > 0) {
      let module_number = module.name.raw.slice(0, 2);
      if (module_number[1] === ".") {
        module_number = module_number[0];
      }
      const newModule = { ...module, week: module_number };
      corrects.push(newModule);
    }
  });

  const mapped = new Array(corrects.length).fill("");
  corrects.forEach(module => {
    mapped[parseInt(module.week) - 1] = module.id;
  });

  return mapped;
};

const formatSubmissionData = (data) => {
  const formatted = Object.keys(data[0].weeklySubmissions).map((week) => {
    return { week: week };
  });

  return formatted.map((week) => {
    week.data = data.map((student) => {
      const newStudent = {
        username: student.username,
        id: student.id,
        submissions: student.weeklySubmissions[week.week],
        passed: student.weeklyPassed[week.week],
        cumulativePoints: student.cumulativePoints[week.week - 1],
      };

      let i = 0;
      // eslint-disable-next-line no-unused-vars
      student.weeklySubmissions[week.week].forEach((submissionCount) => {
        const attributeName = "exercise-".concat(i + 1);
        newStudent[attributeName] = 1;
        i += 1;
      });

      return newStudent;
    });
    return week;
  });
};

const getData = courseID => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}`
  const request = axios
    .get(baseUrl, {
      // Accept: "application/json",
      // "Content-Type": "application/json",
      headers:{
        Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    }).then(response => response.data.results)
    .then(response => {
      // Map modules to weeks:
      const first_non_empty = response.find(
        result => !result.student_id.includes("redacted")
      );
      const moduleMapping = getModuleMapping(first_non_empty.points.modules);

      // const results = [];
      // const submissionData = [];

      // Map student data into weeks:
      // response.forEach(result => {
      //   console.log("here",result)
      //   if (!result.username.includes("redacted")) {
      //     const [
      //       weeklies,
      //       weeklyMaxes,
      //       weeklyExercises,
      //       weeklyExerciseMaxes,
      //       weeklySubmissions,
      //       weeklyPassed,
      //     ] = getWeeklyPoints(result.points.modules, moduleMapping);

      //     const formattedResult = {
      //       name: result.username,
      //       id: result.student_id,
      //       weeklyPoints: weeklies,
      //       weeklyExercises: weeklyExercises,
      //       maxPts: 0,
      //       maxExer: 0,
      //       weeklyMaxes: weeklyMaxes,
      //       weeklyExerciseMaxes: weeklyExerciseMaxes,
      //       cumulativeMaxes: [],
      //       cumulativeExerMaxes: [],
      //       cumulativePoints: {},
      //       cumulativeExercises: {},
      //     };
      //     results.push(formattedResult);

      //     submissionData.push({
      //       id: result.student_id,
      //       weeklySubmissions: weeklySubmissions,
      //       weeklyPassed: weeklyPassed,
      //       cumulativePoints: Object.keys(Object.values(weeklies)).map(
      //         (key) =>
      //           Object.values(weeklies)
      //             .slice(0, key + 1)
      //             .reduce((sum, val) => sum + val, 0)
      //       ),
      //     });
      //   }
      // });

      const results = response.map(result => {
        if (!result) return {};
        if (!result.username.includes("redacted")) {
          const [
            weeklies,
            weeklyMaxes,
            weeklyExercises,
            weeklyExerciseMaxes,
            weeklySubmissions,
            weeklyPassed,
          ] = getWeeklyPoints(result.points.modules, moduleMapping);
          const formattedResult = {
            username: result.username,
            id: result.student_id,
            weeklyPoints: weeklies,
            weeklyExercises: weeklyExercises,
            maxPts: 0,
            maxExer: 0,
            weeklyMaxes: weeklyMaxes,
            weeklyExerciseMaxes: weeklyExerciseMaxes,
            cumulativeMaxes: [],
            cumulativeExerMaxes: [],
            cumulativePoints: {},
            cumulativeExercises: {},
          };
          return formattedResult;
        }
      });

      const submissionData = response.map(result => {
        if (!result) return {};
        if (!result.username.includes("redacted")) {
          const [
            weeklies,
            weeklyMaxes,
            weeklyExercises,
            weeklyExerciseMaxes,
            weeklySubmissions,
            weeklyPassed,
          ] = getWeeklyPoints(result.points.modules, moduleMapping);
          const formattedData = {
            username: result.username,
            id: result.student_id,
            weeklySubmissions: weeklySubmissions,
            weeklyPassed: weeklyPassed,
            cumulativePoints: Object.keys(Object.values(weeklies)).map(
              (key) =>
                Object.values(weeklies)
                  .slice(0, key + 1)
                  .reduce((sum, val) => sum + val, 0)
            ),
          };
          return formattedData;
        }
      });

      const [progress, commons] = formatProgressData(results);

      return [
        progress,
        commons,
        // helpers.orderCountData(formatSubmissionData(submissionData)),
        formatSubmissionData(submissionData)
      ];
    })
    .catch(() => [[], []]);

  return request;
};

const getWeeks = (data) => {
  if (data.length > 0 && data[0].weeklyPoints !== undefined) {
    return [...Object.keys(data[0].weeklyPoints)];
  } else {
    console.log(
      "progressData.js::calcWeeks(): data does not contain non-empty field: weeklyPoints!"
    );
    return [];
  }
};

const calcCumulativeScoresForStudents = (data) => {
  if (
    data.length > 0 &&
    data[0].weeklyPoints !== undefined &&
    data[0].weeklyExercises !== undefined
  ) {
    // Calculate cumulative points and exercises for each student:
    data.forEach((student) => {
      let sum = 0;
      let exerciseSum = 0;

      Object.keys(student.weeklyPoints).forEach((week) => {
        // Weekly points:
        sum += student.weeklyPoints[week];
        student.cumulativePoints[week] = sum;

        // Weekly submitted exercises:
        exerciseSum += student.weeklyExercises[week];
        student.cumulativeExercises[week] = exerciseSum;
      });
    });
  } else {
    console.log(
      "progressData.js::calcCumulativePoints(): data does not contain non-empty field: weeklyPoints or weeklyExercises!"
    );
  }

  return data;
};

const calcCumulatives = (pointArray) => {
  return Object.keys(pointArray).map((key) => {
    return pointArray.slice(0, key).reduce((sum, val) => {
      return sum + val;
    }, 0);
  });
};

const calcCommonData = (data) => {
  const weeks = getWeeks(data);
  const avgs = new Array(weeks.length).fill(0);
  const exerciseAvgs = new Array(weeks.length).fill(0);
  // TODO: get real values for the expecteds:
  const midExpected = [
    30,
    100,
    77,
    83,
    37,
    70,
    45,
    41,
    74,
    40,
    40,
    120,
    5,
    30,
    0,
    0,
  ]; // From history data
  const minExpected = [
    30,
    100,
    30,
    40,
    30,
    80,
    0,
    30,
    36,
    25,
    0,
    0,
    0,
    30,
    0,
    0,
  ]; // From history data
  const midExpectedExercises = [2, 3, 1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1]; // From history data
  const minExpectedExercises = [2, 2, 1, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0]; // From history data

  // Calculate weekly cumulative maxes for points and exercises from weeklyMaxes and weeklyExerciseMaxes:
  const cumulativeMaxes =
    data.length > 0
      ? calcCumulatives(data[0].weeklyMaxes.concat(0)).slice(
          1,
          data[0].weeklyMaxes.length + 1
        )
      : [];

  const cumulativeExerMaxes =
    data.length > 0
      ? calcCumulatives(data[0].weeklyExerciseMaxes.concat(0)).slice(
          1,
          data[0].weeklyExerciseMaxes.length + 1
        )
      : [];

  // Calculate weekly averages for points and exercises:
  weeks.forEach((week) => {
    data.forEach((student) => {
      avgs[week - 1] += student.weeklyPoints[week];
      exerciseAvgs[week - 1] += student.weeklyExercises[week];
    });
    avgs[week - 1] = Math.round(avgs[week - 1] / data.length);
    exerciseAvgs[week - 1] = Math.round(exerciseAvgs[week - 1] / data.length);
  });

  const commonData = {
    cumulativeAvgs: calcCumulatives(avgs),
    cumulativeMinExpected: calcCumulatives(minExpected),
    cumulativeMidExpected: calcCumulatives(midExpected),

    cumulativeAvgsExercises: calcCumulatives(exerciseAvgs),
    cumulativeMidExpectedExercises: calcCumulatives(minExpectedExercises),
    cumulativeMinExpectedExercises: calcCumulatives(midExpectedExercises),
  };

  data.forEach((student) => {
    student.weeklyAvgs = avgs;
    student.weeklyMins = minExpected;
    student.weeklyMids = midExpected;

    student.cumulativeMaxes = cumulativeMaxes;
    student.cumulativeExerMaxes = cumulativeExerMaxes;
  });

  return [data, commonData];
};

const dataByWeeks = (data) => {
  return getWeeks(data).map((week) => {
    const newData = data.map((student) => {
      const weekIndex = week - 1;

      return {
        username: student.username,
        id: student.id,

        // How many points in total there has been available on the course:
        maxPts: student.cumulativeMaxes[weekIndex],
        // For displaying how many points the student has gained in total during the course:
        totPts:
          student.cumulativeMaxes[weekIndex] - student.weeklyMaxes[weekIndex],
        // For displaying how many points student received this week:
        week:
          student.cumulativeMaxes[weekIndex] -
          student.weeklyMaxes[weekIndex] +
          student.weeklyPoints[week],
        // How many points student has missed during the course:
        missed:
          (student.cumulativeMaxes[weekIndex - 1] || 0) -
          (student.cumulativePoints[weekIndex] || 0),

        // How many exercises in total there has been available on the course up until this week:
        maxExer: student.cumulativeExerMaxes[weekIndex],
        // For displaying how many exercises student has submitted in total during the course up until this week:
        totExer:
          student.cumulativeExerMaxes[weekIndex] -
          student.weeklyExerciseMaxes[weekIndex],
        // For displaying how many exercises student did this week:
        weekExer:
          student.cumulativeExerMaxes[weekIndex] -
          student.weeklyExerciseMaxes[weekIndex] +
          student.weeklyExercises[week],
        // How many exercises student has missed during the course up until this week:
        missedExer:
          (student.cumulativeExerMaxes[weekIndex - 1] || 0) -
          (student.cumulativeExercises[weekIndex] || 0),
      };
    });
    return { week: week, data: newData };
  });
};

const formatProgressData = (pData) => {
  const [data, commonData] = calcCommonData(
    calcCumulativeScoresForStudents(pData)
  );
  console.log(pData)
  // return [helpers.orderData(dataByWeeks(data)), commonData];
  return [dataByWeeks(data), commonData]
};

const getCommitData = courseID => {
  const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}`;
  const project_map = courseID === 40
    ? PROJECT_MAPPING_40
    : courseID === 117
      ? PROJECT_MAPPING_117
      : PROJECT_MAPPING;
  const request = axios
    .get(baseUrl, {
      // Accept: "application/json",
      // "Content-Type": "application/json",
      headers:{
        Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    }).then(respone => respone.data.results)
    .then(response => {

      const results = Object.keys(project_map).map(moduleName => {
        return { week: moduleName, data: [] };
      });

      // console.log("statusData", response)

      // Parse fetched commit data into proper format and fill in missing data:
      // response.data.hits.hits.forEach((hit) => {
      //   hit._source.results.forEach((result) => {

      response.forEach(result => {
          // Which exercises the student has passed:
          const passedExercises = result.points.modules
            .map(module =>
              module.exercises.map(exercise => exercise.passed)
            );

          const modulePoints = result.points.modules.map(module => module.points);

          const cumulativePoints = Object.keys(modulePoints).map(key => {
            return modulePoints
              .slice(0, parseInt(key) + 1)
              .reduce((sum, val) => {
                return sum + val;
              }, 0);
          });

          // Start with a data stucture with proper default values:
          const newCommits = Object.keys(project_map).map(moduleName => {
            return {
              module_name: moduleName,
              projects: project_map[moduleName].map((projectName) => {
                return { name: projectName, commit_count: 0, commit_meta: [] };
              }),
            };
          });

          // Override default values with student data wherever there is any:
          result.commits.forEach(module => {
            const newModule = module;
            const moduleIndex = newCommits.findIndex(
              commitModule => commitModule.module_name === module.module_name
            );

            if (moduleIndex > -1) {
              // Ignore modules with erroneous names

              // Fill in missing project data:
              const newProjects = newCommits[moduleIndex].projects;
              module.projects.forEach(studentProject => {
                const projectIndex = newProjects.findIndex(project =>
                  project.name.includes(studentProject.name)
                );
                if (projectIndex < newProjects.length && projectIndex > -1) {
                  newProjects[projectIndex] = studentProject;
                } else {
                  // console.log("Excluding a project from commit data; it was not recognized as submittable exercise:", studentProject);
                }
              });
              newModule.projects = newProjects;
              newCommits[moduleIndex] = newModule;
            }
          });

          result.commits = newCommits;

          // Map each student's commit data to correct weeks in result data:
          result.commits.forEach(module => {
            const moduleInd =
              module.module_name === "01-14"
                ? 14
                : parseInt(module.module_name) - 1;

            // Format student data into displayable format:
            const student = {
              username: result.username,
              id: result.student_id,
              commit_counts: module.projects.map(
                project => project.commit_count
              ),
              project_names: module.projects.map(project => project.name),
              passed: passedExercises[moduleInd] ? passedExercises[moduleInd] : true,
              weekPts: modulePoints[moduleInd],
              cumulativePoints: cumulativePoints[moduleInd] ? cumulativePoints[moduleInd] : 0,
            };

            // Separate commit counts to their own fields:
            // let i = 1;
            // eslint-disable-next-line no-unused-vars
            student.commit_counts.forEach((commit_count, i) => {
              student[`exercise-${i + 1}`] = 1;
              // i += 1;
            });

            // results[
            //   results.findIndex((week) => week.week === module.module_name)
            // ].data.push(student);
            results.find(week => week.week === module.module_name).data.push(student);
          });
        });
      // return helpers.orderCountData(results);
      // console.log(results)
      return results
    })
    .catch(() => [[], []]);

  return request;
};

//eslint-disable-next-line
export default { getData, getCommitData };
