export const _MS_PER_DAY_ = 1000 * 60 * 60 * 24;

export const _NUMBER_OF_WEEKS_ = 16;

export const _DAYS_OF_WEEK_ = 7;

export const _COLOR_PALETTES_ = {
  default: "#b8f2e6",
  fullPoint: "#85e3a5",
  notDefined: "lightgrey",
  partialPoint: "palegoldenrod",
  noPoint: "salmon"
}

export const EXERCISE_INDICES = {
  "first_submission": 0,
  "beginning": 0, "typing": 1, "temperature": 2, "number_series_game": 3, "grading": 4, "factors": 4, "cube": 5, "lotto": 6, "encryption": 7, "errors": 8,
  "swap": 0, "random_numbers": 1, "bank_account": 2, "simple_library": 3, "molkky": 4,
  "container": 0, "split": 1, "tictactoe": 2, "feedback1": 3,
  "line_numbers": 0, "mixing_alphabets": 1, "points": 2, "wordcount": 3,
  "palindrome": 0, "sum": 1, "vertical": 2, "network": 3,
  "education_center2": 0, "feedback2": 1,
  "pointers": 0, "student_register": 1, "arrays": 2, "reverse_polish": 3,
  "cards": 0, "traffic": 1, "stack_modifications": 2,
  "valgrind": 0, "calculator": 1, "reverse": 2,
  "directories": 0, "feedback3": 1,
  "zoo": 0, "colorpicker_designer": 1, "find_dialog": 2, "grading_gui": 3, "timer": 4, "bmi": 5,
  "13": 0, "feedback4": 1,
  "command_line": 0, ".gitignore": 1,
  "": 0,
  "gdpr": 0,
  "projects": 0
};

// Hardcoded exercise names for implementation at Summer 2021 (courseID 40)
export const EXERCISE_INDICES_40 = {
  "first_submission": 0, "gitignore": 1,
  "beginning": 0, "typing": 1, "tyypitys": 1, "temperature": 2, "number_series_game": 3, "mean": 4, "cube": 5, 
  "lotto": 0, "swap": 1, "encryption": 2, "errors": 3, "molkky": 4, 
  "container": 0, "split": 1, "random_numbers": 2, "game15": 3, "feedback1": 4, 
  "line_numbers": 0, "mixing_alphabets": 1, "points": 2, "wordcount": 3,
  "palindrome": 0, "sum": 1, "vertical": 2, "network": 3, 
  "library": 0, "shopping": 0, "feedback2": 1, // library == shopping?
  "pointers": 0, "student_register": 1, "arrays": 2, "reverse_polish": 3, 
  "cards": 0, "traffic": 1, "task_list": 2, 
  "valgrind": 0, "calculator": 1, "reverse": 2, 
  "family": 0, "university": 0, "feedback3": 1, // family == university?
  "zoo": 0, "colorpicker_designer": 1, "find_dialog": 2, "timer": 3, "bus_timetables": 3, "bmi": 4,
  "hanoi": 0, "tetris": 1, "feedback4": 2, 
  "command_line": 0, 
  "": 0,
  "gdpr": 0
};

export const tipStyle = {
  display: 'flex',
  color: '#000',
  background: '#eff7f6',
  alignItems: 'center',
  padding: '5px',
  border: "1px darkgrey solid",
};

export const dateToNumber = date => 
  date ? Math.round(date.getTime() / _MS_PER_DAY_) : 0;

export const rangeXDeterminationForDays = data => ([dateToNumber(data.startDate), dateToNumber(data.endDate)])

export const rangeDetermination = (data, type) => {
  const maxPointsAll = data.map(module => module.maxPoints);
  const submissionsAll = data.map(module => module.submissions);
  const commitsAll = data.map(module => module.commits);
  switch(type) {
    case "points":
      return [0, Math.max(...maxPointsAll)];
    case "maxPoints": 
      return [0, Math.max(...maxPointsAll)];
    case "submissions": 
      return [0, Math.max(...submissionsAll)];
    case "commit":
      return [0, Math.max(...commitsAll)];
    default:
      return [0, Math.max(...maxPointsAll)];
  }
}

export const timeDiff = (start, end) => {
  if (!start || !end) return 0;

  const startDate = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
	const endDate = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

	return Math.floor((endDate - startDate) / _MS_PER_DAY_ );
}

/**
 * Check if two date objects represent a timestamp on a same day.
 * 
 * @param {Date} firstDate valid date object, order does not matter.
 * @param {Date} secondDate valid date object, order does not matter.
 * @returns {bool} true if day, month and year are same for given dates.
 */
export const onSameDay = (firstDate, secondDate) => {
  if (firstDate.getDate() !== secondDate.getDate()) {
    return false  // Different day (1-31)
  }
  if (firstDate.getMonth() !== secondDate.getMonth()) {
    return false  // Different month (0-11)
  }
  if (firstDate.getFullYear() !== secondDate.getFullYear()) {
    return false  // Different year
  }
  return true
}

export const maximunDetermination = array => Math.max(...array);

export const domainDetermination = (res, mode) => {
  let commitD = 0;
  let submissionD = 0;
  let pointD = 0;
  let exerciseD = 0;
  if (mode === "detail"){
    commitD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.commits));
    submissionD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.submissions));
    pointD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.maxPoints));
  } else if (mode === "summary") {
    commitD = maximunDetermination(res.map(d => d.data.map(e => e.commits).reduce((a,b) => a + b, 0)));
    submissionD = maximunDetermination(res.map(d => d.data.map(e => e.submissions).reduce((a,b) => a + b, 0)));
    pointD = maximunDetermination(res.map(d => d.data.map(e => e.maxPoints).reduce((a,b) => a + b, 0)));
    exerciseD = maximunDetermination(res.map(d => d.data.length));
  }
  return ({
    "commits": [0, commitD],
    "submissions": [0, submissionD],
    "points": [0, pointD],
    "point ratio": [0, 1],
    "attemped exercise": [0, exerciseD]
  })
}
