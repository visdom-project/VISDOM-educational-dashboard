/* eslint-disable react/prop-types */
import React from "react";
import { RadarChart } from "react-vis";

import "../../../../node_modules/react-vis/dist/style.css";
import { getPropertiesDomain } from "../helper/integratedData";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const VisGraph = ({ data, configs, displayedWeek }) => {
  const domainProperties = getPropertiesDomain(data);

  const weekIndices = [];
  for (let i=displayedWeek[0]; i <= displayedWeek[1]; i++){
    weekIndices.push(i);
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data.length > 0 && weekIndices.map((index) => {
            const weekData = data[index - 1]; //different in starting index
            const dataRadarChart = {
                "Attemped exercises": weekData.numberOfExercisesAttemped,
                "NO submissions": weekData.submission,
                "NO commits": weekData.commit,
                "Points": weekData.points,
                "p/maxp ratio": weekData.pointRatio,
            };
            const radarChartDomain = {
                ...domainProperties,
                "Attemped exercises": [0, weekData.numberOfExercises],
                "Points": [0, weekData.maxPoints],
            };

            return (
              <div key={`radarchart-index-${index}`}>
                <div style={{ border: "1px darkgrey solid" }}>
                  <h1 style={{ textAlign: "center" }}>Week {index}</h1>
                  {
                    Object.entries(radarChartDomain).length !== 0 &&
                    <RadarChart
                    data={[configs.reduce( (obj, key) => {obj[key] = dataRadarChart[key]; return obj;}, {})]}
                    domains={configs.map( key => ({ name: key, domain: radarChartDomain[key] }))}
                    height={300}
                    width={300}
                    margin={{ left: 80, right: 80, top: 50, bottom: 20 }}
                    />
                  }
                  {
                    weekData.passed ?
                    <AiOutlineCheck 
                        style={{ 
                            position: "relative", 
                            width: "10%", 
                            height: "10%", 
                            left: "100%",
                            color: "green", 
                            transform: "translate(-200%, 0)" }} 
                    /> :
                    <AiOutlineClose 
                        style={{ 
                            position: "relative", 
                            width: "10%", 
                            height: "10%",
                            left: "250px", 
                            color: "red",
                            transform: "translate(-200%, 0)" }} 
                    />
                  }
                </div>
            </div>
          );
        })}
    </div>
  );
};

export default VisGraph;