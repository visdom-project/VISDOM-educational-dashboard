import React, { useState } from "react";

import DropdownMenu from "./DropdownMenu";
import StatusTab from "./StatusTab";

import { Alert, Form } from "react-bootstrap";

const MAX_GRAPH = 4;

const MultiStatusChartContainer = () => {
  const [graphNum, setGraphNum] = useState(1);
  const [sameSortProps, setSameSortProps] = useState(true);
  const [sortProps, setSortProps] = useState({});

  return (
    <div className="multi-status-graph-container">
      <h2>{"Current Student Statuses"}</h2>
      <DropdownMenu
        handleClick={option => setGraphNum(parseInt(option, 10))}
        options={Array.from({ length: MAX_GRAPH }, (_, i) => i + 1)}
        selectedOption={graphNum}
        title="Select number of graphs: "
      />
      {graphNum >  1 && <Form.Check
        type="switch"
        label="Sorting synchronization between status graphs"
        onClick={() => setSameSortProps(!sameSortProps)}
        defaultChecked
        style={{ margin: "20px" }}
      />}
      {graphNum > 1 && <Alert variant="warning">
        <i>Only <strong>first</strong> chart configuration allows synchronization with other visualizations!</i>
      </Alert>}
      {Array(graphNum)
        .fill(0)
        .map((_, item) => <div className="status-chart" key={`status-chart-${item}-container`}>
          <StatusTab 
            key={`status-chart-${item}`} 
            allowSync={item === 0} 
            sortProps={sortProps} 
            setSortProps={setSortProps}
            sameSortProps={sameSortProps}
          />
        </div>)
      }
    </div>
  )
}

export default MultiStatusChartContainer