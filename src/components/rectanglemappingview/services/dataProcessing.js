import {
  _COLOR_PALETTES_,
  rangeDetermination,
  timeDiff,
  _DAYS_OF_WEEK_,
  dateToNumber
} from "./helpers";

const dataSummary = data => {
  const sum = arr => arr.reduce((a,b) => a + b, 0);
  return ({
    difficulty: data.map(d => d.difficulty).includes("P") ? "P" : "",
    maxPoints: sum(data.map(d => d.maxPoints)),
    points: sum(data.map(d => d.points)),
    submissions: sum(data.map(d => d.submissions)),
    commits: sum(data.map(d => d.commits)),
    passed: data.map(d => d.difficulty).includes(true),
    pointRatio: sum(data.map(d => d.maxPoints)) !== 0 ? (sum(data.map(d => d.points)) / sum(data.map(d => d.maxPoints))) : 0,
    attemped: data.length,
    fill: "",
    stroke: "#000000"
  })
}

const colorDetermination = (module, typeColor, colorFill) => {
  let color = colorFill;
  if (typeColor === "points") {
    color = module.points > 0
      ? module.points === module.maxPoints
      ? _COLOR_PALETTES_.fullPoint                            //full point
      : module.difficulty === "P"
        ? _COLOR_PALETTES_.notDefined                         //no information for indentity
        : _COLOR_PALETTES_.partialPoint                       //partial points
      : _COLOR_PALETTES_.noPoint    
  } else if (typeColor === "result status") {
    color = module.points > 0
      ? _COLOR_PALETTES_.fullPoint                            //partial points
      : _COLOR_PALETTES_.noPoint    
  }
  return color;
}

export const dataForAllWeeks = (data, configProps) => {
  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];
  const typeOpacity = configProps.opacity.split("-")[0];
  const typeColor = configProps.color.split("-")[0];
  const mode = configProps.dayMode;

  const initData = mode === "summary" 
    ? data.map((module, i) => ({
      key: module.name,
      x0: i + 1,
      x: i + 1,
      y0: 0,
      y: 0,
      opacity: 1,
      color: colorDetermination(module, typeColor, configProps.fillMode)
    }))
    : data.map((module, i) => module.exercises.map(e => ({
      key: e.name,
      x0: i + 1,
      x: i + 1,
      y0: 0,
      y: 0,
      opacity: 1,
      color: colorDetermination(e, typeColor, configProps.fillMode)
    })))

  const xAxisUnit = rangeDetermination(data, typeX)[1] !== 0 
    ? 1 / rangeDetermination(data, typeX)[1]
    : 0;

  if (mode === "summary") {
    data.forEach((module,i) => {
      if (typeX === "commit") {
        initData[i].x += module.commits * xAxisUnit;
      } else if (typeX === "points") {
        initData[i].x += module.points * xAxisUnit;
      } else if (typeX === "maxPoints") {
        initData[i].x += module.maxPoints * xAxisUnit;
      } else if (typeX === "submissions") {
        initData[i].x += module.submissions * xAxisUnit;
      } else if (typeX === "commitDay") {
        const unit = 1/_DAYS_OF_WEEK_;
        const time = timeDiff(module.startDate, module.firstCommitDate);
        const commitDate = dateToNumber(module.firstCommitDate);
        const moduleStart = dateToNumber(module.startDate);
        const moduleEnd = dateToNumber(module.endDate);

        if (commitDate <= moduleStart) {
          if (module.commitDays <= _DAYS_OF_WEEK_) {
            initData[i].x += module.commitDays * unit;
          } else {
            initData[i].x += _DAYS_OF_WEEK_ * unit;
          }
        } else if (commitDate >= moduleEnd) {
            initData[i].x += _DAYS_OF_WEEK_ * unit;
          if (module.commitDays <= _DAYS_OF_WEEK_) {
            initData[i].x0 += (_DAYS_OF_WEEK_ - module.commitDays) * unit;
          }
        } else {
          initData[i].x0 += time * unit;
          if ((time + module.commitDays) <= _DAYS_OF_WEEK_) {
            initData[i].x += (time + module.commitDays) * unit;
          } else {
            initData[i].x += _DAYS_OF_WEEK_ * unit;
          }
        }
      };

      if (typeY === "commit") {
        initData[i].y += module.commits;
      } else if (typeY === "points") {
        initData[i].y += module.points;
      } else if (typeY === "maxPoints") {
        initData[i].y += module.maxPoints;
      } else if (typeY === "submissions") {
        initData[i].y += module.submissions;
      };

      if (typeOpacity === "points") {
        initData[i].opacity = isNaN(module.points / module.maxPoints)
          ? 0
          : module.points / module.maxPoints;
      } else if (typeOpacity === "submissions") {
        initData[i].opacity = isNaN(module.submissions / module.commits)
          ? 0
          : module.submissions / module.commits;
      }
    })
  } else if (mode === "detail") {
      data.forEach((module, i) => {
        let yAxis = 0;
        module.exercises.forEach((e, idx) => {
          if (typeX === "commit") {
            initData[i][idx].x += module.commits * xAxisUnit;
          } else if (typeX === "points") {
            initData[i][idx].x += module.points * xAxisUnit;
          } else if (typeX === "maxPoints") {
            initData[i][idx].x += module.maxPoints * xAxisUnit;
          } else if (typeX === "submissions") {
            initData[i][idx].x += module.submissions * xAxisUnit;
          } else if (typeX === "commitDay") {
            const unit = 1/_DAYS_OF_WEEK_;
            const time = timeDiff(module.startDate, module.firstCommitDate);
            const commitDate = dateToNumber(module.firstCommitDate);
            const moduleStart = dateToNumber(module.startDate);
            const moduleEnd = dateToNumber(module.endDate);

            if (commitDate <= moduleStart) {
              if (module.commitDays <= _DAYS_OF_WEEK_) {
                initData[i][idx].x += module.commitDays * unit;
              } else {
                initData[i][idx].x += _DAYS_OF_WEEK_ * unit;
              }
            } else if (commitDate >= moduleEnd) {
                initData[i][idx].x += _DAYS_OF_WEEK_ * unit;
              if (module.commitDays <= _DAYS_OF_WEEK_) {
                initData[i][idx].x0 += (_DAYS_OF_WEEK_ - module.commitDays) * unit;
              }
            } else {
              initData[i][idx].x0 += time * unit;
              if ((time + module.commitDays) <= _DAYS_OF_WEEK_) {
                initData[i][idx].x += (time + module.commitDays) * unit;
              } else {
                initData[i][idx].x += _DAYS_OF_WEEK_ * unit;
              }
            };
          }

          initData[i][idx].y0 = yAxis;

          if (typeY === "commit") {
            initData[i][idx].y = yAxis + e.commits;
            yAxis += e.commits;
          } else if (typeY === "points") {
            initData[i][idx].y = yAxis + e.points;
            yAxis += e.points;
          } else if (typeY === "maxPoints") {
            initData[i][idx].y = yAxis + e.maxPoints;
            yAxis += e.maxPoints
          } else if (typeY === "submissions") {
            initData[i][idx].y = yAxis + e.submissions;
            yAxis += e.submissions;
          };
    
          if (typeOpacity === "points") {
            initData[i][idx].opacity = isNaN(e.points / e.maxPoints)
              ? 0
              : e.points / e.maxPoints;
          } else if (typeOpacity === "submissions") {
            initData[i][idx].opacity = isNaN(e.submissions / e.commits)
              ? 0
              : e.submissions / e.commits;
          };
        });
      }
    );
  }

  return mode === "summary" ? initData : initData.flat(1);
}

