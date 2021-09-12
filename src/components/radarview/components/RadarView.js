import React from "react";
import "../stylesheets/radarview.css"
import EKGTab from "./EKGTab";
import 'bootstrap/dist/css/bootstrap.min.css';


const RadarView = () => {
  return (
    <div className="radar-view">
      <EKGTab />
    </div>
  );
}

export default RadarView