import axios from "axios";
// import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { getAgregateData } from "./courseData";

// TODO: fix base URL and courseId, parameter in request
// const courseId = process.env.REACT_APP_COURSE_ID;

export const getAllStudentsData = courseID => {
    const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/usernames?courseId=${courseID}`

    const request = axios
        .get(baseUrl, {
            headers:{
                Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.data.results)
        // eslint-disable-next-line no-console
        .catch((someError) => console.log(someError));
        return request;
};


export const fetchStudentData = async (studentId, courseID, expectGrade = 1) => {
    const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}&username=${studentId}`;
    // get student document
    const studentData = await axios.get(baseUrl, {
        headers:{
            Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }).then(response => response.data.results)
    .then(data => data[0]);

    const commits = {};
    studentData.commits.forEach(week => {
            try {
                const weekNumber = parseInt(week.module_name);
                commits[weekNumber] = week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
            }
            catch (err) {
                console.log(err);
            }
    });
    const expectedValues = await getAgregateData(expectGrade);
    

    // metadata has 15 weeks but students have 16 weeks;
    studentData.points.modules.splice(15, 1);

    //expected value is missing 15th and 16th week
    return studentData.points.modules.map( (module, index) => ({
        index: index,
        name: module.name,
        passed: module.passed, // true/false

        pointsToPass: module.points_to_pass || 0,
        maxPoints: module.max_points,

        notPassedPoints: module.max_points - module.points,
        expectedNotPassPoints: expectedValues[index] ? module.maxPoints - expectedValues[index]["avg_points"] : module.maxPoints,

        submission: module.submission_count,
        expectedSubmissions: expectedValues[index] ? expectedValues[index]["avg_submissions"] : 0,

        commit: commits[index] === undefined ? 0 : commits[index],
        expectedCommit: expectedValues[index] ? expectedValues[index]["avg_commits"] : 0,

        points: module.points,
        expectedPoints: expectedValues[index] ? expectedValues[index]["avg_points"] : 0,

        numberOfExercises: module.exercises.length,
        //new
        numberOfExercisesAttemped: module.exercises.reduce((attempt, exercise ) => exercise.points === 0 ? attempt : attempt +1, 0),
        expectedExercises: expectedValues[index] ? expectedValues[index]["avg_exercises"] : 0,

        pointRatio: module.max_points === 0 ? 1 : module.points/module.max_points,
        expectedPointRatio: module.max_points === 0 || !expectedValues[index] ? 1 : expectedValues[index]["avg_points"]/module.max_points,

        notPassedRatio: module.max_points === 0 ? 0 : 1 - module.points/module.max_points,
        expectedNotPassRatio: module.max_points === 0 || !expectedValues[index] ? 0 : 1 - expectedValues[index]["avg_points"]/module.max_points,
    }));
};

export const fetchStudentsData = async (courseID) => {
    const baseUrl = `${process.env.REACT_APP_ADAPTER_HOST}/adapter/data?courseId=${courseID}`;
    const studentsData = {};
    // get students document
    await axios.get(baseUrl, {
        headers:{
            Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }).then(response => response.data.results)
    .then(data => data.forEach(studentData => {
        const commits = {};
        studentData.commits.forEach(week => {
            let weekNumber = 0;
            try {
                const n = parseInt(week.module_name);
                weekNumber = n;
                commits[weekNumber] = week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
            }
            catch (err) {
            }
        });
    
        // metadata has 15 weeks but students have 16 weeks;
        //TODO: change this when change to new course data / maybe its okay to set max = 15
        studentData.points.modules.splice(15, 1);

        // dont have expectData
        studentsData[studentData.student_id] = studentData.points.modules.map( (module, index) => ({
            index: index,
            name: module.name,
            passed: module.passed, // true/false
    
            pointsToPass: module.points_to_pass,
            maxPoints: module.max_points,
    
            notPassedPoints: module.max_points - module.points,
    
            submission: module.submission_count,
    
            commit: commits[index] === undefined ? 0 : commits[index],
    
            points: module.points,
    
            numberOfExercises: module.exercises.length,
            //new
            numberOfExercisesAttemped: module.exercises.reduce((attempt, exercise ) => exercise.points === 0 ? attempt : attempt +1, 0),
    
            pointRatio: module.max_points === 0 ? 1 : module.points/module.max_points,
    
            notPassedRatio: module.max_points === 0 ? 0 : 1 - module.points/module.max_points,
        }));
    }));

    // cumulative Data:
    
    Object.values(studentsData).forEach(student => {
        student.forEach((week, index) => {
            if (index === 0) {
                week.cumPoints = week.points;
                week.cumCommit = week.commit;
                week.cumSubmission = week.submission;
                week.cumExercises = week.numberOfExercisesAttemped
            }
            else {
                week.cumPoints = student[index-1].cumPoints + week.points;
                week.cumCommit = student[index-1].cumCommit + week.commit;
                week.cumSubmission = student[index-1].cumSubmission + week.submission;
                week.cumExercises = student[index-1].cumExercises + week.numberOfExercisesAttemped;
            }
        })
    });
    return studentsData;
};
