import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {Bank} from '../Tasks/bank';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import '../rank.css';

const DEFAULT_TIER_COLORS = {
    S: 'red',
    A: 'orange',
    B: 'yellow',
    C: 'rgb(30, 210, 30)',
    D: 'rgb(59, 59, 233)',
};

// helper cell component with droppable hook
function Cell({id, children}) {
    const {isOver, setNodeRef} = useDroppable({id});
    return (
        <td ref={setNodeRef} className={isOver ? 't-row over' : 't-row'}>
            {children}
        </td>
    );
}

export const Table = ({tasks, onUpdateTask, tierColors, onUpdateTierColor}) => {
    // tasks array contains location property
    const cells = ['S', 'A', 'B', 'C', 'D'];
    const {isOver: isBankOver, setNodeRef: setBankNodeRef} = useDroppable({id: 'bank'});
    const colorInputRefs = React.useRef({});

    const handleTierClick = (tier) => {
        if (colorInputRefs.current[tier]) {
            colorInputRefs.current[tier].click();
        }
    };

    return (
        <div>
            <table border="1" className="tier-list" cellPadding="30">
                {cells.map(tier => (
                    <tr key={tier}>
                        <td
                            style={{ backgroundColor: tierColors[tier] || DEFAULT_TIER_COLORS[tier], cursor: 'pointer' }}
                            onClick={() => handleTierClick(tier)}
                        >
                            {tier}
                            <input
                                ref={(el) => colorInputRefs.current[tier] = el}
                                type="color"
                                value={tierColors[tier] || DEFAULT_TIER_COLORS[tier]}
                                onChange={(e) => onUpdateTierColor(tier, e.target.value)}
                                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}/>
                        </td>
                        <Cell id={tier}>
                            <div className="tier-cell-items order-normal">
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
