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
    }).then(data => {
      console.log(data);
      return data;
    })
    .catch(() => [[], []]);

  return request;
};

// eslint-disable-next-line
export default { getHistoryData };
