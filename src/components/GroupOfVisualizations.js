import React, { useEffect } from 'react';
import "../stylesheets/visualizationview.css"

import { Form, Container, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const GroupOfVisualizations = ({ views, viewkey }) => {
  const [visualizations, updateVisualizations] = React.useState(views);
  const [dragMode, setDragMode] = React.useState(false);
  const [label, setLabel] = React.useState(true);

  const handleOnDragEnd = event => {
    if (!event.destination) return;

    const items = Array.from(visualizations);
    const [reorderedItem] = items.splice(event.source.index, 1);
    items.splice(event.destination.index, 0, reorderedItem);

    updateVisualizations(items);
  }

  useEffect(() => {
    if (viewkey.length > 0) {
      updateVisualizations(views)
    }
  }, [viewkey]) 

  return (
    <>
    <Form 
      id="drap-drop-mode-switch"
      style={{ backgroundColor: dragMode ? "#d8f3dc" : "#e9ecef" }}
    >
      <Form.Check
        type="switch"
        label={label && "Drag and drop mode"}
        onClick={() => setDragMode(!dragMode)}
      />
      <Button
        id="drap-drop-mode-btn"
        style={{ backgroundColor: "inherit" }}
        onClick={e => {
          e.preventDefault();
          setLabel(!label)
        }}
      >
        {label ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </Button>
    </Form>
    <Container className="view-container">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="visualizations" isDropDisabled={!dragMode}>
          {provided => (
            <ul className="visualizations" {...provided.droppableProps} ref={provided.innerRef}>
              {visualizations.map((visua, index) => {
                return (
                  <Draggable key={visua.key} draggableId={visua.key} index={index} isDragDisabled={!dragMode}>
                    {provided => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className="visualizations-microfrontend">
                          {visua.microfrontend}
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
    </>
  )
}

export default GroupOfVisualizations
