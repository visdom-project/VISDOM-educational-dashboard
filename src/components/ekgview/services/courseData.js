// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

/* eslint-disable no-unreachable */
import axios from "axios";
import { ElasticSearchConfiguration, AdapterConfiguration } from "../../../services/serviceConfiguration";

const MAXPOINTS = [30, 100, 110, 95, 60, 90, 55, 70, 90, 40, 55, 120, 105, 30, 0];
export const getAgregateData = (grade = 1) => {
    const baseUrl = ElasticSearchConfiguration.createUrl("gitlab-course-30-aggregate-data/_search");
    const previousCourseData = axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => response.data.hits.hits[0]._source.data_by_weeks)
    .then(data => {
        return Object.keys(data).map(week => {
            const weekData = data[week];
            Object.keys(weekData).forEach(typeOfData => weekData[typeOfData] = weekData[typeOfData][grade] );
            return weekData;
        });
    }).then(data => {
        return Object.entries(data).sort( (w1, w2) => w1[0] - w2[0]).map( w => w[1]);
    }).then(data => Object.values(data))
    .then(data => {
        return data.map((week, index) => ({...week, avg_points: week.avg_points / MAXPOINTS[index]}));
    });

    return previousCourseData;
};

export const getCourseIDs = () => {
    const baseUrl = AdapterConfiguration.createUrl(`general/metadata?type=course&data=course_id&links=none`);
    const courseIDs = axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => {
        const coursesData = response.data.results.map(course => course.data.course_id);
        return coursesData
    })
    .catch(error => console.log(error))

    return courseIDs
};
