import axios from "axios";
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";
import { getAgregateData } from "./courseData";

const baseUrl = ElasticSearchConfiguration.createUrl("gitlab-course-40-commit-data-anonymized/_search");

export const getAllStudentsData = () => {
    const request = axios
        .get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
        })
        .then((response) => {
        const allStudentData = [];
        response.data.hits.hits[0]._source.results.forEach((student) => {
            allStudentData.push(student.student_id);
        });
        return allStudentData;
        })
        // eslint-disable-next-line no-console
        .catch((someError) => console.log(someError));
        return request;
};


export const fetchStudentData = async (studentId, expectGrade = 1) => {

    // get student document
    const studentData = await axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => response.data.hits.hits[0]._source.results)
    .then(data => data.filter(student => student.student_id === studentId)[0]);


    const commits = studentData.commits.map(week => {
        return week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
    });
    const expectedValues = await getAgregateData(expectGrade);

    // metadata has 15 weeks but students have 16 weeks;
    studentData.points.modules.splice(15, 1);

    return studentData.points.modules.map( (module, index) => ({
        index: index,
        name: module.name,
        passed: module.passed, // true/false

        pointsToPass: module.points_to_pass,
        maxPoints: module.max_points,

        notPassedPoints: module.max_points - module.points,
        expectedNotPassPoints: module.maxPoints - expectedValues[index]["avg_points"],

        submission: module.submission_count,
        expectedSubmissions: expectedValues[index]["avg_submissions"],

        commit: commits[index] === undefined ? 0 : commits[index],
        expectedCommit: expectedValues[index]["avg_commits"],

        points: module.points,
        expectedPoints: expectedValues[index]["avg_points"],

        numberOfExercises: module.exercises.length,
        //new
        numberOfExercisesAttemped: module.exercises.reduce((attempt, exercise ) => exercise.points === 0 ? attempt : attempt +1, 0),
        expectedExercises: expectedValues[index]["avg_exercises"],

        pointRatio: module.max_points === 0 ? 1 : module.points/module.max_points,
        expectedPointRatio: module.max_points === 0 ? 1 : expectedValues[index]["avg_points"]/module.max_points,

        notPassedRatio: module.max_points === 0 ? 0 : 1 - module.points/module.max_points,
        expectedNotPassRatio: module.max_points === 0 ? 0 : 1 - expectedValues[index]["avg_points"]/module.max_points,
    }));
};

export const fetchStudentsData = async () => {
    const studentsData = {};
    // get students document
    await axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => response.data.hits.hits[0]._source.results)
    .then(data => data.forEach(studentData => {
        const commits = studentData.commits.map(week => {
            return week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
        });
    
        // metadata has 15 weeks but students have 16 weeks;
        //TODO: change this when change to new course data / maybe its okay to set max = 15
        studentData.points.modules.splice(15, 1);
    
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
    return studentsData;
};
