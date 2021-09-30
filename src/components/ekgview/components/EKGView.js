import React from "react";
import "../stylesheets/EKGview.css"
import EKGTab from "./EKGTab";
import 'bootstrap/dist/css/bootstrap.min.css';


const EKGView = () => {
  return (
    <div className="EKG-view">
      <EKGTab />
    </div>
  );
}

export default EKGView