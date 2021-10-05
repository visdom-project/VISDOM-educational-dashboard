import React, { useState } from "react";

import DropdownMenu from "./DropdownMenu";
import StatusTab from "./StatusTab";

import { Alert } from "react-bootstrap";

const MAX_GRAPH = 4;

const MultiStatusChartContainer = () => {
  const [graphNum, setGraphNum] = useState(1);

  return (
    <div className="multi-status-graph-container">
      <h2>{"Current Student Statuses"}</h2>
      <DropdownMenu
        handleClick={option => setGraphNum(parseInt(option, 10))}
        options={Array.from({ length: MAX_GRAPH }, (_, i) => i + 1)}
        selectedOption={graphNum}
        title="Select number of graphs: "
      />
      {graphNum > 1 && <Alert variant="warning">
        <i>Only <strong>first</strong> chart configuration allows synchronization!</i>
      </Alert>}
      {Array(graphNum)
        .fill(0)
        .map((_, item) => <div className="status-chart">
          <StatusTab key={`status-chart-${item}`} allowSync={item === 0}/>
        </div>)
      }
    </div>
  )
}

export default MultiStatusChartContainer