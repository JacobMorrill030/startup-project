import React from 'react';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Bank} from '../Tasks/bank';
import '../rank.css';

export const Table = ({tasks, onUpdateTask}) => {
return (
    <div>
        <div className="table-container">
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
                    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => {
                            return (
                                <Bank
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    onChange={onUpdateTask}
                                />
                            );
                        })}
                    </SortableContext>
                    {/* {items.map((item, index) => (
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
                    ))} */}
                </ul>
            </div>
        </fieldset>
    </div>    
);
}