import React, { useEffect, useState } from "react";

import { tipStyle } from "../services/helpers";
import { dataForRadarGraph } from "../services/dataProcessing";

import { 
  RadarChart, 
  makeVisFlexible, 
  Hint
} from "react-vis";

const FlexibleRadarChart = makeVisFlexible(RadarChart);

const RadarGraph = ({ day, domain, width, height, radarConfigProps }) => {
  const [data, setData] = useState([]);
  const [hoverCell, setHoverCell] = useState(false);
  const [hoverCellValue, setHoverCellValue] = useState(false);

  useEffect(() =>{
    if (day.data.length > 0) {
      setData(dataForRadarGraph(day.data, radarConfigProps));
    }
  }, [radarConfigProps]) //eslint-disable-line

  if (day.data.length === 0) return null;
  console.log(hoverCellValue)
  return (
    <div className="radar-chart" style={{ width: width, height: height }}>
      <FlexibleRadarChart
        data={data}
        startingAngle={0}
        colorType="literal"
        margin={{left: 0, right: 30, top: 10, bottom: 20}}
        domains={radarConfigProps.display.map(key => ({
          name: key,
          domain: domain[key]
        }))}
        onSeriesMouseOver={d => setHoverCell(d.event[0])}
        onSeriesMouseOut={() => setHoverCell(false)}
        onValueMouseOver={v => setHoverCellValue(v)}
        onValueMouseOut={() => setHoverCellValue(false)}
      >
        {hoverCell && <Hint value={{x: 0, y: 0}}>
          <div style={tipStyle}>{hoverCell.name}</div>
        </Hint>}
        {hoverCellValue && <Hint value={hoverCellValue}>
          <div style={tipStyle}>
            {hoverCellValue.dataName}
            <br />
            {hoverCellValue.domain} : {hoverCellValue.value}
          </div>  
        </Hint>}
      </FlexibleRadarChart>
  </div>
  )
}

export default RadarGraph
