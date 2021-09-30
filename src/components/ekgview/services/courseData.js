/* eslint-disable no-unreachable */
import axios from "axios";
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const baseUrl = ElasticSearchConfiguration.createUrl("gitlab-course-30-aggregate-data/_search");

export const getAgregateData = (grade = 1) => {
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
    }).then(data => Object.values(data));

    return previousCourseData;
};