import React, {useState, useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import '../rank.css';

export const Task = ({id, title, onChange}) => {
    const {attributes, listeners, setNodeRef, 
        transform, transition} = useSortable({id});

    const [value, setValue] = useState(title);

    // keep local input in sync if parent updates the title
    useEffect(() => {
        setValue(title);
    }, [title]);

    const handleInput = e => {
        const newVal = e.target.value;
        setValue(newVal);
        if (onChange) {
            onChange(id, newVal);
        }
    };

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
            <li className="ranked-item">
                <div className="input-container">
                    <div className="color-square"></div>
                    <input
                        type="text"
                        placeholder="item"
                        onChange={handleInput}
                        onPointerDown={e => e.stopPropagation()} /* prevent drag start when clicking input */
                        onKeyDown={e => e.stopPropagation()}  /* allow space/arrow keys */
                        onKeyUp={e => e.stopPropagation()}
                    />
                </div>
            </li>
        </div>
    );
}