export const dataForRectGraph = (data, configProps) => {
  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];
  const typeOpacity = configProps.opacity.split("-")[0];
  const typeColor = configProps.color.split("-")[0];

  const sumData = [dataSummary(data)];
  const dataForProcess = configProps.dayMode === "summary" ? sumData : data;
  const initData = dataForProcess.map((d) => ({
      key: d.name,
      x0: 0,
      x: 0,
      y0: 0,
      y: 0,
      opacity: 1,
      color: colorDetermination(d, typeColor, configProps.fillMode)
    }))

  let x = 0;
  dataForProcess.forEach((module, i) => {
    if (typeX === "commit") {
      initData[i].x0 = x;
      initData[i].x = x + module.commits;
      x += module.commits;
    } else if (typeX === "points") {
      initData[i].x0 = x;
      initData[i].x = x + module.points;
      x += module.points;
    } else if (typeX === "maxPoints") {
      initData[i].x0 = x;
      initData[i].x = x + module.maxPoints;
      x += module.maxPoints;
    } else if (typeX === "submissions") {
      initData[i].x0 = x;
      initData[i].x = x + module.submissions;
      x += module.submissions;
    };

    if (typeY === "commit") {
      initData[i].y = module.commits;
    } else if (typeY === "points") {
      initData[i].y = module.points;
    } else if (typeY === "maxPoints") {
      initData[i].y = module.maxPoints;
    } else if (typeY === "submissions") {
      initData[i].y = module.submissions;
    };

    if (typeOpacity === "points") {
      initData[i].opacity = isNaN(module.points / module.maxPoints)
        ? 0
        : module.points / module.maxPoints;
    } else if (typeOpacity === "submissions") {
      initData[i].opacity = isNaN(module.submissions / module.commits)
        ? 0
        : module.submissions / module.commits;
    }
  })

  return initData;
}

export const dataForRadarGraph = (data, radarConfigProps) => {
  const sumData = dataSummary(data);
  let tempData = [];
  
  if (radarConfigProps.dayMode === "summary") {
    tempData = [{
      "commits": sumData.commits,
      "submissions": sumData.submissions,
      "points": sumData.points,
      "point ratio": sumData.pointRatio,
      "attemped exercise": sumData.attemped,
      fill: colorDetermination(sumData, radarConfigProps.color, radarConfigProps.fillMode),
      stroke: sumData.stroke
    }]
  } else if (radarConfigProps.dayMode === "detail") {
    tempData = data.map(d => ({
      "commits": d.commits,
      "submissions": d.submissions,
      "points": d.points,
      "point ratio": d.pointRatio,
      "attemped exercise": 0,
      fill: colorDetermination(d, radarConfigProps.color, radarConfigProps.fillMode),
      stroke: d.stroke
    }));
  }

  return tempData;
}
