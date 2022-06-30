// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from "axios";
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const baseUrl = ElasticSearchConfiguration.createUrl(
  "gitlab-course-30-aggregate-data/_search"
);

const getHistoryData = () => {
  const request = axios
    .get(baseUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .then((response) => {
      return response.data.hits.hits[0]._source["data_by_weeks"];
    })
    .catch(() => [[], []]);

  return request;
};

// eslint-disable-next-line
export default { getHistoryData };
