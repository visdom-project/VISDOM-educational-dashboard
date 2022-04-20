/* eslint-disable react/prop-types */
import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Bar,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import "../stylesheets/studentbar.css";
import TresholdSelector from "./TresholdSelector";

const CustomLabel = (props) => {
  return (
    <text
      style={{ textAnchor: "end" }}
      x={props.viewBox.x + props.chartWidth - 80}
      y={props.viewBox.y}
      fill={props.color}
      dy={"0.4em"}
      fontSize={12}
      textAnchor="left"
    >
      {props.title}
    </text>
  );
};

const StudentTooltip = ({ active, payload, label, mode }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: "#FFF", padding: "3px", border: "1px solid rgba(0, 0, 0, .5)" }}>
        {label} <br/>
        {
          (mode === "submissions" || mode === "commit_counts") &&
            <ul style={{ listStyle: "none" }}>
              {
                payload.reverse().map(data => {
                  const index = parseInt(data.dataKey.split("-")[1]) - 1;
                  return (
                    <li key={`${mode}-${data.payload.username}-${data.dataKey}`}>
                      {data.dataKey}: {mode === "submissions" ? data.payload.submissions[index] : data.payload.commit_counts[index]}
                    </li>
                  )
                })
              }
            </ul>
        }
      </div>
    );
  }

  return null;
}
/** Chooses a fitting color code for given exercise and student.
 *
 * For commit data:
 *   - white for exercises with 0 commits
 *   - lightblue for exercises with commits in it, shade by commit count.
 *
 * For submission data:
 *
 *   Green for passed exercises;
 *     - Light green for completing the task with at most 5 submissions,
 *     - darker green for exceeding 5 submissions.
 *
 *   White or red for uncompleted exercises;
 *     - White if student has not submitted anything,
 *     - red if the exercise is uncompleted in spite of submitting answers.
 */
const selectColor = (data, index, key) => {
  if (key === "commit_counts") {
    return data.passed[index]
      ? data.commit_counts[index] < 1
        ? "white"
        : data.commit_counts[index] < 3
        ? "lightblue"
        : data.commit_counts[index] < 6
        ? "#89cee4"
        : data.commit_counts[index] < 9
        ? "#509ab3"
        : data.commit_counts[index] < 15
        ? "#286482"
        : "#1e4a61"
      : data.commit_counts[index] < 1
      ? "white"
      : "#e65a67";
  }

  return data.passed[index]
    ? data.submissions[index] > 5
      ? "green"
      : "#62ce4b"
    : data.submissions[index] < 1
    ? "white"
    : "#e65a67";
};

const MyRefLine = () => {
  const bars = document.getElementsByClassName("recharts-cartesian-grid");
  const newHeight =
    bars.length > 0 ? bars[0].getBoundingClientRect().height + 10 : 0;
  const newBottom = bars.length > 0 ? -(newHeight + 50) : "109px";

  if (newHeight < 1) {
    return <></>;
  }

  return (
    <div
      style={{
        width: "3px",
        height: newHeight,
        position: "absolute",
        marginLeft: "0px",
        backgroundColor: "#4a76ff",
        marginTop: newBottom,
        display: "None",
      }}
      id="treshold-line"
    ></div>
  );
};

