/* eslint-disable camelcase */
import axios from "axios";
import { ElasticSearchConfiguration } from "../../../services/serviceConfiguration";

const getStudentData = () => {
  const baseUrl = ElasticSearchConfiguration.createUrl(
    "gitlab-course-40-commit-data-anonymized/_search"
  );
  const request = axios
    .get(baseUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .then((response) => {
      // TODO: remove hard-coding from this mapping of modules and corresponding project names:
      const PROJECT_MAPPING = {
        "01": ["first_submission", "gitignore"],
        "02": [
          "(K) Hello, World! (Tehtävä Aloitus)",
          "(K) Staattinen tyypitys (Tehtävä Tyypitys)",
          "temperature",
          "number_series_game",
          "mean",
          "cube",
        ],
        "03": ["lotto", "swap", "encryption", "errors", "molkky"],
        "04": [
          "container",
          "split",
          "random_numbers",
          "game15",
          "(K) Peli 15 -projektin palaute (Tehtävä Palaute1)",
        ],
        "05": ["line_numbers", "mixing_alphabets", "points", "wordcount"],
        "06": ["palindrome", "sum", "vertical", "network"],
        "07": ["library", "(K) Kirjastoprojektin palaute (Tehtävä Palaute2)"],
        "08": [
          "(K) Osoittimien_tulostukset (Tehtävä Osoittimet)",
          "student_register",
          "arrays",
          "reverse_polish",
        ],
        "09": ["cards", "traffic", "task_list"],
        10: ["valgrind", "calculator", "reverse"],
        11: ["family", "(K) Sukuprojektin palaute (Tehtävä Palaute3)"],
        12: ["zoo", "colorpicker_designer", "find_dialog", "timer", "bmi"],
        13: [
          "moving_circle2/hanoi",
          "tetris",
          "(K) Hanoin torni -projektin palaute (Tehtävä Palaute4)",
        ],
        "01-14": ["command_line"],
        15: [],
        16: ["(K) Tutkimussuostumus (Tehtävä gdpr)"],
      };

      const studentData = [];

      // Parse fetched commit data into proper format and fill in missing data:
      response.data.hits.hits.forEach((hit) => {
        hit._source.results.forEach((result) => {
          // Start with a data stucture with proper default values:
          const newCommits = Object.keys(PROJECT_MAPPING).map((moduleName) => {
            return {
              module_name: moduleName,
              projects: PROJECT_MAPPING[moduleName].map((projectName) => {
                return { name: projectName, commit_count: 0, commit_meta: [] };
              }),
            };
          });

          // Override default values with student data wherever there is any:
          result.commits.forEach((module) => {
            const newModule = module;
            const moduleIndex = newCommits.findIndex(
              (commitModule) => commitModule.module_name === module.module_name
            );

            if (moduleIndex > -1) {
              // Ignore modules with erroneous names

              // Fill in missing project data:
              const newProjects = newCommits[moduleIndex].projects;
              module.projects.forEach((studentProject) => {
                const projectIndex = newProjects.findIndex((project) =>
                  project.name.includes(studentProject.name)
                );
                if (projectIndex < newProjects.length && projectIndex > -1) {
                  newProjects[projectIndex] = studentProject;
                } else {
                  //console.log("Excluding a project from commit data; it was not recognized as submittable exercise:", studentProject);
                }
              });
              newModule.projects = newProjects;
              newCommits[moduleIndex] = newModule;
            }
          });

          result.commits = newCommits;
          studentData.push(result);
        });
      });

      return studentData;
    })
    .catch(() => [[], []]);

  return request;
};

//eslint-disable-next-line
export default { getStudentData };
