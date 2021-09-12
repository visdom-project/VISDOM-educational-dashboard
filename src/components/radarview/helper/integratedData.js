export const getPropertiesDomain = (data) => {
    const maximumSubmissions = data.reduce( (max, week) => week["submission"] > max ? week["submission"] : max, 0);
    const maxCommits = data.reduce( (max, week) => week["commit"] > max ? week["commit"] : max, 0);
    return {
        "p/maxp ratio": [0, 1],
        "NO submissions": [0, maximumSubmissions],
        "NO commits": [0, maxCommits],
    };
};