// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

const getOrder = (sortConfig) => {
  if (sortConfig.mode === "points") {
    if (sortConfig.pointMode === "gain points") {
      return (a, b) => a.week - b.week;
    } else if (sortConfig.pointMode === "miss points"){
      return (a, b) => a.missed - b.missed;
    }
  } else if (sortConfig.mode === "exercises") {
    if (sortConfig.exerciseMode === "complete") {
      return (a, b) => a.weekExer - b.weekExer;
    } if (sortConfig.exerciseMode === "miss") {
      return (a, b) => a.missedExer - b.missedExer;
    }
  } else if (sortConfig.mode === "submissions") {
    return (a, b) => a.submissions.reduce((x,y) => x + y, 0) - b.submissions.reduce((x,y) => x+y, 0);
  } else if (sortConfig.mode === "commits") {
    return (a, b) => a.commit_counts.reduce((x,y) => x+y, 0) - b.commit_counts.reduce((x,y) => x+y, 0);
  }
}

const sortOrder = (progressData, commitData, submissionData, sortConfig) => {
  const key = sortConfig.mode === "commits" 
    ? sortConfig.week.length < 2
      ? `0${sortConfig.week}`
      : sortConfig.week !== "14"
        ? sortConfig.week
        : "01-14"
    : sortConfig.week && sortConfig.week.toString();
  let data = []
  if (["points", "exercises"].includes(sortConfig.mode)) {
    data = [...progressData]
  } else if (sortConfig.mode === "commits") {
    data = [...commitData]
  } else if (sortConfig.mode === "submissions") {
    data = [...submissionData]
  }

  const result = data.find(d => d.week === key) 
    ? data.find(d => d.week === key).data.sort(getOrder(sortConfig)).map(s => s.id)
    : null;
  return result !== null ? sortConfig.order === "ascending" ? result : result.reverse() : null;
}

const dataSorting = (progressData, commitData, submissionData, sortConfig) => {
  const sortingOrder = sortOrder(progressData, commitData, submissionData, sortConfig);

  if (sortingOrder === null) {
    return { sortedProgress: undefined, sortedCommit: undefined, sortedSubmission: undefined }
  }

  const sortedProgress = progressData.map(week => ({...week, data: sortingOrder.map(s => week.data.find(w => w.id === s))}));
  const sortedCommit = commitData.map(week => ({...week, data: sortingOrder.map(s => week.data.find(w => w.id === s))}));
  const sortedSubmission = submissionData.map(week => ({...week, data: sortingOrder.map(s => week.data.find(w => w.id === s))}));
  return { sortedProgress, sortedCommit, sortedSubmission }
}

const moduleDataSorting = (selectedData, sortConfig) => {
  if(sortConfig.order === "ascending"){
    return selectedData.sort(getOrder(sortConfig))
  }
  else{
    return selectedData.sort(getOrder(sortConfig)).reverse()
  }
}

//eslint-disable-next-line
export default { dataSorting, sortOrder, moduleDataSorting };
