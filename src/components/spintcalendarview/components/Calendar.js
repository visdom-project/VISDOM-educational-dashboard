import React from "react";
import IssueDisplay from './Issues';
import Toggle from './Toggle';
import '../stylesheets/calendar.css';

const Day = ({ content }) => {
  return (
    <div className='day'>
      <h4 className="date-content">{content.key}</h4>
      <IssueDisplay issues={content.issues} />
    </div>
  )
}

const Calendar = ({ timeframe }) => {
  
  if (timeframe === undefined) {
    return <div>No timeframe to show</div>
  }

  return (
    <>
      <Toggle />
      <div className='calendar'>
        {timeframe.map((day,i) => <Day key={`${day.key} ${i}`} content={day} />)}
      </div>
    </>
  )
}

export default Calendar
