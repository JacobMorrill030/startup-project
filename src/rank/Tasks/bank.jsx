import React, {useState, useEffect} from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import '../rank.css';

export const Bank = ({id, title, onChange}) => {
    const {attributes, listeners, setNodeRef, 
        transform, transition} = useDraggable({id});

    const [value, setValue] = useState(title);

    // keep local input in sync if parent updates the title
    useEffect(() => {
        setValue(title);
    }, [title]);

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners}
            style={style}
            className="bank-container" 
            >
            <li id="bank-item" className="bank-item">
                <div className="input-container">
                    <input
                        type="text"
                        readOnly
                        value={value}
                    />
                </div>
            </li>
        </div>
    );
}
