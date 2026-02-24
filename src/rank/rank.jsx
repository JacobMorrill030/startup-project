import React from 'react';
import { NavLink } from 'react-router-dom';
import {DndContext, closestCorners, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import './rank.css';
import {Column} from './components/Column';
import {Table} from './components/Table';
import '../styles/app.css';

export function Rank({ userName }) {
    const [items, setItems] = React.useState(['']);
    // tasks represents the ordered (sortable) list
    const [tasks, setTasks] = React.useState([
            {id: 0, title: 'Item 1'},
    ]);

    const updateTaskTitle = (id, newTitle) => {
        setTasks(ts => ts.map(t => t.id === id ? {...t, title: newTitle} : t));
    };

    const handleDragEnd = event => {
        const {active, over} = event;
        if (active.id === over.id) {
            return;
        }
        setTasks(ts => {
            const originalPos = ts.findIndex(task => task.id === active.id);
            const newPos = ts.findIndex(task => task.id === over.id);
    
            return arrayMove(ts, originalPos, newPos);
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
        setTasks(ts => [...ts, {id: ts.length ? ts[ts.length-1].id + 1 : 0, title: ''}]);
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
            <label>Title:</label><input id="title" placeholder="title" />
        </div>
        <div className="save-share">
            <NavLink to="/saved">Save</NavLink> 
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
                        <Column tasks={tasks} onUpdateTask={updateTaskTitle} />
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
            {/* <div className="table-container">
                <table border="1" className="tier-list" cellpadding="30">
                    <tr>
                        <td className="s-tier">S</td>
                        <td className="t-row"></td>
                    </tr>
                    <tr>
                        <td className="a-tier">A</td>
                        <td className="t-row"></td>
                    </tr>
                    <tr>
                        <td className="b-tier">B</td>
                        <td className="t-row"></td>
                    </tr>
                    <tr>
                        <td className="c-tier">C</td>
                        <td className="t-row"></td>
                    </tr>
                    <tr>
                        <td className="d-tier">D</td>
                        <td className="t-row"></td>
                    </tr>
                </table>
            </div>
            <br />
            <fieldset className="item-bank">
                <div>
                    <ul className="bank-list">
                        {items.map((item, index) => (
                          <div key={index} className="bank-container">
                            <li>
                              <input
                                id='bank-item'
                                className="list-item"
                                type="text"
                                placeholder="item"
                                value={item}
                                readonly
                              />
                            </li>
                          </div>
                        ))}
                    </ul>
                </div>
            </fieldset> */}
        </div>
    </div>
</main>
  );
}

// <div
//   key={index}
//   className="bank-container"
//   draggable
//   onDragStart={e => handleDragStart(e, index)}
//   onDragOver={e => handleDragOver(e, index)}
//   onDrop={e => handleDrop(e, index)}
// >
//   <li className={draggedIndex === index ? 'dragging' : ''}>
//     <input
//       className="list-item"
//       type="text"
//       placeholder="item"
//       value={item}
//       draggable={false}
//       onChange={e => updateItem(index, e.target.value)}
//     />
//   </li>
// </div>