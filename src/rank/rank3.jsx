import React from 'react';
import {DndContext, closestCorners, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import './rank.css';
import {Column} from './components/Column';
import '../styles/app.css';

export function Rank({ userName }) {
    const [tasks, setTasks] = React.useState([
        {id: 0, title: 'Item 1'},
        {id: 1, title: 'Item 2'},
        {id: 2, title: 'Item 3'},
        {id: 3, title: 'Item 4'},
        {id: 4, title: 'Item 5'},
    ]);

    const addTask = (newTask) => {
        setTasks([...tasks, {id: tasks.length + 1, title: newTask}]);
    };

    const updateTaskTitle = (id, newTitle) => {
        setTasks(tasks => tasks.map(t => t.id === id ? {...t, title: newTitle} : t));
    };

    const handleDragEnd = event => {
        const {active, over} = event;
        if (active.id === over.id) {
          return;
        }
        setTasks(tasks => {
          const originalPos = tasks.findIndex(task => task.id === active.id);
          const newPos = tasks.findIndex(task => task.id === over.id);
    
          return arrayMove(tasks, originalPos, newPos);
        })
      }

      const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
      );

    return (
        <div>
            <DndContext 
            sensors={sensors} 
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}>
            <div className="list-container">
                <Column tasks={tasks} onUpdateTask={updateTaskTitle} />
            </div>
            </DndContext>
        </div>
    )
}