/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import {
  FlexibleWidthXYPlot,
  LineSeries,
  AreaSeries,
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";
import { getCurveType, extractData } from "../helper/integratedData";

//helper 
const createTextPath = (refPath, text, horizontal=false) => {
    const element = document.querySelectorAll(`textPath[href='${refPath}']`);

    if (element.length){
        element[0].innerHTML = text;
        element[0].setAttribute("textLength", `${1.1*text.length}%`);
        return;
    }
    
    const newTextPath = document.createElementNS("http://www.w3.org/2000/svg","textPath");
    newTextPath.setAttribute("textLength", `${1.1*text.length}%`);
    newTextPath.setAttribute("startOffset", "10%");
    newTextPath.innerHTML = text;
    newTextPath.setAttribute("href", refPath);
    const newTextElement = document.createElement("text");
    if (horizontal){
        newTextElement.setAttribute("font-size", "0.5em");
        newTextPath.setAttribute("startOffset", "0");
        newTextPath.setAttribute("textLength", `${0.5*text.length}%`);
    }
    newTextElement.appendChild(newTextPath);
    return newTextElement;
}

const EXAMPLE_DATA = 
{
    index: 0,
    name: module.name,
    passed: 1, // true/false

    pointsToPass: 1,
    maxPoints: 1,

    notPassedPoints: 1,
    expectedNotPassPoints: 1,

    submission: 1,
    expectedSubmissions: 1,

    commit: 1,
    expectedCommit: 1,

    points: 1,
    expectedPoints: 1,

    numberOfExercises: 1,
    //new
    numberOfExercisesAttemped: 1,
    expectedExercises: 1,

    pointRatio: 1,
    expectedPointRatio: 1,

    notPassedRatio: 1,
    expectedNotPassRatio: 1,
};

const InstructionGraph = ({ configs }) => {
    console.log(configs);
    const tempConfigs = configs.map(config => config.direction ==="horizontal" ? config : ({...config, scaleFactor: parseInt(config.scaleFactor) === 1 ? 1 : 2}));
  const data = [EXAMPLE_DATA];
  const segments = extractData(data, tempConfigs, false);

  useEffect(() => {
    setTimeout(() => {
        const container = document.getElementById("instruction-graph");
    if (!container) {
        return;

    }
    const graph = container.firstChild.firstChild;
    const svg = graph.firstChild;
    const segments = svg.getElementsByTagName("path");
    const trimmedSegments = [].slice.call(segments).slice(1, -1);
    segments[segments.length-1].id = "";

    trimmedSegments.forEach((element, index) => {
        if (index >= configs.length) {
            return;
        }
        element.id = `Path${index}`;
        const newTextPath = createTextPath(`#Path${index}`, configs[index].type, configs[index].direction === "horizontal");
        if (newTextPath)
        {
            svg.appendChild(newTextPath);
        }
        // html properties
        [].slice.call(svg.getElementsByTagName("text")).forEach(element => {
            // eslint-disable-next-line no-self-assign
            element.outerHTML = element.outerHTML;
        });
    });
    }, 20);

});

//   const [hintTooltipValue, setHintTooltipValue] = useState(false);

//   const tickValues = [];
//   for (let i=displayedWeek[0]; i <= displayedWeek[1]; i++){
//       tickValues.push(i);
//   }

  return (
    <div id={"instruction-graph"} style={{height:'100%',width:'100%'}}>
        <FlexibleWidthXYPlot height={450} width={1000}>
            {/* <VerticalGridLines />
            <HorizontalGridLines /> */}
            {/* {compress ? <XAxis tickValues={tickValues}/> : null } */}
            {/* <YAxis /> */}
            {/* {hintTooltipValue && <Hint value={hintTooltipValue} /> } */}
            {
            segments.map( (segment, index) => {
                const Series = segment.colorFilled === "#ffffff" ? LineSeries : AreaSeries;
            //   const weekData = data[segment.index];
            //   const dataTooltip = {
            //     "Week": weekData.index + 1,
            //     "Pass status": JSON.stringify(weekData.passed),
            //     "Point to pass": weekData.pointsTopass,
            //     "Max points": weekData.maxPoints,
            //     "Number of submissions": weekData.submission,
            //     "Expected number of submissions": weekData.expectedSubmissions.toFixed(2),
            //     "Number of commits": weekData.commit,
            //     "Expected number of commit": weekData.expectedCommit.toFixed(2),
            //     "Points": weekData.points,
            //     "Expected points": weekData.expectedPoints.toFixed(2),
            //     "Missed points": weekData.notPassedPoints,
            //     "Number of exercises": weekData.numberOfExercises,
            //     "Number of attemped exercises": weekData.numberOfExercisesAttemped,
            //     "Expected number of exercises": weekData.expectedExercises.toFixed(2),
            //     "Points / maxpoints ratio": weekData.pointRatio.toFixed(2),
            //   };

                const segmentProps = {
                data: segment.data,
                color: segment.color,
                fill: segment.colorFilled === "#ffffff" ? null : segment.colorFilled,
                curve: getCurveType(segment.shape),
                dataType: segment.dataType ? segment.dataType : "",
                // onSeriesMouseOver: (e) => setHintTooltipValue({ ...dataTooltip, x: segment.index + 1, y: 0 }),
                // onSeriesMouseOver: () => setHintTooltipValue({ ...dataTooltip, x: segment.data[0].x + 1, y: 0 }),

                // onSeriesMouseOut: () => setHintTooltipValue(false),
            };
                return (<Series key={`segment-${index}`} {...segmentProps}/>);
            })
            }
            {/* {
                configs.map((element,index) => (
                    <text key={`text-${index}`}>
                        <textPath href={`#Path${index}`}>
                            {element.type}
                        </textPath>
                    </text>
                ))
            } */}
        </FlexibleWidthXYPlot>
    </div>
    
  );
};

export default InstructionGraph;