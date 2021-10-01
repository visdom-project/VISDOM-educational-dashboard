import React from 'react';
import "../stylesheets/calendarview.css";
import CalendarTab from "./CalendarTab";

const CalendarView = () => {
  return (
    <div className="calendar-view">
      <CalendarTab />
    </div>
  );
}

export default CalendarView