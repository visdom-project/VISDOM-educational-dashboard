import React from 'react'
import "../stylesheets/triangle-issues.css";
import '../stylesheets/details.css'
import { prefix } from "inline-style-prefixer";

const DetailWindow = ({ issue, issueIndex }) => {

	return (
		<div className='details' style={{ color: 'black', fontSize: '1em', background: "white" }}>
			<b>Issue:</b> #{issueIndex} <i>(placeholder)</i><br></br>
			<b>Project:</b> {issue.git_project.name}<br></br>
			<b>Exercise:</b> {issue.exercise.name}<br></br>
			<b>commit message:</b><br></br>
			{issue.message}
		</div>
	)
}

const getIssueColor = (colorScheme, issue) => {
	if (colorScheme === "commits") {
		return `#${issue.hash.substr(0, 6)} #0000`
	}
	else { // if (colorScheme === ColorSchemes.Quality) {
		const borderColor = issue.exercise.points > 0
			? issue.exercise.points === issue.exercise.max_points
				? '#85e3a5'					// full points, aka. no quality issues + satisfies requirements
				: issue.exercise.difficulty === 'P'		// is a project -> no grading info available
					? 'lightgrey'			// no reliable quality information available
					: 'palegoldenrod'	// 'yellow' aka. some quality issues present
			: 'salmon' 						// 0 pts aka. bad quality / does not satisfy requirements

		return `${borderColor} #0000`
	}
}

const TriangleIssue = ({ index, dx, y, orientation, issue, colorScheme }) => {
	const exerciseNumber = issue.exercise.name
		.substr(0, issue.exercise.name.search(/\|/))
		.trim()
		.substring(0, 6)
	const split = exerciseNumber.split('.');
	const magicNb = 255 / parseInt(split[2]);
	const textColor = `rgb(${255 - magicNb}, ${255 - magicNb}, ${255 - magicNb})`

	const triangleStyle = {
		// translate: `${dx*50}% -${y*100}%`,
		WebkitTransform: `translate(${dx*50}%, -${y*100}%)`,
		borderColor: getIssueColor(colorScheme, issue),
		color: textColor
	}

	return (
		<div 
			style={prefix(triangleStyle)} 
			className={`issue ${orientation}`}
		>
			<div className="exercise-number">{exerciseNumber}</div>
			<DetailWindow 
				className="triangle-issue-detail"
				issue={issue} 
				issueIndex={index}
			/>
				
		</div>
	)
}

const TriangleIssues = ({ issues, colorScheme }) => {

	/* The following positioning stacks triangles into a 2D "pyramid". */

	// Helper variables needed for position calculations:
	let diagonalRow = 0;	// 0th is the left corner triangle
	let fitCount = 1;			// 0th diagonal row fits 1 triangle, the next 3, ... 
	let dx = 0;						// Increase in offset in x-axis. Varies by nasty logic.
	let dxTot = 0;				// x offset to left (triangles overlap)
	let y = -0.5;					// 1 = height of a triangle
	let up = false;				// Should a triangle point up or down
	let orientation = '';	// Classname(s) for styling triangles in CSS

	return (
    <div className={'triangle-issue-display'}>
		{
			// Calculate an exact position for each triangle:
	  	issues.map((issue, i) => {
				if (i >= fitCount) {
					dx = diagonalRow;
					diagonalRow++;
					fitCount = fitCount + 2 * diagonalRow + 1;
					y = -0.5;
					up = false;
				}
				dxTot += dx;
				dx = up ? -2 : -3;
				y = y + 0.5;
				up = !up;
				orientation = up
					? 'triangle-up'
					: 'triangle-down';

				// render the triangle, representing the current issue:
				return <TriangleIssue 
					key={`iss${i}`} 
					index={i} 
					dx={dxTot}
					y={Math.floor(y)} 
					orientation={orientation}
					issue={issue}
					colorScheme={colorScheme}
        />
			})
		}
    </div>
  )
}

export default TriangleIssues
