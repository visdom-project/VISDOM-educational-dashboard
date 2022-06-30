// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import React, { useEffect, useState } from "react";

import {
  XAxis,
  YAxis,
  VerticalRectSeries,
  FlexibleWidthXYPlot,
  Hint
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";

import { dataForRectGraph } from "../services/dataProcessing";
import { tipStyle } from "../services/helpers";

const RectangleGraph = ({ 
  day, 
  width, 
  height, 
  configProps,
  range
}) => {
  const [data, setData] = useState([]);
  const [hoverCell, setHoverCell] = useState(false);

  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];

  useEffect(() => {
    if (day.data.length > 0) {
      setData(dataForRectGraph(day.data, configProps));
    }
  }, [configProps]); //eslint-disable-line

  return(
    <div 
      className="rectangle-graph"
      style={{ width: `${width}`, marginTop: "20px" }}
    >
      <FlexibleWidthXYPlot height={height} xDomain={range.rangeX} yDomain={range.rangeY}>
        <XAxis hideLine hideTicks tickFormat={() => ""} />
        <YAxis hideLine hideTicks tickFormat={() => ""} />
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
            {typeX} : {hoverCell.x}
            <br />
            {typeY} : {hoverCell.y}
          </div>
        </Hint>}
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default RectangleGraph
