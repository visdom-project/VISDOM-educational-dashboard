import axios from "axios";
import { AdapterConfiguration } from "../../../services/serviceConfiguration";

export const getCourseIDs = () => {
    const baseUrl = AdapterConfiguration.createUrl(`general/metadata?type=course`);
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