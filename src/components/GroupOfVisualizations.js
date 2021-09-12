import React from 'react';
import "../stylesheets/visualizationview.css"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GroupOfVisualizations = ({ views }) => {
  const [visualizations, updateVisualizations] = React.useState(views);

  const handleOnDragEnd = event => {
    if (!event.destination) return;

    const items = Array.from(visualizations);
    const [reorderedItem] = items.splice(event.source.index, 1);
    items.splice(event.destination.index, 0, reorderedItem);

    updateVisualizations(items);
  } 

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="visualizations">
        {provided => (
          <ul className="visualizations" {...provided.droppableProps} ref={provided.innerRef}>
            {visualizations.map((visua, index) => {
              return (
                <Draggable key={visua.key} draggableId={visua.key} index={index}>
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
  )
}

export default GroupOfVisualizations
