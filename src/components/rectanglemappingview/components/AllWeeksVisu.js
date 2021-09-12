import React, { useRef, useState, useEffect } from "react";

import { dataForAllWeeks } from "../services/dataProcessing";
import {
  rangeDetermination,
  _DAYS_OF_WEEK_,
  tipStyle,
  _NUMBER_OF_WEEKS_
} from "../services/helpers";

import {
  XAxis,
  YAxis,
  VerticalRectSeries,
  VerticalGridLines,
  HorizontalGridLines,
  FlexibleWidthXYPlot,
  Hint
} from "react-vis";
import { Form } from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range";
import "../../../../node_modules/react-vis/dist/style.css";

const AllWeeksVisu = ({ 
  rawData, 
  configProps, 
  weekDisplay,
  setWeekDisplay,
  setTimescale
}) => {
  const [hoverCell, setHoverCell] = useState(false);
  const [data, setData] = useState([]);

  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];

  const rangeY = rangeDetermination(rawData, typeY);
  const rangeX = rangeDetermination(rawData, typeX);

  const ref = useRef(null);

  const [wheight, setwHeight] = useState(0);

  const heightResponsive = () => {
    const rangeDisplay = weekDisplay[1] - weekDisplay[0];
    const xUnit = typeX === "commitDay" ? _DAYS_OF_WEEK_ : rangeX[1];
    const yUnit = rangeY[1];
    const tempH = isNaN((ref.current.offsetWidth / rangeDisplay) * (yUnit / xUnit)) ? 0 : (ref.current.offsetWidth / rangeDisplay) * (yUnit / xUnit)
    setwHeight(tempH);
  }

  useEffect(() => {
    setData(dataForAllWeeks(rawData, configProps))
  }, [configProps, rawData]) //eslint-disable-line

  useEffect(() => {
    heightResponsive();
    window.addEventListener("resize", heightResponsive);
    return () => window.removeEventListener("resize", heightResponsive);
  }, [configProps, weekDisplay, rawData]) //eslint-disable-line

  return(
    <div className="all-weeks-visu" ref={ref} style={{ width: "100%"}}>
      <FlexibleWidthXYPlot height={configProps.pointMode[typeY] === "percentage" ? 450 : wheight + 50} xDomain={weekDisplay} yDomain={rangeY}>
        <VerticalGridLines />
        <HorizontalGridLines />

        <XAxis 
          title={typeX}
          tickFormat={val => Math.round(val) === val ? val : ""}
        />
        <YAxis
          tickFormat={val => configProps.pointMode[typeY] === "percentage" 
            ? ((val/rangeY[1]) * 100).toFixed(0) + "%"
            : Math.round(val) === val ? val : ""}
        />
        <VerticalRectSeries
          data={data} 
          colorType="literal"
          stroke="black"
          onValueMouseOver={v => setHoverCell(v)}
          onValueMouseOut={() => setHoverCell(false)}
        />
        {hoverCell && <Hint value={{ x: hoverCell.x, y: hoverCell.y }}>
          <div style={tipStyle}>
            {hoverCell.key}
            <br />
            {typeX} : {typeX !== "commitDay" 
              ? Math.round((hoverCell.x - hoverCell.x0)*rangeX[1])
              : Math.round((hoverCell.x - hoverCell.x0)*_DAYS_OF_WEEK_)}
            <br />
            {typeY} : {hoverCell.y - hoverCell.y0} {configProps.pointMode[typeY] === "percentage" && `(${(((hoverCell.y - hoverCell.y0)/rangeY[1]) * 100).toFixed(0)}%)`}
          </div>
        </Hint>}
      </FlexibleWidthXYPlot>
      {rawData.length !== 0 && <div className="week-display">
        <Form.Label>Weeks range display</Form.Label>
        <TwoThumbInputRange
          values={weekDisplay}
          min={0}
          max={_NUMBER_OF_WEEKS_}
          onChange={(newValue) => {
            const time = newValue.sort((a,b) => a-b)
            setWeekDisplay(time)
            setTimescale({
              start: (time[0] - 1) * 7,
              end: (time[1] - 1) * 7 -1
            })
          }}
        />
      </div>}
    </div>
  );
}

export default AllWeeksVisu
