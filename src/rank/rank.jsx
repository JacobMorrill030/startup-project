import React, {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import {DndContext, closestCorners, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import './rank.css';
import {Column} from './components/Column';
import {Table} from './components/Table';
import '../styles/app.css';

const TASKS_STORAGE_KEY = 'rankTasks';

const DEFAULT_TASKS = [
    {id: 0, title: '', location: 'bank'},
];

const isValidTask = (task) => (
    task &&
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.location === 'string'
);

export function Rank({ userName }) {
    const [items, setItems] = React.useState(['']);
    // tasks represents the ordered (sortable) list
    // tasks now track where they live: "bank" or tier letters S,A,B,C,D
    const [tasks, setTasks] = React.useState(() => {
        const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!savedTasks) return DEFAULT_TASKS;

        try {
            const parsed = JSON.parse(savedTasks);
            if (Array.isArray(parsed) && parsed.every(isValidTask)) {
                return parsed;
            }
            return DEFAULT_TASKS;
        } catch {
            return DEFAULT_TASKS;
        }
    });

    function handleSave() {
        localStorage.clear();
    }

    const updateTaskTitle = (id, newTitle) => {
        setTasks(ts => ts.map(t => t.id === id ? {...t, title: newTitle} : t));
    };

    const deleteTask = (id) => {
        setTasks(ts => ts.filter(t => t.id !== id));
    };

    const [title, setTitle] = useState(() => localStorage.getItem("title") || "");

    // move a task to a specific location (bank or tier)
    const moveTask = (id, location) => {
        setTasks(ts => ts.map(t => t.id === id ? {...t, location} : t));
    };

    useEffect(() => {
        localStorage.setItem("title", title);
    }, [title]);

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const handleDragEnd = event => {
        const {active, over} = event;
        if (!over) return;

        // if dropped over a tier cell, update location
        const tierIds = ['S','A','B','C','D'];
        if (tierIds.includes(over.id)) {
            moveTask(active.id, over.id);
            return;
        }

        // otherwise we may be reordering within bank
        if (active.id === over.id) return;
        setTasks(ts => {
            const activeIndex = ts.findIndex(task => task.id === active.id);
            const overIndex = ts.findIndex(task => task.id === over.id);
            if (activeIndex === -1 || overIndex === -1) return ts;
            return arrayMove(ts, activeIndex, overIndex);
        })
    }

        const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
        );

    function addItem() {
        setTasks(ts => [...ts, {id: ts.length ? ts[ts.length-1].id + 1 : 0, title: '', location: 'bank'}]);
        setItems(it => [...it, '']);
    }

    function updateItem(index, value) {
        const updatedItems = [...items];
        updatedItems[index] = value;
        setItems(updatedItems);
    }

  return (
    <main className="main">
    <div className="rank-info">
        <div className="user-info">User: {userName}</div>
        <div className="title-group">
            <label>Title:</label><input id="title" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="save-share">
            <NavLink to="/saved" onClick={handleSave}>Save</NavLink> 
            <NavLink to="/share">Share</NavLink>
        </div>
    </div>
    <br />
    <div className="container">
        <div className="column1">
            <div className="list_button">
                <div>
                    <DndContext 
                    sensors={sensors} 
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}>
                    <div className="list-container">
                        <Column tasks={tasks} onUpdateTask={updateTaskTitle} onDeleteTask={deleteTask} />
                    </div>
                    </DndContext>
                </div>
                <div className="item-container">
                    <button className="item-btn" onClick={addItem}>+ Add Item</button>
                </div>
            </div>
            <div className="drop-down">
                <h3>Use Provided Rankings</h3>
                <div class="drop-down-container">
                    <select className="drop-down-box">
                        <option value="option1" selected>Superheroes</option>
                        <option value="option2" selected>Fast Food Restaurants</option>
                        <option value="option3" selected>Types of Chairs</option>
                        <option value="option4" selected>Dinosaurs</option>
                        <option value="option5" selected>Star Wars Characters</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="column2">
            <DndContext
                sensors={sensors} 
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}>
                <div className="column">
                    <Table tasks={tasks} onUpdateTask={updateTaskTitle} />
                </div>
            </DndContext>
           
        </div>
    </div>
</main>
  );
}