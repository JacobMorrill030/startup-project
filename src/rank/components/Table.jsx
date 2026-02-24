import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {Bank} from '../Tasks/bank';
import '../rank.css';


// helper cell component with droppable hook
function Cell({id, children}) {
    const {isOver, setNodeRef} = useDroppable({id});
    return (
        <td ref={setNodeRef} className={isOver ? 't-row over' : 't-row'}>
            {children}
        </td>
    );
}

export const Table = ({tasks, onUpdateTask}) => {
    // tasks array contains location property
    const cells = ['S','A','B','C','D'];

    return (
        <div>
            <div className="table-container">
                <table border="1" className="tier-list" cellPadding="30">
                    {cells.map(tier => (
                        <tr key={tier}>
                            <td className={`${tier.toLowerCase()}-tier`}>{tier}</td>
                            <Cell id={tier}>
                                {tasks.filter(t => t.location === tier).map(t => (
                                    <Bank
                                        key={t.id}
                                        id={t.id}
                                        title={t.title}
                                        onChange={onUpdateTask}
                                    />
                                ))}
                            </Cell>
                        </tr>
                    ))}
                </table>
            </div>
            <br />
            <fieldset className="item-bank">
                <div>
                    <ul className="bank-list">
                        {tasks.filter(t => t.location === 'bank').map(task => (
                            <Bank
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                onChange={onUpdateTask}
                            />
                        ))}
                    </ul>
                </div>
            </fieldset>
        </div>
    );
}
