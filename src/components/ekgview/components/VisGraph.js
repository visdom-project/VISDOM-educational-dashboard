/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  FlexibleWidthXYPlot,
  YAxis,
  LineSeries,
  AreaSeries,
  Hint
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";
import { getCurveType, extractData } from "../helper/integratedData";

const VisGraph = ({ data, configs, displayedWeek, compress, pulseRatio }) => {
  const dataInTimeframe =data.filter(week => week.index < displayedWeek[1] && week.index >= displayedWeek[0] - 1);
  const segments = extractData(dataInTimeframe, configs, compress, pulseRatio);
  const [hintTooltipValue, setHintTooltipValue] = useState(false);

  const tickValues = [];
  for (let i=displayedWeek[0]; i <= displayedWeek[1]; i++){
      tickValues.push(i);
  }

  return pulseRatio !== 0 && (
    <FlexibleWidthXYPlot height={500}>
      <VerticalGridLines />
      <HorizontalGridLines />
      {compress ? <XAxis tickValues={tickValues}/> : null }
      <YAxis />
      {hintTooltipValue && <Hint value={hintTooltipValue} /> }
      {
      segments.map( (segment, index) => {
          const Series = segment.colorFilled === "#ffffff" ? LineSeries : AreaSeries;
          const weekData = data[segment.index];
          const dataTooltip = {
            "Week": weekData.index + 1,
            "Pass status": JSON.stringify(weekData.passed),
            "Point to pass": weekData.pointsTopass,
            "Max points": weekData.maxPoints,
            "Number of submissions": weekData.submission,
            "Expected number of submissions": weekData.expectedSubmissions.toFixed(2),
            "Number of commits": weekData.commit,
            "Expected number of commit": weekData.expectedCommit.toFixed(2),
            "Points": weekData.points,
            "Expected points": weekData.expectedPoints.toFixed(2),
            "Missed points": weekData.notPassedPoints,
            "Number of exercises": weekData.numberOfExercises,
            "Number of attemped exercises": weekData.numberOfExercisesAttemped,
            "Expected number of exercises": weekData.expectedExercises.toFixed(2),
            "Points / maxpoints ratio": weekData.pointRatio.toFixed(2),
          };

          const segmentProps = {
            data: segment.data,
            color: segment.color,
            fill: segment.colorFilled === "#ffffff" ? null : segment.colorFilled,
            curve: getCurveType(segment.shape),
            // onSeriesMouseOver: (e) => setHintTooltipValue({ ...dataTooltip, x: segment.index + 1, y: 0 }),
            onSeriesMouseOver: () => setHintTooltipValue({ ...dataTooltip, x: segment.data[0].x + 1, y: 0 }),

            onSeriesMouseOut: () => setHintTooltipValue(false),
        };
          return (<Series key={`segment-${index}`} {...segmentProps}/>);
        })
      }
    </FlexibleWidthXYPlot>
  );
};

export default VisGraph;