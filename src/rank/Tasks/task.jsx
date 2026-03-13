import React, {useState, useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import '../rank.css';

export const Task = ({id, title, onChange, onDelete, onTypedChange}) => {
    const [showButton, setShowButton] = useState(false); 
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
            onTypedChange?.(true);
        }
    };

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(id);
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
                        onFocus={() => setShowButton(true)} 
                        onBlur={() => setShowButton(false)} 
                        type="text"
                        placeholder="item"
                        value={value}
                        onChange={handleInput}
                        onPointerDown={e => {
                            e.stopPropagation();
                        }}
                        onKeyDown={e => e.stopPropagation()}  /* allow space/arrow keys */
                        onKeyUp={e => e.stopPropagation()}
                    />
                </div>
                {showButton && ( <button className="item-btn" id="delete-btn" onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }} onPointerDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onClick={handleDelete}>
                    Delete Item
                </button> )}
            </li>
        </div>
    );
}
