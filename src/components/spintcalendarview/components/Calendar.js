import React, { useState } from "react";
import TriangleIssues from "./TriangleIssues"
import DropdownMenu from "./DropdownMenu";
import '../stylesheets/calendar.css';

const Day = ({ content, colorScheme }) => {
  return (
    <div className='day'>
      <h4 className="date-content">{content.key}</h4>
      <TriangleIssues issues={content.issues} colorScheme={colorScheme} />
    </div>
  )
}

const Calendar = ({ timeframe }) => {
  const COLORSCHEMES = ["issue", "commits", "quality"];
  const [colorScheme, setColorScheme] = useState(COLORSCHEMES[0]);
  
  if (timeframe === undefined) {
    return <div>No timeframe to show</div>
  }

  return (
    <>
      <DropdownMenu
        handleClick={option => setColorScheme(option)}
        options={COLORSCHEMES}
        selectedOption={colorScheme}
        title="Color Scheme:"
      />
      <div className='calendar'>
        {timeframe.map((day,i) => <Day key={`${day.key} ${i}`} content={day} colorScheme={colorScheme}/>)}
      </div>
    </>
  )
}

export default Calendar
