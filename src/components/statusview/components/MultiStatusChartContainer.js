import React, { useEffect, useState } from "react";

import DropdownMenu from "./DropdownMenu";
import StatusTab from "./StatusTab";

import { Alert, Form, Button } from "react-bootstrap";
import { IoGridSharp, IoListOutline } from "react-icons/io5";

import {
  useMessageState,
  useMessageDispatch,
} from "../../../contexts/messageContext";

const MAX_GRAPH = 4;

const MultiStatusChartContainer = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  const [graphNum, setGraphNum] = useState(Object.keys(state.statusProps.props).length || 1);
  const [sameSortProps, setSameSortProps] = useState(true);
  const [sortProps, setSortProps] = useState({});

  const listView =  {
    margin: " 0 calc(70px + 3vw) 5vw calc(70px + 3vw)",
  }

  const blockView = {
    margin: " 0 calc(70px + 3vw) 5vw calc(70px + 3vw)",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "wrap"
  };

  const handleDisplayBtnClick = () => {
    dispatch({
      ...state,
      statusProps: {
        ...state.statusProps,
        displayMode: state.statusProps.displayMode === "list" ? "grid" : "list"
      }
    });
  };
  

  useEffect(() => {
    if (graphNum === 1) {
      dispatch({
        ...state,
        statusProps: {
          ...state.statusProps,
          displayMode: "list"
        }
      });
    };
  }, [graphNum])

  return (
    <div className="multi-status-graph-container">
      <div className="multi-status-graph-info" style={{ margin: "calc(70px + 2vw) calc(70px + 5vw) 0 calc(70px + 5vw)" }}>
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
          onClick={() => graphNum === 1 ? setSameSortProps("list") : setSameSortProps(!sameSortProps)}
          defaultChecked
          style={{ margin: "20px" }}
        />}
        {graphNum > 1 && <Alert variant="warning">
          <i>Only <strong>first</strong> chart configuration allows synchronization with other visualizations!</i>
        </Alert>}
        {graphNum > 1 && <Button id="display-btn" onClick={handleDisplayBtnClick}>
          {state.statusProps.displayMode === "list" ? <IoListOutline /> : <IoGridSharp />}
        </Button>}
      </div>
      <div id="multistatus" style={ state.statusProps.displayMode === "list" ? listView : blockView}>
      {Array(graphNum)
        .fill(0)
        .map((_, item) => <div className="status-chart" key={`status-chart-${item}-container`} style={{ width: state.statusProps.displayMode === "list" ? "95%" : "50%" }}>
          <StatusTab 
            key={`status-chart-${item}`}
            graphIndex={item}
            sortProps={sortProps} 
            setSortProps={setSortProps}
            sameSortProps={sameSortProps}
          />
        </div>)
      }
      </div>
    </div>
  )
}

export default MultiStatusChartContainer