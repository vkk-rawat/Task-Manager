import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { STATUS_OPTIONS } from '../../utils/constants';
import { Badge } from '../ui/Badge';
import { TaskCard } from './TaskCard';

export const KanbanBoard = ({ tasks, canManage, onEdit, onDelete, onOpen, onStatusChange }) => {
  const grouped = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const task = tasks.find((item) => item._id === result.draggableId);
    const nextStatus = result.destination.droppableId;

    if (task && task.status !== nextStatus) {
      onStatusChange(task, nextStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-5">
        {STATUS_OPTIONS.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-80 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60 ${
                  snapshot.isDraggingOver ? 'ring-2 ring-emerald-300' : ''
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge value={status} />
                  <span className="text-xs font-medium text-slate-400">{grouped[status].length}</span>
                </div>
                <div className="space-y-3">
                  {grouped[status].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            canManage={canManage}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onOpen={onOpen}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
