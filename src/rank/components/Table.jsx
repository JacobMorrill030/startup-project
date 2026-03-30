import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {Bank} from '../Tasks/bank';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import '../rank.css';


// function StartDropZone({id}) {
//     const {isOver, setNodeRef} = useDroppable({id});

//     return (
//         <div
//             ref={setNodeRef}
//             className={isOver ? 'start-drop-zone over' : 'start-drop-zone'}
//             aria-hidden="true"
//         />
//     );
// }


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
    const {isOver: isBankOver, setNodeRef: setBankNodeRef} = useDroppable({id: 'bank'});

    return (
        <div>
            {/* <div className="table-container"> */}
                <table border="1" className="tier-list" cellPadding="30">
                    {cells.map(tier => (
                        <tr key={tier}>
                            <td className={`${tier.toLowerCase()}-tier`}>{tier}</td>
                            <Cell id={tier}>
                                <div className="tier-cell-items order-normal">
                                    {/* <StartDropZone id={`${tier}-start`} /> */}
                                    <SortableContext
                                        items={tasks.filter(t => t.location === tier).map(t => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {tasks.filter(t => t.location === tier).map(t => {
                                            return (
                                            <Bank
                                                key={t.id}
                                                id={t.id}
                                                title={t.title}
                                                onChange={onUpdateTask}
                                            />
                                            );
                                        })}
                                    </SortableContext>
                                </div>
                            </Cell>
                        </tr>
                    ))}
                </table>
            {/* </div> */}
            <br />
            <fieldset ref={setBankNodeRef} className={isBankOver ? 'item-bank over' : 'item-bank'}>
                <div>
                    <ul className="bank-list">
                        <SortableContext
                            items={tasks.filter(t => t.location === 'bank').map(task => task.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.filter(t => t.location === 'bank').map(task => (
                                <Bank
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    onChange={onUpdateTask}
                                />
                            ))}
                        </SortableContext>
                    </ul>
                </div>
            </fieldset>
        </div>
    );
}