// eslint-disable-next-line max-lines-per-function
const MultiChart = (props) => {
  const {
    chartWidth,
    chartHeight,
    data,
    commonData,
    axisNames,
    dataKeys,
    commonKeys,
    max,
    handleClick,
    visuMode,
    countData,
    studentsBelowTreshold,
    updateTreshold,
    treshold,
  } = props;

  const tickCount = 10;
  const ticks = Object.keys(new Array(tickCount).fill(0)).map((key) =>
    Math.floor((key * max) / tickCount)
  );
  ticks.push(max);

  const averageColor = "black";
  const mediumExpectedColor = "#000073";
  const minimumExpectedColor = "#000073";

  const barWidth = 6;
  const margins = { top: 10, right: 20, left: 20, bottom: 25 };

  if (data === undefined || commonData === undefined) {
    // eslint-disable-next-line no-console
    console.log(
      "Either student data or common student data is undefined. Data:",
      data,
      "common data:",
      commonData
    );
    return <div className="intended">No data to display.</div>;
  }

  if (["submissions", "commits"].includes(visuMode)) {
    let submissionMapping = [];
    let submissionTicks = [];
    let key = visuMode === "submissions" ? "submissions" : "commit_counts";
    const alphabets = "abcdefghijklmnopqrstuvwxyz";
    if (countData !== undefined && countData.length > 0) {
      let i = 0;
      // eslint-disable-next-line no-unused-vars
      submissionMapping = !countData[0][key] ? [] : countData[0][key].map(() => {
        i += 1;
        submissionTicks.push(i);
        return { key: "exercise-".concat(i), stackId: alphabets[i - 1] };
      });
    }

    // console.log("countdata", countData)

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ResponsiveContainer minWidth="800px" minHeight="500px">
          <ComposedChart
            width={chartWidth}
            height={chartHeight}
            data={countData}
            margin={margins}
            barGap={-barWidth}
          >
            <XAxis
              dataKey="id"
              tick={false}
              padding={{ left: 0, right: 0 }}
              label={{ value: axisNames[0], position: "bottom" }}
            />
            <YAxis
              label={{
                value: axisNames[1],
                angle: -90,
                position: "left",
                offset: -21,
              }}
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={submissionTicks}
            />
            <Tooltip content={<StudentTooltip mode={key} />}/>

            {submissionMapping.map((bar) => (
              <Bar
                className="hoverable-bar"
                key={bar.key}
                dataKey={bar.key}
                stackId="a"
                fill="#c1ff9e69"
                stroke="#00000045"
                barSize={barWidth*2}
              >
                {countData !== undefined
                  ? countData.map((entry, index) => {
                      const name = `cell-${bar.stackId}-${index}`;
                      return (
                        <Cell
                          key={name}
                          onClick={() => handleClick(entry, index)}
                          fill={selectColor(
                            entry,
                            alphabets.indexOf(bar.stackId),
                            key
                          )}
                        />
                      );
                    })
                  : ""}
              </Bar>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            paddingLeft: "99px",
            pointerEvents: "none",
          }}
        >
          <table
            style={{
              fontSize: `${barWidth - 2}px`,
              textAlign: "center",
              borderSpacing: "0px",
              paddingTop: "1em",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <tbody>
              {
                // Draws a table on top of visu bars to display submission counts

                submissionMapping.map((item) => {
                  const i = alphabets.indexOf(item.stackId);

                  /** Math magic to calculate close enough spacing for table
                   * elements that show submission counts for each exercise: */
                  const totalWidth = chartWidth * 0.89;
                  const barCount = countData.length;
                  const barsWidth = barCount * barWidth;
                  const totalWidthAfterBars = totalWidth - barsWidth;
                  const paddingWidth = Math.floor(
                    totalWidthAfterBars / barCount
                  );
                  const leftovers =
                    totalWidthAfterBars - barCount * paddingWidth;
                  const additionalPadding = Math.round(barCount / leftovers);
                  const additionalLeftovers =
                    Math.floor(leftovers - barCount / additionalPadding) - 2;

                  const totalHeight = chartHeight * 0.86;
                  const cellHeight = totalHeight / submissionMapping.length;

                  // Create the table content:
                  let counter = 1;
                  return (
                    <tr key={item.stackId}>
                      {countData.map((student) => {
                        // Divide spacing evenly between table columns:
                        let pad = paddingWidth;
                        pad = counter % additionalPadding === 0 ? pad + 1 : pad;
                        pad =
                          counter % additionalLeftovers === 0 ? pad + 1 : pad;
                        counter += 1;

                        const style = {
                          width: `${barWidth}px`,
                          paddingLeft: `${pad}px`,
                          paddingRight: "0px",
                          height: `${cellHeight}px`,
                        };

                        // Make the font size smaller if a submission count has more than 1 digit:
                        if (student[key[i]] > 9) {
                          style.fontSize = `${barWidth - 2}px`;
                        }

                        return (
                          <td style={style} key={student.id}>
                            {student[key][i]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const mapping = [
    {
      key: dataKeys["max"],
      color: "white",
      stroke: "darkgrey",
    },
    {
      key: dataKeys["week"],
      color: "#4cce4c",
      stroke: "#4cce4c",
    },
    {
      key: dataKeys["totalPoints"],
      color: "green",
      stroke: "green",
    },
    {
      key: dataKeys["missed"],
      color: "red",
      stroke: "red",
    },
  ];

  return (
    <div className="intendedChart">
      <ResponsiveContainer minWidth="800px" minHeight="500px">
        <ComposedChart
          width={chartWidth}
          height={chartHeight}
          data={data}
          margin={margins}
          barGap={-barWidth}
        >
          <XAxis
            dataKey="username"
            tick={false}
            padding={{ left: 0, right: 0 }}
            label={{ value: axisNames[0], position: "bottom" }}
          />
          <YAxis
            label={{
              value: axisNames[1],
              angle: -90,
              position: "left",
              offset: -21,
            }}
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
          />

          <Tooltip content={<StudentTooltip />} />

          <Area
            type="monotone"
            dataKey={dataKeys.totalPoints}
            fill="#c3c3c3"
            stroke="#c3c3c3"
          />

          {mapping.map((bar) => (
            <Bar
              className={"hoverable-bar"}
              key={bar.key}
              dataKey={bar.key}
              barSize={barWidth}
              fill={bar.color}
              stroke={bar.stroke}
            >
              {data !== undefined
                ? data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      onClick={() => handleClick(entry, index)}
                    />
                  ))
                : ""}
            </Bar>
          ))}

          <CartesianGrid stroke="#808e9625" vertical={false} />

          <ReferenceLine
            y={commonData[commonKeys.average]}
            stroke={averageColor}
            label={
              <CustomLabel
                title="Avg"
                color={averageColor}
                pos={"above"}
                chartWidth={chartWidth}
              />
            }
            strokeDasharray="2 4"
          />

          <ReferenceLine
            y={commonData[commonKeys.expectedMedium]}
            stroke={mediumExpectedColor}
            label={
              <CustomLabel
                title={"Mid"}
                color={mediumExpectedColor}
                pos={"above"}
                chartWidth={chartWidth}
              />
            }
            strokeDasharray="3 3"
          />

          <ReferenceLine
            y={commonData[commonKeys.expectedMinimum]}
            stroke={minimumExpectedColor}
            label={
              <CustomLabel
                title={"Min"}
                color={minimumExpectedColor}
                pos={"below"}
                chartWidth={chartWidth}
              />
            }
            strokeDasharray="3 3"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <MyRefLine />

      <TresholdSelector
        handleTresholdChange={updateTreshold}
        chartWidth={chartWidth}
        treshold={treshold}
        title="Select treshold for lagging students"
        tresholdCount={studentsBelowTreshold}
      />
    </div>
  );
};

export default MultiChart;
