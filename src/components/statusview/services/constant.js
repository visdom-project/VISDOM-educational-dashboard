// Hardcoded exercise names for implementation at Fall 2021
// Note, in the 2nd week, the 5th exercise is "grading" for the periods 1-2 course and "factors" for the period 2 course

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

export const PROJECT_MAPPING = {
  "01": ["first_submission"],
  "02": ["beginning", "typing", "temperature", "number_series_game", "grading", "cube", "lotto", "encryption", "errors"],
  // "02": ["beginning", "typing", "temperature", "number_series_game", "factors", "cube", "lotto", "encryption", "errors"],  // this for the period 2 course
  "03": ["swap", "random_numbers", "bank_account", "simple_library", "molkky"],
  "04": ["container", "split", "tictactoe", "feedback1"],
  "05": ["line_numbers", "mixing_alphabets", "points", "wordcount"],
  "06": ["palindrome", "sum", "vertical", "network"],
  "07": ["education_center2", "feedback2"],
  "08": ["pointers", "student_register", "arrays", "reverse_polish"],
  "09": ["cards", "traffic", "stack_modifications"],
  "10": ["valgrind", "calculator", "reverse"],
  "11": ["directories", "feedback3"],
  "12": ["zoo", "colorpicker_designer", "find_dialog", "grading_gui", "timer", "bmi"],
  "13": ["13", "feedback4"],
  "14": ["command_line", ".gitignore"],
  "15": [],
  "16": ["gdpr"],
  "17": ["projects"]
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

export const PROJECT_MAPPING_40 = {
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
