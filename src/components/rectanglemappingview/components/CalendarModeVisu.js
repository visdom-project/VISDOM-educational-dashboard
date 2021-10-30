import React, { useEffect, useRef, useState } from "react";

import { 
  domainDetermination, 
  rangeDetermination
} from "../services/helpers";
import dataForCalendarMode from "../services/dataForCalendarMode";

import RadarGraph from "./RadarGraph";
import RectangleGraph from "./RectangleGraph";

import '../stylesheets/calendar.css';
import {
  Button,
  Modal
} from "react-bootstrap";
import studentData from "../services/studentData";

const Day = ({ 
  day, 
  domain, 
  radarConfigProps,
  radarMode,
  configProps,
  range
}) => {
  const [open, setOpen] = useState(false);
  const date_format = day.date.toLocaleString("en-US",
    {
      weekday: 'short', 
      day: 'numeric',
      year: 'numeric',
      month: 'short'
    })
  const [wheight, setwHeight] = useState(0)
  const ref = useRef(null);

  const heightCalculator = w => {
    const xUnit = range.rangeX[1];
    const yUnit = range.rangeY[1];
    return isNaN(w * (yUnit / xUnit)) ? 0 : (w * (yUnit / xUnit));
  }

  const heightResponsive = () => {
    setwHeight(heightCalculator(ref.current.offsetWidth))
  }

  useEffect(() => {
    heightResponsive();
    window.addEventListener("resize", heightResponsive);
    return () => window.removeEventListener("resize", heightResponsive);
  }, [configProps, day]) //eslint-disable-line

  return(
    <div key={`container-${date_format}`} className="day">
      <div onClick={() => setOpen(radarMode && true)} ref={ref} style={{ width: "100%" }}>
        <h4 className="date-content" style={{ width: "100%" }}>{date_format}</h4>
        {radarMode && <RadarGraph 
          day={day}
          domain={domain}
          width="100%" 
          height="240px" 
          key={day.date.toString()}
          radarConfigProps={radarConfigProps}
        />}
        {!radarMode && <RectangleGraph 
          day={day}
          width="100%" 
          height={wheight}
          range={range}
          configProps={configProps}
          open={open}
        />}
      </div>
      {radarMode && <div className="detail-radar-dialog" style={{width: "700px"}}>
        <Modal show={open} onHide={() => setOpen(false)}>
          <Modal.Header>
            <Modal.Title id="radar-dialog-title">Detail of {date_format}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ width: "inherit" }}>
              <RadarGraph 
                day={day} 
                domain={domain}
                width="400px"
                height="450px"
                key={`detail-radar-${date_format}`}
                radarConfigProps={radarConfigProps}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpen(false)} variant="outline-danger">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>}
    </div>
  )
}

const CalendarModeVisu = ({ 
  studentID,
  courseID,
  radarConfigProps,
  configProps,
  radarMode
}) => {
  const [data, setData] = useState([]);
  const [domain, setDomain] = useState({
    "commits": [0, 0],
    "submissions": [0, 0],
    "points": [0, 0],
    "point ratio": [0, 1],
    "attemped exercise": [0, 0]
  })
  const [range, setRange] = useState({
    rangeX: [0, 1],
    rangeY: [0, 1]
  })
  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];

  useEffect(() => {
    if (studentID) {
      dataForCalendarMode(studentID, courseID)
        .then(res => {
          setData(res)
          if (res) {
            setDomain(domainDetermination(res, radarConfigProps.dayMode));
          }
        })
      studentData(studentID, courseID)
        .then(res => {
          const rangeD = rangeDetermination(res, typeX)[1] > rangeDetermination(res, typeY)[1] 
            ? rangeDetermination(res, typeX) 
            : rangeDetermination(res, typeY)
          setRange({...range, rangeX: rangeD, rangeY: rangeD})
        })
    }
  }, [studentID, configProps, radarMode, radarConfigProps, courseID]) //eslint-disable-line

  if (!data) return <div>No data to show</div>

  return(
    <div className="calendar">
      {data.map((d, i) => 
        <Day 
          day={d}
          domain={domain}
          key={d.date.toString() + i}
          radarConfigProps={radarConfigProps}
          configProps={configProps}
          radarMode={radarMode}
          range={range}
        />)}
    </div>
  )

};

export default CalendarModeVisu
