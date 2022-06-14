// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from "axios";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";

const singleObjectQueryUrl = (type, uuid) => AdapterConfiguration.createUrl(`general/single?type=${type}&uuid=${uuid}`);

export const getStudentData = async (studentID, courseID, expectGrade = 1) => {
    const baseUrl = AdapterConfiguration.createUrl(`general/single?type=aplus_user&uuid=${studentID}`);
    // const baseUrl = AdapterConfiguration.createUrl(`general/authors?page=1&pageSize=1000&type=aplus_user&data=none&links=events`);
    const studentData = await axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => {
        return response.data
    })
    .catch(error => console.log(error))

    const exercisePointsIDs = studentData.related_constructs.filter(construct => construct.type === "exercise_points");
    const exercisePointsDetails = await Promise.all(exercisePointsIDs.map(async exercise => {
        const exerciseUrl = singleObjectQueryUrl(exercise.type, exercise.id);
        const singleExercisePoint = await axios.get(exerciseUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);
        return {
            id: singleExercisePoint.id,
            moduleID: singleExercisePoint.related_constructs.find(obj => obj.type === "module_points").id || "",
            submissions: singleExercisePoint.data.submission_count,
        }
    }));

    const submissionIDs = studentData.related_events.filter(e => e.type === "submission");
    const submissionDetails = await Promise.all(submissionIDs.map(async s => {
        const submissionUrl = singleObjectQueryUrl(s.type, s.id);
        const singleSubmission = await axios.get(submissionUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);
        const exID = singleSubmission.related_constructs.find(e => e.type === "exercise_points").id || "";
        const moduleID = exercisePointsDetails.find(e => e.id === exID);
        
        const file = singleSubmission.related_constructs.find(e => e.type === "file");

        if (!file) return {}

        const fileUrl = singleObjectQueryUrl(file.type, file.id);
        const singleFile = await axios.get(fileUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);

        return {
            moduleID: moduleID ? moduleID.moduleID : "", 
            commit: singleFile.related_events.filter(e => e.type === "commit").length,
        }
    }));

    const moduleDataIDs = studentData.related_constructs.filter(construct => construct.type === "module_points");
    const moduleDetails = await Promise.all(moduleDataIDs.map((module) =>  {
        const url = singleObjectQueryUrl(module.type, module.id)
        const singleModuleData = axios.get(url, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(async response => {
            const module = response.data;
            const descriptionSplit = module.description.split(" ")[1] || [];

            const moduleRef = module.related_constructs.find(construct => construct.type === "module");
            const moduleRefUrl = moduleRef && singleObjectQueryUrl(moduleRef.type, moduleRef.id);
            const parentModule = await axios.get(moduleRefUrl,{
                Accept: "application/json",
                "Content-Type": "application/json",
            }).then (response => response.data);

            const exercisesIDs = module.related_constructs.find(async construct => construct.type === "exercise_points");
            const exercises = exercisesIDs.map(ex => {
                const exUrl = singleObjectQueryUrl(ex.type, ex.id);
                const request_ex_points = await axios.get(exUrl, {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }).then(res => res && res.data);

                const submissionsUrl = AdapterConfiguration.createUrl(`general/events?type=submissions&query=data.exercise_id==${request_ex_points.data.exercise_id};author.id==${studentID};data.submission_data.git.host_name~=gitlab&data=grade&links=constructs`);
                const request_sub = await axios.get(submissionsUrl, {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }).then(res => res && res.data.results);
                const sorted_sub = request_sub.sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                const fileObj = sorted_sub.length > 0 && sorted_sub[0].related_constructs.find(e => e.type === "file");
                const fileUrl = fileObject && singleObjectQueryUrl(fileObj.type, fileObj.id);
                const request_file = await axios.get(fileUrl, {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }).then(res => res && res.data);

                return {
                    description: request_ex_points.description,
                    exercise_id: request_ex_points.data.exercise_id,

                    submissions: request_ex_points.data.submission_count,
                    points: request_ex_points.data.points,
                    commits: request_file.data.commits.length
                }
            })
            // return module
            return {
                moduleNo: parseInt(descriptionSplit.slice(0, -1)) || 0,
                description: module.description,
                state: module.state,
                id: module.id,
                passed: module.data.passed,

                submission: module.data.submission_count,

                points: module.data.points,
                maxPoints: parentModule.data.max_points,
                pointsToPass: parentModule.data.points_to_pass,

                commit: submissionDetails.filter(s => s.moduleID === module.id).map(s => s.commit).reduce((a,b) => a + b, 0),

                numberOfExercises: parentModule.data.exercises.length,
                numberOfExercisesAttemped: exercisePointsDetails.filter(ex => ex.moduleID === module.id && ex.submissions > 0).length,

                exercises: exercises,
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
            foundModule.state = foundModule.state && module.state;
            foundModule.passed = foundModule.passed && module.passed;

            foundModule.submission += module.submission;

            foundModule.points += module.points;
            foundModule.maxPoints += module.maxPoints;
            foundModule.pointsToPass += module.pointsToPass;

            foundModule.commit += module.commit;

            foundModule.numberOfExercises += module.numberOfExercises;
            foundModule.numberOfExercisesAttemped += module.numberOfExercisesAttemped;

            foundModule.exercises = foundModule.exercises.concat(module.exercises);
        }
    });

    uniqueData.splice(15, 1);

    return uniqueData.map((module, index) => ({
        index: index,
        name: module.description,
        passed: module.passed, // true/false

        pointsToPass: module.pointsToPass || 0,
        maxPoints: module.maxPoints,

        notPassedPoints: module.maxPoints - module.points,
        expectedNotPassPoints: expectedValues[index] ? module.maxPoints - expectedValues[index]["avg_points"] : module.maxPoints,

        submission: module.submission,
        expectedSubmissions: expectedValues[index] ? expectedValues[index]["avg_submissions"] : 0,

        commit: module.commit,
        expectedCommit: expectedValues[index] ? expectedValues[index]["avg_commits"] : 0,

        points: module.points,
        expectedPoints: expectedValues[index] ? expectedValues[index]["avg_points"]*MAXPOINTS[courseID.toString()][index] : 0,

        numberOfExercises: module.numberOfExercises,
        //new
        numberOfExercisesAttemped: module.numberOfExercisesAttemped,
        expectedExercises: expectedValues[index] ? expectedValues[index]["avg_exercises"] : 0,

        pointRatio: module.maxPoints === 0 ? 1 : module.points/module.maxPoints,
        expectedPointRatio: module.maxPoints === 0 || !expectedValues[index] ? 1 : expectedValues[index]["avg_points"]/module.maxPoints,

        notPassedRatio: module.maxPoints === 0 ? 0 : 1 - module.points/module.maxPoints,
        expectedNotPassRatio: module.maxPoints === 0 || !expectedValues[index] ? 0 : 1 - expectedValues[index]["avg_points"]/module.maxPoints,

        exercises: module.exercises,
    }));
};