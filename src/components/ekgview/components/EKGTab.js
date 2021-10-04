import React, { useState, useEffect } from "react";
import { useReferredState } from "../helper/hooks";

import {
  Form,
  Button,
  Table,
  Alert
} from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range";
import VisGraph from "./VisGraph";

import { getAllStudentsData, fetchStudentData } from "../services/studentData";
import { getConfigurationsList, getConfiguration, createConfig, modifyConfig } from "../services/configurationStoring";
import { useMessageDispatch, useMessageState } from "../../../contexts/messageContext";
// import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";

import { OPTIONS_MAP } from "../helper/constants";


// eslint-disable-next-line max-lines-per-function
const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  const setStudentInstance = (currentInstance) => {
    if (state.instances.length === 0) {
      dispatch({
        ...state,
        instances: [currentInstance],
      })
    };
    const index = state.instances.findIndex( instance => instance === currentInstance);
    if (index === -1) {
      const newInstances = [...state.instances];
      newInstances.splice(0, 0, currentInstance);
      dispatch({
        ...state,
        instances: newInstances,
      })
      return;
    }
    const newInstances = [...state.instances];
    newInstances[index] = state.instances[0];
    newInstances[0] = currentInstance;
    dispatch({
      ...state,
      instances: newInstances,
    })
    return;
  }
  const setTimescale = (timescale) => dispatch({...state, timescale: timescale});
  
  // const [client, setClient] = useState(null);

  const [studentList, setStudentList] = useState([]);

  const [configurationList, setConfigurationList] = useState([]);
  const [currentConfiguration, setCurrentConfiguration] = useState("");

  const [displayData, setDisplayData] = useState([]);
  const [maxlength, setMaxlength] = useState(0);
  
  const [expectedGrade, setExpectedGrade] = useState(1);

  const relativeTimescaleOptions = [true, false];
  const [relativeTimescale, setRelativeTimescale] = useReferredState(false);

  const DEFAULT_PULSE_RATIO = 1.5;
  const [pulseRatio, setPulseRatio] = useReferredState(DEFAULT_PULSE_RATIO);

  const [displayedWeek, setDisplayedWeek] = useState([1, 0]);

  const grades = [0, 1, 2, 3, 4, 5];

  const displayError = err => alert(err.response.data.error);

  const init = {
    type: "Points",
    value: "absolute",
    direction: "up",
    shape: "triangle",
    color: "#000000",
    colorFilled: "#ffffff",
    resetZero: "yes",
    scaleFactor: 1,
};
  const [configs, setConfigs] = useReferredState([init]);
  const [configName, setConfigName] = useReferredState("");

  useEffect(() => {
    getAllStudentsData().then(list => setStudentList(list));
    getConfigurationsList().then(list => setConfigurationList(list)).catch(displayError);
  }, []);

  useEffect(() => {
    if (!currentConfiguration.length) {
      return;
    }
    getConfiguration(currentConfiguration).then(data => {
      try {
        // eslint-disable-next-line no-unused-expressions
        data.config.configs && data.config.relativeTimescale !== undefined && data.config.pulseRatio;
        setConfigs(data.config.configs);
        setRelativeTimescale(data.config.relativeTimescale);
        setPulseRatio(data.config.pulseRatio);
      }
      catch (error) {
        alert("Something not right with the configuration");
      }
    })
  }, [currentConfiguration]); //eslint-disable-line

  useEffect(() => {
    if (!state.timescale) {
      if (maxlength !== 0) {
        setTimescale({
          start: 0,
          end: maxlength - 1,
        });
      }
      return;
    }

    if (state.timescale.end > maxlength - 1 && maxlength - 1 > 0){
      setTimescale({
        ...state.timescale,
        end: maxlength - 1,
      });
      return;      
    }
    setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7)]);
  }, [state.timescale, maxlength]); //eslint-disable-line

  useEffect(() => {
    if (state.instances.length){
      fetchStudentData(state.instances[0], expectedGrade)
        .then(data => {
          setDisplayData(data);
          setMaxlength(data.length * 7);
      });
    }
  }, [state.instances, expectedGrade]);

  return (
    <div className="container-body">
      <h2>EKG Visualization</h2>
        <DropdownMenu
          options={studentList}
          selectedOption={ state.instances[0] || ""}
          handleClick={setStudentInstance}
          title="Student ID:"
          selectAllOption={false}
        />

        <div className="config-board">
        <DropdownMenu
          options={configurationList}
          selectedOption={ currentConfiguration }
          handleClick={ config => {
            setCurrentConfiguration(config)
            setConfigName(config)
          }}
          title="Config name:"
          selectAllOption={false}
        />
          <ConfigDialog
          showButton={state.instances.length !== 0}
          title={{
            button: "Show view configuration",
            dialog: "Modify show configuration",
            confirm: "OK",
          }}>
            <DropdownMenu
              options={grades}
              selectedOption={expectedGrade}
              handleClick={ grade => setExpectedGrade(grade)}
              title="Select expected grade level"
              selectAllOption={false}
            />
            <DropdownMenu
              options={relativeTimescaleOptions.map(e => JSON.stringify(e))}
              selectedOption={JSON.stringify(relativeTimescale.current)}
              handleClick={ option => setRelativeTimescale(option === "true")}
              title="Select compress graph option"
              selectAllOption={false}
            />
            <div className="ratio-form">
              <Form.Label>Pulse ratio</Form.Label>
              <span>
                <Form.Control
                  type="number"
                  value={pulseRatio.current}
                  onChange={(event) => {
                    if (isNaN(parseFloat(event.target.value))){
                      return;
                    }
                    setPulseRatio(parseFloat(event.target.value));
                  }}
                  style={{ margin:  "10px", width: "30%", }}
                />
              </span>
            </div>
            <Form.Label>Configs:</Form.Label>
            <Table bordered>
              <thead>
                <tr>
                  {Object.keys(init).map(selection => <th key={JSON.stringify(selection)}>{selection}</th>)}
                  <th></th>
                </tr>
              </thead>

              <tbody>
              {configs.current.map((config, index) => (
                <tr key={`tr-${index}}`}>
                {Object.keys(config).map(selection => (
                  <td key={`td-${index}-${JSON.stringify(selection)}`}>
                    {selection.startsWith("scale")
                      ? <Form.Control
                          name={selection}
                          key={`form-${index}-${selection}`}
                          type="number"
                          value={parseFloat(config[selection])}
                          onChange={(event) => {
                            if (isNaN(parseFloat(event.target.value)))
                            {
                              return;
                            }
                            const newConfigs = [...configs.current];
                            newConfigs[index][event.target.name] = parseFloat(event.target.value);
                            setConfigs(newConfigs);
                          }}
                        />
                      : <select
                          name={selection}
                          value={config[selection]}
                          onChange={ (event) => {
                            const newConfigs = [...configs.current];
                            newConfigs[index][event.target.name] = event.target.value;
                            setConfigs(newConfigs);
                          }}
                          style={ selection.startsWith("color") ? { background: config[selection], color: "white" } : null}
                        >
                          {OPTIONS_MAP[selection].map(choosable => (
                            <option
                              key={choosable}
                              value={choosable}
                              style={ selection.startsWith("color") ? { background: choosable, color: "white" } : null}
                            >
                              {choosable}
                            </option>
                          ))}
                        </select>
                      }
                    </td>
                  ))}
                    <td>
                    <Button
                      variant="outline-danger"
                      size="md"
                      onClick={() => {
                        const newConfigs = [...configs.current];
                        newConfigs.splice(index, 1);
                        setConfigs(newConfigs);
                      }}
                    >
                      x
                    </Button>
                    </td>
                </tr>
              ))}
              </tbody>
            </Table>
            <Button
              variant="outline-success"
              size="lg"
              onClick={() => {
                const newConfigs = [...configs.current];
                newConfigs.push(init);
                setConfigs(newConfigs);
              }}
            >
              +
            </Button>
          </ConfigDialog>
        </div>
        <div className="storing-cofig-diaglog" style={{ padding: "5px 0 5px 0", display: "flex", justifyContent: "flex-end" }}>
          <ConfigDialog
            showButton={state.instances !== 0}
            title={{
              button: "Save",
              dialog: "Storing Configuration",
              confirm: "Cancel"
            }}
            additionalFooter={
              (currentConfiguration !== configName.current || currentConfiguration.length === 0) 
                ? <Button
                  size="md"
                  onClick={() => {
                    if (! configName.current.length){
                      return;
                    }
                    const publishConfiguration = {
                      configs: configs.current,
                      relativeTimescale: relativeTimescale.current,
                      pulseRatio: pulseRatio.current,
                    };
                    createConfig(configName.current, publishConfiguration).then(() => {
                      const newConfigurationList = [...configurationList];
                      newConfigurationList.push(configName.current);
                      setConfigurationList(newConfigurationList);
                      setConfigName(configName.current);
                    }).catch(displayError);
                  }}
                  >
                  Create new config
                </Button>
                : <Button
                  size="md"
                  onClick={() => {
                    if (!currentConfiguration.length){
                      return alert("Cant change configuration of unsaved configuration");
                    }
                    const publishConfiguration = {
                      configs: configs.current,
                      relativeTimescale: relativeTimescale.current,
                      pulseRatio: pulseRatio.current,
                    };
                    modifyConfig(currentConfiguration, publishConfiguration).catch(displayError);
                  }}
                  >
                  Modify this config
                </Button>
            }
          >
            {currentConfiguration.length > 0 &&
              <Alert variant="light">
                Current: {currentConfiguration}
              </Alert>
            }
            {currentConfiguration === configName.current && currentConfiguration.length > 0 &&
              <Alert variant="warning">
                The configuration <strong>{currentConfiguration}</strong> will be overwritten with current configuration properties!
              </Alert> 
            }
            <Form.Control
              type="text"
              value={configName.current}
              onChange={(event) => setConfigName(event.target.value)}
              style={{ margin:  "10px", width: "80%", }}
            />
          </ConfigDialog>
        </div>
        
        {
          state.instances[0] && maxlength !== 0 &&
          <>
            <div>
              <VisGraph 
                data={displayData} 
                configs={configs.current} 
                displayedWeek={displayedWeek} 
                compress={relativeTimescale.current} 
                pulseRatio={pulseRatio.current} />
            </div>
            <div className="timescale-slider">
              <Form.Label id="range-slider">
                Week range
              </Form.Label>
              <TwoThumbInputRange
                values={displayedWeek}
                min={1}
                max={Math.ceil(maxlength / 7) }
                style={{ padding: "10px 0 10px 0" }}
                onChange={(newValue) => {
                  setDisplayedWeek(newValue.sort((a, b) => a-b));
                  setTimescale({
                    start: (newValue[0] - 1) * 7,
                    end: (newValue[1]) * 7 - 1
                  })
                }}
              />
            </div>
          </>
        }
    </div>
  );
};


export default EKGTab;
