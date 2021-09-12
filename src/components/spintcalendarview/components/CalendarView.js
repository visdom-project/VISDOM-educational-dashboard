import React from 'react';
import { Provider } from 'react-redux';
import "../stylesheets/calendarview.css";
import CalendarTab from "./CalendarTab";
import store from "../store/store"

const CalendarView = () => {
  return (
    <Provider store={store}>
      <div className="calendar-view">
        <CalendarTab />
      </div>
    </Provider>
  );
}

export default CalendarView