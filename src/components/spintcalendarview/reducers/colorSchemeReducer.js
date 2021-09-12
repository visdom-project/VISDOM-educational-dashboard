
// "Enum" for representing different available coloring schemes
// for issues: 
export const ColorSchemes = {
  Commits: 'commits',
  Quality: 'quality',
  Issue: 'issue'
}

const colorSchemeReducer = (state = ColorSchemes.Issue, action) => {
  switch (action.type) {
    case 'SET_COMMITS':
      return ColorSchemes.Commits;
    case 'SET_QUALITY':
      return ColorSchemes.Quality;
    case 'SET_ISSUE':
      return ColorSchemes.Issue;
    default:
      return state;
  }
};

export const toggleColorScheme = (currentColorScheme) => {
  if (currentColorScheme === ColorSchemes.Commits) {
    return setQualityScheme();
  }
  else if (currentColorScheme === ColorSchemes.Quality) {
    return setIssueScheme();
  }
  else if (currentColorScheme === ColorSchemes.Issue) {
    return setCommitScheme();
  }
}

export const setCommitScheme = () => {
  return {
    type: 'SET_COMMITS'
  };
};

export const setQualityScheme = () => {
  return {
    type: 'SET_QUALITY'
  };
};

export const setIssueScheme = () => {
  return {
    type: 'SET_ISSUE'
  };
};

export default colorSchemeReducer;
