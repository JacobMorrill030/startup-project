import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {DndContext, DragOverlay, pointerWithin, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, closestCorners} from '@dnd-kit/core';
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import './rank.css';
import {Column} from './components/Column';
import {Table} from './components/Table';
import '../styles/app.css';

const TASKS_STORAGE_KEY = 'rankTasks';
const ORDERED_TASK_IDS_STORAGE_KEY = 'rankOrderedTaskIds';
const SAVED_RANKINGS_STORAGE_KEY = 'savedRankings';
const TIER_COLORS_STORAGE_KEY = 'tierColors';
const RANDOM_WORDS_ENDPOINT = "https://random-word-api.herokuapp.com/word?number=10";
const TIER_IDS = ['S', 'A', 'B', 'C', 'D'];
const DEFAULT_TIER_COLORS = {
    S: 'red',
    A: 'orange',
    B: 'yellow',
    C: 'rgb(30, 210, 30)',
    D: 'rgb(59, 59, 233)',
};
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
    option5: 'Star Wars Characters',
};

const isValidTask = (task) => (
    task &&
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.location === 'string'
);

const buildInitialOrderedTaskIds = (tasks) => {
    const savedIds = localStorage.getItem(ORDERED_TASK_IDS_STORAGE_KEY);
    const validTaskIds = new Set(tasks.map(task => task.id));

    if (savedIds) {
        try {
            const parsed = JSON.parse(savedIds);
            if (Array.isArray(parsed)) {
                const deduped = [];
                const seen = new Set();
                parsed.forEach((id) => {
                    if (typeof id !== 'number') return;
                    if (!validTaskIds.has(id)) return;
                    if (seen.has(id)) return;
                    seen.add(id);
                    deduped.push(id);
                });

                const missingIds = tasks
                    .map(task => task.id)
                    .filter(id => !seen.has(id));

                return [...deduped, ...missingIds];
            }
        } catch {
            // fallback to task order
        }
    }

    return tasks.map(task => task.id);
};

const moveTierTaskByDropTarget = (tasks, activeId, overId) => {
    if (overId === null || overId === undefined) return tasks;

    const isContainerDrop = overId === 'bank' || TIER_IDS.includes(overId);
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return tasks;

    const overTask = isContainerDrop ? null : tasks.find(task => task.id === overId);
    const targetLocation = isContainerDrop ? overId : overTask?.location;
    if (!targetLocation) return tasks;

    if (overTask && activeTask.id === overTask.id && activeTask.location === overTask.location) {
        return tasks;
    }

    if (isContainerDrop && activeTask.location === targetLocation) {
    const tierItems = tasks.filter(task => task.location === targetLocation);
    const lastTierItemId = tierItems[tierItems.length - 1]?.id;

    // No-op only if already at the bottom of this tier
    if (lastTierItemId === activeId) {
        return tasks;
    }
}

    const withoutActive = tasks.filter(task => task.id !== activeId);
    const movedTask = {...activeTask, location: targetLocation};

    if (isContainerDrop) {
        const lastInTargetIndex = withoutActive.reduce((idx, task, i) => (
            task.location === targetLocation ? i : idx
        ), -1);
        const insertIndex = lastInTargetIndex + 1;
        const next = [...withoutActive];
        next.splice(insertIndex, 0, movedTask);
        return next;
    }

    const activeIndex = tasks.findIndex(task => task.id === activeId);
    const overIndexInOriginal = tasks.findIndex(task => task.id === overId);
    if (overIndexInOriginal === -1 || activeIndex === -1) return tasks;

    const overIndex = withoutActive.findIndex(task => task.id === overId);
    if (overIndex === -1) return tasks;

    // Same tier reorder:
    // - dragging down => place after target
    // - dragging up => place before target
    const isSameLocationReorder = activeTask.location === targetLocation;
    const isMovingDown = activeIndex < overIndexInOriginal;
    const insertIndex =
        isSameLocationReorder && isMovingDown
            ? overIndex + 1
            : overIndex;

    const next = [...withoutActive];
    next.splice(insertIndex, 0, movedTask);
    return next;
};

