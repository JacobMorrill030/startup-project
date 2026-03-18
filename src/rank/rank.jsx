import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {DndContext, closestCorners, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import './rank.css';
import {Column} from './components/Column';
import {Table} from './components/Table';
import '../styles/app.css';


const TASKS_STORAGE_KEY = 'rankTasks';
const SAVED_RANKINGS_STORAGE_KEY = 'savedRankings';
const RANDOM_WORDS_ENDPOINT = "https://random-word-api.herokuapp.com/word?number=10";

const DEFAULT_TASKS = [
    {id: 0, title: '', location: 'bank'},
];

const starWarsCharacters = [
    {id: 0, title: 'Luke Skywalker', location: 'bank'},
    {id: 1, title: 'Darth Vader', location: 'bank'},
    {id: 2, title: 'Leia Organa', location: 'bank'},
    {id: 3, title: 'Han Solo', location: 'bank'},
    {id: 4, title: 'Yoda', location: 'bank'},
    {id: 5, title: 'Obi-Wan Kenobi', location: 'bank'},
    {id: 6, title: 'Chewbacca', location: 'bank'},
    {id: 7, title: 'R2-D2', location: 'bank'},
    {id: 8, title: 'C-3PO', location: 'bank'},
];

const superheroes = [
    {id: 0, title: 'Spider-Man', location: 'bank'},
    {id: 1, title: 'Batman', location: 'bank'},
    {id: 2, title: 'Wonder Woman', location: 'bank'},
    {id: 3, title: 'Superman', location: 'bank'},
    {id: 4, title: 'Iron Man', location: 'bank'},
    {id: 5, title: 'Black Panther', location: 'bank'},
    {id: 6, title: 'Captain America', location: 'bank'},
    {id: 7, title: 'Thor', location: 'bank'},
];

const fastFoodRestaurants = [
    {id: 0, title: 'McDonald\'s', location: 'bank'},
    {id: 1, title: 'Burger King', location: 'bank'},
    {id: 2, title: 'Wendy\'s', location: 'bank'},
    {id: 3, title: 'Taco Bell', location: 'bank'},
    {id: 4, title: 'KFC', location: 'bank'},
    {id: 5, title: 'Chick-fil-A', location: 'bank'},
    {id: 6, title: 'Subway', location: 'bank'},
    {id: 7, title: 'Popeyes', location: 'bank'},
    {id: 8, title: 'Chipotle', location: 'bank'},
    {id: 9, title: 'Five Guys', location: 'bank'},
];

const typesOfChairs = [
    {id: 0, title: 'Office Chair', location: 'bank'},
    {id: 1, title: 'Dining Chair', location: 'bank'},
    {id: 2, title: 'Recliner', location: 'bank'},
    {id: 3, title: 'Rocking Chair', location: 'bank'},
    {id: 4, title: 'Lounge Chair', location: 'bank'},
    {id: 5, title: 'Accent Chair', location: 'bank'},
    {id: 6, title: 'Folding Chair', location: 'bank'},
    {id: 7, title: 'Bar Stool', location: 'bank'},
    {id: 8, title: 'Armchair', location: 'bank'},
    {id: 9, title: 'Bean Bag Chair', location: 'bank'},
];

const dinosaurs = [
    {id: 0, title: 'Tyrannosaurus Rex', location: 'bank'},
    {id: 1, title: 'Triceratops', location: 'bank'},
    {id: 2, title: 'Velociraptor', location: 'bank'},
    {id: 3, title: 'Stegosaurus', location: 'bank'},
    {id: 4, title: 'Brachiosaurus', location: 'bank'},
    {id: 5, title: 'Spinosaurus', location: 'bank'},
    {id: 6, title: 'Ankylosaurus', location: 'bank'},
    {id: 7, title: 'Allosaurus', location: 'bank'},
    {id: 8, title: 'Pteranodon', location: 'bank'},
    {id: 9, title: 'Parasaurolophus', location: 'bank'},
];

const providedRankings = {
    option1: superheroes,
    option2: fastFoodRestaurants,
    option3: typesOfChairs,
    option4: dinosaurs,
    option5: starWarsCharacters,
};

const providedRankingTitles = {
    option1: 'Superheroes',
    option2: 'Fast Food Restaurants',
    option3: 'Types of Chairs',
    option4: 'Dinosaurs',
    starWarsCharacters: 'Star Wars Characters',
};

const isValidTask = (task) => (
    task &&
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.location === 'string'
);

export function Rank({ userName }) {
    const navigate = useNavigate();
    const [items, setItems] = React.useState(['']);
    const [selectedRanking, setSelectedRanking] = useState('');
    const [sorted, setSorted] = useState(false);
    const [typed, setTyped] = useState(false);
    const [wordsLoading, setWordsLoading] = useState(false);
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

    async function handleClear() {
        localStorage.removeItem(TASKS_STORAGE_KEY);
        localStorage.removeItem('title');
        setTasks(DEFAULT_TASKS.map(item => ({ ...item })));
        setTitle('');
        setSelectedRanking('');
        setSorted(false);
        setTyped(false);
    }

    async function handleSave() {
        const tiers = { S: [], A: [], B: [], C: [], D: [] };

        tasks.forEach((task) => {
            if (!task || typeof task.title !== 'string') return;
            const trimmedTitle = task.title.trim();
            if (!trimmedTitle) return;

            if (tiers[task.location]) {
                tiers[task.location].push(trimmedTitle);
            }
        });

        const orderedItems = [
            ...tiers.S,
            ...tiers.A,
            ...tiers.B,
            ...tiers.C,
            ...tiers.D,
        ];

        const rankingToSave = {
            id: `my-${Date.now()}`,
            from: userName || 'Unknown',
            title: title.trim() || 'Untitled Ranking',
            orderedItems,
            tiers,
            savedId: `my-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            savedAt: new Date().toISOString(),
        };

        const savedRaw = localStorage.getItem(SAVED_RANKINGS_STORAGE_KEY);

        if (savedRaw) {
            try {
                const parsed = JSON.parse(savedRaw);
                if (Array.isArray(parsed)) {
                    savedRankings = parsed;
                }
            } catch {
                savedRankings = [];
            }
        }

        const response = await fetch('/api/post/rankings', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(rankingToSave),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            return alert('Error saving ranking to server');
        } else {
            localStorage.removeItem(TASKS_STORAGE_KEY);
            localStorage.removeItem('title');
            setTasks(DEFAULT_TASKS.map(item => ({ ...item })));
            setTitle('');
            setSelectedRanking('');
            setSorted(false);
            setTyped(false);
            navigate('/saved');
        }
    }

    const updateTaskTitle = (id, newTitle) => {
        setTasks(ts => ts.map(t => t.id === id ? {...t, title: newTitle} : t));
    };

    const deleteTask = (id) => {
        setTasks(ts => ts.filter(t => t.id !== id));
        setTyped(true);
    };

    const [title, setTitle] = useState(() => localStorage.getItem("title") || "");

    const handleProvidedRankingChange = (event) => {
        const value = event.target.value;
        setSelectedRanking(value);

        if (!value) {
            setTasks(DEFAULT_TASKS.map(item => ({...item})));
            setTitle('');
            setSorted(false);
            setTyped(false);
            return;
        }

        const ranking = providedRankings[value];
        setTitle(providedRankingTitles[value] || '');
        if (ranking) {
            setTasks(ranking.map(item => ({...item})));
            setTyped(true);
        }
    };

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
            setSorted(true);
            return;
        }

        const overTask = tasks.find(task => task.id === over.id);
        if (over.id === 'bank' || overTask?.location === 'bank') {
            moveTask(active.id, 'bank');
            setSorted(true);

            // If dropped over a specific bank item, keep reorder behavior.
            if (overTask && active.id !== over.id) {
                setTasks(ts => {
                    const activeIndex = ts.findIndex(task => task.id === active.id);
                    const overIndex = ts.findIndex(task => task.id === over.id);
                    if (activeIndex === -1 || overIndex === -1) return ts;
                    return arrayMove(ts, activeIndex, overIndex);
                });
            }
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
        setTyped(true);
    }

    async function generateRandomWords(event) {
        event.preventDefault();
        setWordsLoading(true);
        try {
            const response = await fetch(RANDOM_WORDS_ENDPOINT);
            if (!response.ok) {
                throw new Error('Failed to load random words');
            }
            const words = await response.json();
            const randomWordTasks = words.map((word, index) => ({
                id: index,
                title: word,
                location: 'bank',
            }));
            setTasks(randomWordTasks);
            setTitle('Random Words');
            setSelectedRanking('randomWords');
            setSorted(false);
            setTyped(true);
        } catch {
            alert('Error loading random words');
        } finally {
            setWordsLoading(false);
        }

    }

  return (
    <main className="main">
    <div className="rank-info">
        <div className="user-info">User: {userName}</div>
        <div className="title-group">
            <label>Title:</label><input id="title" placeholder="title" value={title} onChange={(e) => {
                setTitle(e.target.value);
                setTyped(true);
            }} />
        </div>
        <div className="save-share">
            <button className="item-btn" id="delete-btn" onClick={handleSave} disabled={!sorted && !typed}>Save and Clear</button>
        </div>
        <div>
            <button className="item-btn" id="clear-btn" onClick={handleClear}>Clear</button>
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
                        <Column
                            tasks={tasks}
                            onUpdateTask={updateTaskTitle}
                            onDeleteTask={deleteTask}
                            onTypedChange={setTyped}
                        />
                    </div>
                    </DndContext>
                </div>
                <div className="item-container">
                    <button className="item-btn" onClick={addItem}>+ Add Item</button>
                </div>
            </div>
            <div className="drop-down">
                <h3>Use Provided Rankings</h3>
                <div className="drop-down-container">
                    <select
                        className="drop-down-box"
                        value={selectedRanking}
                        onChange={handleProvidedRankingChange}
                    >
                        <option value="">Select a ranking</option>
                        <option value="option1">Superheroes</option>
                        <option value="option2">Fast Food Restaurants</option>
                        <option value="option3">Types of Chairs</option>
                        <option value="option4">Dinosaurs</option>
                        <option value="option5">Star Wars Characters</option>
                    </select>
                </div>
                <form className="random-ranking-form">
                    <h3>Rank random words</h3>
                    <button
                        className="item-btn"
                        id="random-btn"
                        onClick={generateRandomWords}
                        disabled={wordsLoading}
                    >
                        {wordsLoading ? 'Loading Words...' : 'Generate Words'}
                    </button>
                </form>
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