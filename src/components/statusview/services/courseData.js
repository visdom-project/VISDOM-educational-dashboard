// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

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