import React from 'react';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Task} from '../Tasks/task';
import '../rank.css';

export const Column = ({tasks, onUpdateTask, onDeleteTask, onTypedChange}) => {
    return (
        <div className="column">
            <div className="list-container">
                <ol className="ranked-list">
                    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => {
                            return (
                                <Task
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    onChange={onUpdateTask}
                                    onDelete={onDeleteTask}
                                    onTypedChange={onTypedChange}
                                />
                            );
                        })}
                    </SortableContext>
            </ol>
            </div>
        </div>
    );
};