export function Rank({ userName }) {
    const navigate = useNavigate();
    const [items, setItems] = React.useState(['']);
    const [selectedRanking, setSelectedRanking] = useState('');
    const [sorted, setSorted] = useState(false);
    const [typed, setTyped] = useState(false);
    const [wordsLoading, setWordsLoading] = useState(false);
    const [activeTierDragId, setActiveTierDragId] = useState(null);
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
    const [orderedTaskIds, setOrderedTaskIds] = React.useState(() => buildInitialOrderedTaskIds(tasks));

    const [tierColors, setTierColors] = useState(() => {
        const savedColors = localStorage.getItem(TIER_COLORS_STORAGE_KEY);
        if (savedColors) {
            try {
                const parsed = JSON.parse(savedColors);
                return { ...DEFAULT_TIER_COLORS, ...parsed };
            } catch {
                return DEFAULT_TIER_COLORS;
            }
        }
        return DEFAULT_TIER_COLORS;
    });

    async function handleClear() {
        localStorage.removeItem(TASKS_STORAGE_KEY);
        localStorage.removeItem(ORDERED_TASK_IDS_STORAGE_KEY);
        localStorage.removeItem('title');
        setTasks(DEFAULT_TASKS.map(item => ({ ...item })));
        setOrderedTaskIds(DEFAULT_TASKS.map(item => item.id));
        setTitle('');
        setSelectedRanking('');
        setSorted(false);
        setTyped(false);
        setTierColors(DEFAULT_TIER_COLORS);
    }

    async function handleSave() {
        const tiers = { S: [], A: [], B: [], C: [], D: [] };
        // const date = new Date().toLocaleDateString();

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
            userName,
            id: `my-${Date.now()}`,
            title: title.trim() || 'Untitled Ranking',
            orderedItems,
            tiers,
            tierColors,
            savedId: `my-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };

        const savedRaw = localStorage.getItem(SAVED_RANKINGS_STORAGE_KEY);
        let savedRankings = [];

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
            localStorage.removeItem(ORDERED_TASK_IDS_STORAGE_KEY);
            localStorage.removeItem('title');
            setTasks(DEFAULT_TASKS.map(item => ({ ...item })));
            setOrderedTaskIds(DEFAULT_TASKS.map(item => item.id));
            setTitle('');
            setSelectedRanking('');
            setSorted(false);
            setTyped(false);
            navigate('/saved');
        }
    }

    function addItem() {
        const nextId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 0;
        setTasks(ts => [...ts, {id: nextId, title: '', location: 'bank'}]);
        setOrderedTaskIds(ids => [...ids, nextId]);
        setItems(it => [...it, '']);
        setTyped(true);
    }

    const updateTaskTitle = (id, newTitle) => {
        setTasks(ts => ts.map(t => t.id === id ? {...t, title: newTitle} : t));
    };

    const deleteTask = (id) => {
        setTasks(ts => ts.filter(t => t.id !== id));
        setOrderedTaskIds(ids => ids.filter(taskId => taskId !== id));
        setTyped(true);
    };

    const updateTierColor = (tier, color) => {
        setTierColors(prev => ({ ...prev, [tier]: color }));
    };

    const [title, setTitle] = useState(() => localStorage.getItem("title") || "");

    const handleProvidedRankingChange = (event) => {
        const value = event.target.value;
        setSelectedRanking(value);

        if (!value) {
            setTasks(DEFAULT_TASKS.map(item => ({...item})));
            setOrderedTaskIds(DEFAULT_TASKS.map(item => item.id));
            setTitle('');
            setSorted(false);
            setTyped(false);
            return;
        }

        const ranking = providedRankings[value];
        setTitle(providedRankingTitles[value] || '');
        if (ranking) {
            setTasks(ranking.map(item => ({...item})));
            setOrderedTaskIds(ranking.map(item => item.id));
            setTyped(true);
        }
    };

    useEffect(() => {
        localStorage.setItem("title", title);
    }, [title]);

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem(ORDERED_TASK_IDS_STORAGE_KEY, JSON.stringify(orderedTaskIds));
    }, [orderedTaskIds]);

    useEffect(() => {
        localStorage.setItem(TIER_COLORS_STORAGE_KEY, JSON.stringify(tierColors));
    }, [tierColors]);

    useEffect(() => {        setOrderedTaskIds((ids) => {
            const validTaskIds = new Set(tasks.map(task => task.id));
            const nextIds = ids.filter(id => validTaskIds.has(id));
            const nextIdSet = new Set(nextIds);
            tasks.forEach((task) => {
                if (!nextIdSet.has(task.id)) {
                    nextIds.push(task.id);
                    nextIdSet.add(task.id);
                }
            });
            return nextIds;
        });
    }, [tasks]);

    const handleDragEnd = event => {
        const {active, over} = event;
        if (over) {
            setTasks(ts => moveTierTaskByDropTarget(ts, active.id, over.id));
            setSorted(true);
        }
        setActiveTierDragId(null);
    }

    const handleTierDragStart = (event) => {
        setActiveTierDragId(event.active.id);
    };

    const handleTierDragCancel = () => {
        setActiveTierDragId(null);
    };

    const handleTierDragOver = (event) => {
        const {active, over} = event;
        if (!over) return;

        setTasks(ts => moveTierTaskByDropTarget(ts, active.id, over.id));
        setSorted(true);
    };

    const handleOrderedListDragEnd = (event) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        setOrderedTaskIds((ids) => {
            const activeIndex = ids.findIndex(id => id === active.id);
            const overIndex = ids.findIndex(id => id === over.id);
            if (activeIndex === -1 || overIndex === -1) return ids;
            return arrayMove(ids, activeIndex, overIndex);
        });

        setSorted(true);
    };

        const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
        );

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
            setOrderedTaskIds(randomWordTasks.map(task => task.id));
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

    const activeTierDragTask = activeTierDragId === null
        ? null
        : tasks.find(task => task.id === activeTierDragId);

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
                    onDragEnd={handleOrderedListDragEnd}
                    collisionDetection={closestCorners}>
                    <Column
                        tasks={orderedTaskIds
                            .map(id => tasks.find(task => task.id === id))
                            .filter(Boolean)}
                        onUpdateTask={updateTaskTitle}
                        onDeleteTask={deleteTask}
                        onTypedChange={setTyped}
                    />
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
                onDragStart={handleTierDragStart}
                onDragOver={handleTierDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleTierDragCancel}
                collisionDetection={pointerWithin}>
                <div className="column">
                    <Table
                        tasks={tasks}
                        onUpdateTask={updateTaskTitle}
                        tierColors={tierColors}
                        onUpdateTierColor={updateTierColor}
                    />
                    <DragOverlay>
                    {activeTierDragTask ? (
                        <div className="bank-container drag-preview">
                            <li id="bank-item" className="bank-item">
                                <div className="input-container">
                                    <input
                                        className="bank-input"
                                        type="text"
                                        readOnly
                                        value={activeTierDragTask.title}
                                    />
                                </div>
                            </li>
                        </div>
                    ) : null}
                </DragOverlay>
                </div>
                
            </DndContext>
           
        </div>
    </div>
</main>
  );
}