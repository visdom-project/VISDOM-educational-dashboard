// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

export const getPropertiesDomain = (data) => {
    const maximumSubmissions = data.reduce( (max, week) => week["submission"] > max ? week["submission"] : max, 0);
    const maxCommits = data.reduce( (max, week) => week["commit"] > max ? week["commit"] : max, 0);
    return {
        "p/maxp ratio": [0, 1],
        "NO submissions": [0, maximumSubmissions],
        "NO commits": [0, maxCommits],
    };
};