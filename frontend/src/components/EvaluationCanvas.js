import React from 'react';
import useStore from '../store';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function EvaluationCanvas() {
  const { evaluationQuestions, setEvaluationQuestions } = useStore();

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(evaluationQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvaluationQuestions(items);
  };

  return (
    <div style={{ width: '45%', border: '1px solid #007bff', padding: '10px' }}>
      <h4>Mi Evaluación (Arrastra para ordenar)</h4>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="evaluation">
          {(provided) => (
            <ol {...provided.droppableProps} ref={provided.innerRef}>
              {evaluationQuestions.map((q, index) => (
                <Draggable key={index} draggableId={`q-${index}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ padding: '8px', border: '1px solid #ddd', marginBottom: '5px', background: 'white', ...provided.draggableProps.style }}
                    >
                      {q.Question}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default EvaluationCanvas;
