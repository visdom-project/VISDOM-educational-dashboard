import React from "react";
import "../stylesheets/EKGview.css"
import EKGTab from "./EKGTab";
import 'bootstrap/dist/css/bootstrap.min.css';


const EKGView = (props) => {
  return (
    <div className="EKG-view">
      <EKGTab {...props}/>
    </div>
  );
}

export default EKGView