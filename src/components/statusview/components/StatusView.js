import React from "react";
import "../stylesheets/statusview.css";
import MultiStatusChartContainer from "./MultiStatusChartContainer";

const StatusView = () => {
  return (
    <div className="status-view">
      <MultiStatusChartContainer />
    </div>
  );
}

export default StatusView