import axios from 'axios'
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const baseUrl = ElasticSearchConfiguration.createUrl('gitlab-course-40-commit-data-anonymized/_search');

const studentsInformation = () => {
  const request = axios
    .get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    })
    .then(response => (
      response.data.hits.hits[0]._source.results.map(student => (
        {
          username: student.username,
          student_id: student.student_id,
          email: student.email,
          fullname: student.full_name,
        }
      ))
    ))
    .catch(someErrors => console.log(someErrors))
  
  return request;
}

export default studentsInformation
