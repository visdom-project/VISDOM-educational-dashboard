import { Accordion, Card, Button, useAccordionButton } from "react-bootstrap";
import DropdownMenu from "./DropdownMenu";
import CheckBoxMenu from "./CheckBoxMenu";

const CustomToggleAccordion = ({ children, eventKey, sortConfig, setSortConfig }) => {
  const decoratedOnClick = useAccordionButton(eventKey, () => 
    Object.keys(sortConfig).length === 0 && setSortConfig({    
      mode: "points",
      pointMode: "gain points",
      exerciseMode: "complete",
      week: "1",
      order: "ascending"
    })
  );

  return (
    <Button
      variant="outline-primary"
      onClick={decoratedOnClick}
      style={{ 
        height: "fit-content", 
        alignSelf: "center", 
        minWidth: "5em"
      }}
    >
      {children}
    </Button>
  )
}

const Controls = ({
  handleModeClick,
  modes,
  selectedMode,
  showableLines,
  handleToggleRefLineVisibilityClick,
  showAvg,
  showExpected,
  handleWeekClick,
  weeks,
  selectedWeek,
}) => {
  if (selectedMode === "submissions" || selectedMode === "commits") {
    return (
      <div className="fit-row">
        <DropdownMenu
          handleClick={handleModeClick}
          options={modes}
          selectedOption={selectedMode}
          title={"Mode:"}
        />
        <DropdownMenu
          handleClick={handleWeekClick}
          options={weeks}
          selectedOption={selectedWeek}
          title={"Week:"}
        />
        <button
          id={"showGradesButton"}
          onClick={() => console.log("TODO: Show grades")}
        >
          Show grades
        </button>
      </div>
    );
  }

  return (
    <div className="fit-row">
      <CheckBoxMenu
        options={showableLines}
        handleClick={handleToggleRefLineVisibilityClick}
        showAvg={showAvg}
        showExpected={showExpected}
      />
      <DropdownMenu
        handleClick={handleModeClick}
        options={modes}
        selectedOption={selectedMode}
        title={"Mode:"}
      />
      <DropdownMenu
        handleClick={handleWeekClick}
        options={weeks}
        selectedOption={selectedWeek}
        title={"Week:"}
      />
      <button
        id={"showGradesButton"}
        onClick={() => console.log("TODO: Show grades")}
      >
        Show grades
      </button>
    </div>
  );
};

const SortControl = ({ 
  sortConfig,
  setSortConfig,
  modes,
  weeks
}) => {
  const sortObject = (action, options, selectedOption, title) => (
    {action, options, selectedOption, title}
  );

  const SORT_PROPERTIES = [
    sortObject(option => option !== sortConfig.mode && setSortConfig({...sortConfig, mode: option}), modes, sortConfig.mode, "Sort mode: "),
    sortConfig.mode === "points" && 
      sortObject(option =>  option !== sortConfig.pointMode && setSortConfig({...sortConfig, pointMode: option}), ["gain points", "miss points"], sortConfig.pointMode, "Mode: "),
    sortConfig.mode === "exercises" && 
      sortObject(option => option !== sortConfig.exerciseMode && setSortConfig({...sortConfig, exerciseMode: option}), ["complete", "miss"], sortConfig.exerciseMode, "Mode: "),
    sortObject(option => option !== sortConfig.week && setSortConfig({...sortConfig, week: option}), weeks, sortConfig.week, "Week: "),
    sortObject(option => option !== sortConfig.order && setSortConfig({...sortConfig, order: option}), ["ascending", "descending"], sortConfig.order, "Order: ")
  ];
  return(
    <div className="fit-row">
      {SORT_PROPERTIES.map((config, i) => config && <DropdownMenu
        key={config.title + i}
        handleClick={config.action}
        options={config.options}
        selectedOption={config.selectedOption}
        title={config.title}
      />)}
    </div>
  )
}

const ControlAccordion = ({
  handleModeClick,
  modes,
  selectedMode,
  showableLines,
  handleToggleRefLineVisibilityClick,
  showAvg,
  showExpected,
  handleWeekClick,
  weeks,
  selectedWeek,
  sortConfig,
  setSortConfig
}) => {
  return (
    <Accordion flush>
      <Card style={{ border: "none" }}>
        <Card.Header style={{ backgroundColor: "white" }}>
          <div className="fit-row">
            <Controls
              handleModeClick={handleModeClick}
              modes={modes}
              selectedMode={selectedMode}
              showableLines={showableLines}
              handleToggleRefLineVisibilityClick={
                handleToggleRefLineVisibilityClick
              }
              showAvg={showAvg}
              showExpected={showExpected}
              handleWeekClick={handleWeekClick}
              weeks={weeks}
              selectedWeek={selectedWeek}
            />
            <CustomToggleAccordion 
              eventKey="0" 
              setSortConfig={setSortConfig}
              sortConfig={sortConfig}
            >
              Sort
            </CustomToggleAccordion>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <SortControl
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              modes={modes}
              weeks={weeks}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export default ControlAccordion
