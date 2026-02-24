import React, {useState, useEffect} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import '../rank.css';

export const Bank = ({id, title, onChange}) => {
    const {attributes, listeners, setNodeRef, 
        transform, transition} = useSortable({id});

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
                        readonly
                        value={value}
                    />
                </div>
            </li>
        </div>
    );
}
