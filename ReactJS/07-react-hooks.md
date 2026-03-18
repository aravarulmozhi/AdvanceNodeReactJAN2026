# React Hooks - Complete Beginner Guide

## What are Hooks?

**Hooks** are special functions from React that let you "hook into" React features like state, lifecycle, and more — all inside **function components**.

### Real-World Analogy
Think of a **fishing hook** 🎣 — it lets you reach into the water (React's internal system) and pull out something useful (state, effects, refs, etc.) into your component.

### Rules of Hooks
1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks inside React components** or custom hooks

```tsx
// ✅ CORRECT
function MyComponent() {
  const [count, setCount] = useState(0);  // top level — always runs
  return <p>{count}</p>;
}

// ❌ WRONG
function MyComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0);  // inside a condition — breaks React!
  }
}
```

---

## Must-Know Hooks (Overview)

| Hook | Purpose | One-Liner |
|------|---------|-----------|
| `useState` | Manage local state | "Remember a value between renders" |
| `useEffect` | Side effects (API calls, timers, subscriptions) | "Do something after render" |
| `useRef` | Access DOM elements / persist values without re-render | "Grab a DOM element or keep a mutable box" |
| `useMemo` | Cache expensive calculations | "Don't recalculate unless inputs change" |
| `useCallback` | Cache function references | "Don't recreate this function unless inputs change" |
| `useContext` | Share data without prop drilling | "Access global-ish data from anywhere" |
| `useReducer` | Complex state logic | "useState's big brother for complex state" |

---

## 🏗️ What We're Building

We'll build a **Task Manager App** step by step. Each hook section adds a new feature to the **same app**, so by the end you'll have one complete application.

**Final App Features:**
- Add, delete, and toggle tasks
- Search/filter tasks
- Track time spent on the page
- Dark/Light theme toggle
- Performance-optimized rendering

---

## 1. useState — Adding & Managing Tasks

You already know `useState` from the previous chapter. Here we set up the core of our Task Manager.

```tsx
import { useState, ChangeEvent } from 'react';

// ---------- Types ----------
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// ---------- Component ----------
function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  // Add a new task
  const addTask = (): void => {
    if (newTask.trim() === '') return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  // Toggle complete/incomplete
  const toggleTask = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>📋 Task Manager</h1>

      {/* Input Section */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: '8px 0' }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Stats */}
      <p>Total: {tasks.length} | Done: {tasks.filter((t) => t.completed).length}</p>
    </div>
  );
}

export default TaskManager;
```

### What's Happening?

| Line | Explanation |
|------|-------------|
| `useState<Task[]>([])` | Creates state to hold an array of tasks, starts empty |
| `useState<string>('')` | Creates state for the input field text |
| `setTasks([...tasks, task])` | Adds new task by spreading old array + new item |
| `tasks.map(...)` | Creates a new array with the toggled task (immutable update) |
| `tasks.filter(...)` | Creates a new array without the deleted task |

> 💡 **Key Idea**: `useState` is for any data that, when changed, should update the screen.

---

## 2. useEffect — Side Effects (Page Title + Auto-Save)

`useEffect` lets you run code **after** the component renders. It's used for things that happen **outside** of React — like updating the page title, fetching data, or setting timers.

### Syntax

```tsx
useEffect(() => {
  // This code runs AFTER the component renders
  
  return () => {
    // CLEANUP: runs before the effect runs again or component unmounts
  };
}, [dependencies]);
```

### The Dependency Array — The Most Important Part

```tsx
useEffect(() => { ... });           // Runs after EVERY render (rarely needed)
useEffect(() => { ... }, []);       // Runs ONCE after first render (like componentDidMount)
useEffect(() => { ... }, [count]);  // Runs when `count` changes
```

### Adding useEffect to Our App

**Feature: Update page title + track time on page**

```tsx
import { useState, useEffect, ChangeEvent } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);

  // EFFECT 1: Update the browser tab title whenever tasks change
  useEffect(() => {
    document.title = `Tasks (${tasks.length})`;
  }, [tasks]);
  // ☝️ Only runs when `tasks` array changes

  // EFFECT 2: Start a timer that ticks every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnPage((prev) => prev + 1);
    }, 1000);

    // CLEANUP: Stop the timer when the component is removed from the page
    return () => {
      clearInterval(timer);
    };
  }, []);
  // ☝️ Empty array = run once on mount, cleanup on unmount

  // EFFECT 3: Auto-save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Load tasks from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved) as Task[]);
    }
  }, []);

  const addTask = (): void => {
    if (newTask.trim() === '') return;
    const task: Task = { id: Date.now(), title: newTask.trim(), completed: false };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>📋 Task Manager</h1>
      <p>⏱️ Time on page: {secondsOnPage}s</p>

      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: '8px 0' }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <p>Total: {tasks.length} | Done: {tasks.filter((t) => t.completed).length}</p>
    </div>
  );
}

export default TaskManager;
```

### useEffect Mental Model

```
Component renders
       ↓
React updates the screen (DOM)
       ↓
useEffect runs (your side effect code)
       ↓
If dependencies change → cleanup old effect → run new effect
       ↓
Component removed → cleanup runs one final time
```

### Common useEffect Patterns

| Pattern | Dependency Array | When It Runs |
|---------|-----------------|--------------|
| Fetch data on mount | `[]` | Once, when component appears |
| Sync with a value | `[value]` | Every time `value` changes |
| Timer / subscription | `[]` + cleanup | Start on mount, stop on unmount |
| Update document title | `[title]` | When `title` changes |

> 💡 **Key Idea**: `useEffect` = "after the render, do this extra thing." Always ask: **when** should this effect run? That answer goes in the dependency array.

---

## 3. useRef — Accessing DOM Elements & Persistent Values

`useRef` gives you a **mutable box** that:
- Can hold a reference to a **DOM element** (like an input field)
- Can hold **any value** that persists across renders **without** causing a re-render

### Syntax

```tsx
const myRef = useRef<Type>(initialValue);
// Access the value: myRef.current
```

### useState vs useRef

| Feature | useState | useRef |
|---------|----------|--------|
| Triggers re-render? | ✅ Yes | ❌ No |
| Persists across renders? | ✅ Yes | ✅ Yes |
| Use for | UI data | DOM access, mutable values |

### Adding useRef to Our App

**Feature: Auto-focus the input field + track render count**

```tsx
import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);

  // REF 1: Reference to the input element (for auto-focus)
  const inputRef = useRef<HTMLInputElement>(null);

  // REF 2: Track how many times the component has rendered (doesn't cause re-render)
  const renderCount = useRef<number>(0);

  // Count renders (updating a ref does NOT trigger re-render)
  useEffect(() => {
    renderCount.current += 1;
    console.log(`Render count: ${renderCount.current}`);
  });

  // Auto-focus the input when the component first appears
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Timer for time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnPage((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save & load from localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved) as Task[]);
  }, []);

  const addTask = (): void => {
    if (newTask.trim() === '') return;
    const task: Task = { id: Date.now(), title: newTask.trim(), completed: false };
    setTasks([...tasks, task]);
    setNewTask('');

    // Re-focus the input after adding a task
    inputRef.current?.focus();
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>📋 Task Manager</h1>
      <p>⏱️ Time on page: {secondsOnPage}s</p>

      <div>
        <input
          ref={inputRef}       // ← Connect the ref to the input element
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: '8px 0' }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <p>Total: {tasks.length} | Done: {tasks.filter((t) => t.completed).length}</p>
    </div>
  );
}

export default TaskManager;
```

### How useRef Works (Visual)

```
                   useRef(0)
                      ↓
              ┌───────────────┐
              │  { current: 0 } │   ← This box survives re-renders
              └───────────────┘
                      ↓
   Render 1: renderCount.current = 1  (no re-render triggered)
   Render 2: renderCount.current = 2  (no re-render triggered)
   Render 3: renderCount.current = 3  (no re-render triggered)
```

> 💡 **Key Idea**: `useRef` = "I need to reach into the DOM" or "I need a value that survives renders but doesn't trigger them."

---

## 4. useMemo — Cache Expensive Calculations

`useMemo` **memorizes** (caches) the result of a calculation. It only recalculates when its dependencies change.

### Syntax

```tsx
const cachedValue = useMemo(() => {
  return expensiveCalculation(input);
}, [input]);
```

### Without vs With useMemo

```tsx
// ❌ Without useMemo — runs on EVERY render
const filtered = tasks.filter((t) => t.title.includes(search));

// ✅ With useMemo — only recalculates when tasks or search change
const filtered = useMemo(() => {
  return tasks.filter((t) => t.title.includes(search));
}, [tasks, search]);
```

### Adding useMemo to Our App

**Feature: Search/filter tasks with optimized filtering**

```tsx
import { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // MEMO: Filter tasks based on search — only recalculates when tasks or searchTerm change
  const filteredTasks = useMemo(() => {
    console.log('🔍 Filtering tasks...');  // Will only log when tasks or searchTerm change
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // MEMO: Calculate stats — only recalculates when tasks change
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length
    };
  }, [tasks]);

  // Effects (same as before)
  useEffect(() => {
    document.title = `Tasks (${stats.total})`;
  }, [stats.total]);

  useEffect(() => {
    const timer = setInterval(() => setSecondsOnPage((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved) as Task[]);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTask = (): void => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), title: newTask.trim(), completed: false }]);
    setNewTask('');
    inputRef.current?.focus();
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>📋 Task Manager</h1>
      <p>⏱️ Time on page: {secondsOnPage}s</p>

      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        placeholder="🔍 Search tasks..."
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />

      {/* Add Task */}
      <div>
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List — now uses filteredTasks instead of tasks */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ margin: '8px 0' }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Stats — uses memoized stats */}
      <p>
        Total: {stats.total} | Done: {stats.completed} | Pending: {stats.pending}
      </p>
    </div>
  );
}

export default TaskManager;
```

### When to Use useMemo

```
✅ Use when:                          ❌ Don't use when:
- Filtering/sorting large lists       - Simple calculations (a + b)
- Complex calculations                - The value changes every render anyway
- Creating objects passed as props     - Premature optimization
```

> 💡 **Key Idea**: `useMemo` = "Cache this value. Don't recalculate it unless these specific things change."

---

## 5. useCallback — Cache Function References

`useCallback` is like `useMemo`, but for **functions**. It returns the **same function reference** between renders, unless dependencies change.

### Why Does This Matter?

In JavaScript, every time a component re-renders, all functions inside it are **recreated** (new reference in memory). This can cause unnecessary re-renders of child components.

```tsx
// ❌ Without useCallback — new function created every render
const handleDelete = (id: number) => {
  setTasks(tasks.filter(t => t.id !== id));
};

// ✅ With useCallback — same function reference unless `tasks` changes
const handleDelete = useCallback((id: number) => {
  setTasks(tasks.filter(t => t.id !== id));
}, [tasks]);
```

### Adding useCallback to Our App

**Feature: Extract TaskItem as a child component, prevent unnecessary re-renders**

```tsx
import { useState, useEffect, useRef, useMemo, useCallback, memo, ChangeEvent } from 'react';

// ---------- Types ----------
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// ---------- Child Component (wrapped with memo) ----------
// memo() prevents re-render if props haven't changed
const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }: TaskItemProps): JSX.Element {
  console.log(`Rendering task: ${task.title}`);  // Shows which tasks actually re-render

  return (
    <li style={{ margin: '8px 0' }}>
      <span
        onClick={() => onToggle(task.id)}
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          cursor: 'pointer'
        }}
      >
        {task.completed ? '✅' : '⬜'} {task.title}
      </span>
      <button onClick={() => onDelete(task.id)} style={{ marginLeft: '10px' }}>
        🗑️
      </button>
    </li>
  );
});

// ---------- Parent Component ----------
function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length
  }), [tasks]);

  // CALLBACK: Stable function reference — won't cause child re-renders
  const toggleTask = useCallback((id: number): void => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);
  // ☝️ Empty deps because we use the callback form of setTasks (prev => ...)

  const deleteTask = useCallback((id: number): void => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Effects
  useEffect(() => {
    document.title = `Tasks (${stats.total})`;
  }, [stats.total]);

  useEffect(() => {
    const timer = setInterval(() => setSecondsOnPage((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved) as Task[]);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTask = (): void => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), title: newTask.trim(), completed: false }]);
    setNewTask('');
    inputRef.current?.focus();
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h1>📋 Task Manager</h1>
      <p>⏱️ Time on page: {secondsOnPage}s</p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        placeholder="🔍 Search tasks..."
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />

      <div>
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}     // ← Stable reference thanks to useCallback
            onDelete={deleteTask}     // ← Stable reference thanks to useCallback
          />
        ))}
      </ul>

      <p>Total: {stats.total} | Done: {stats.completed} | Pending: {stats.pending}</p>
    </div>
  );
}

export default TaskManager;
```

### memo + useCallback Working Together

```
Without useCallback + memo:
  Parent re-renders → new function created → child sees "new prop" → child re-renders ❌

With useCallback + memo:
  Parent re-renders → same function reference → child sees "same prop" → child skips re-render ✅
```

> 💡 **Key Idea**: `useCallback` = "Keep the same function reference so child components wrapped in `memo()` don't re-render unnecessarily."

---

## 6. useContext — Share Data Without Prop Drilling

`useContext` lets you share values across **all components** in a tree without passing props through every level.

### The Problem: Prop Drilling

```
App → Layout → Sidebar → ThemeToggle   (theme passed through 3 levels 😩)
```

### The Solution: Context

```
App (provides theme) → any component (consumes theme directly ✅)
```

### Adding useContext to Our App

**Feature: Dark/Light theme toggle available everywhere**

**Step 1: Create the Context (ThemeContext.tsx)**

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// ---------- Types ----------
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// ---------- Create Context ----------
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ---------- Provider Component ----------
// This wraps your app and makes theme available to all children
export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = (): void => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------- Custom Hook to use the context ----------
// This is a common pattern — wrap useContext in a custom hook
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

**Step 2: Wrap Your App (App.tsx)**

```tsx
import { ThemeProvider } from './ThemeContext';
import TaskManager from './TaskManager';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <TaskManager />
    </ThemeProvider>
  );
}

export default App;
```

**Step 3: Use Context in TaskManager**

```tsx
import { useTheme } from './ThemeContext';

// Inside TaskManager component, at the top:
function TaskManager(): JSX.Element {
  const { isDark, toggleTheme } = useTheme();  // ← Access theme from context!

  // ... all the existing state, refs, effects, callbacks ...

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#eaeaea' : '#333333',
        borderRadius: '8px'
      }}
    >
      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} style={{ float: 'right' }}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <h1>📋 Task Manager</h1>
      {/* ... rest of the JSX stays the same ... */}
    </div>
  );
}
```

### Context Flow (Visual)

```
  ThemeProvider (holds state: isDark, toggleTheme)
       │
       ├── App
       │    ├── TaskManager ← useTheme() → gets { isDark, toggleTheme }
       │    │    ├── TaskItem ← could also call useTheme() if needed!
       │    │    └── ...
       │    └── AnyOtherComponent ← useTheme() works here too!
```

### When to Use Context

| Use Context For | Don't Use Context For |
|----------------|-----------------------|
| Theme (dark/light) | Frequently changing data (it re-renders all consumers) |
| Current logged-in user | Data that only 1-2 components need (just use props) |
| Language/locale | Everything (not a replacement for all state management) |
| App-wide settings | |

> 💡 **Key Idea**: `useContext` = "Make data available to any component in the tree without passing it through every level."

---

## 7. useReducer — Complex State Logic

`useReducer` is an alternative to `useState` for **complex state logic**. If your state has multiple related values or the next state depends on the previous one, `useReducer` is cleaner.

### Syntax

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Think of it Like This

```
useState:    "Here's the new value"     → setCount(5)
useReducer:  "Here's what happened"     → dispatch({ type: 'INCREMENT' })
```

### The Reducer Pattern

```tsx
// 1. Define the state shape
interface State {
  count: number;
}

// 2. Define all possible actions
type Action = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' };

// 3. Write the reducer — a pure function that returns new state
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
  }
}
```

### Refactoring Our Task Manager with useReducer

**Feature: Replace multiple `setTasks` calls with a single, predictable reducer**

```tsx
import { useReducer, useState, useEffect, useRef, useMemo, useCallback, memo, ChangeEvent } from 'react';

// ---------- Types ----------
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Define all actions that can happen to tasks
type TaskAction =
  | { type: 'ADD_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'LOAD_TASKS'; payload: Task[] };

// ---------- Reducer ----------
function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { id: Date.now(), title: action.payload, completed: false }];

    case 'TOGGLE_TASK':
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);

    case 'LOAD_TASKS':
      return action.payload;
  }
}

// ---------- Child Component ----------
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }: TaskItemProps): JSX.Element {
  return (
    <li style={{ margin: '8px 0' }}>
      <span
        onClick={() => onToggle(task.id)}
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          cursor: 'pointer'
        }}
      >
        {task.completed ? '✅' : '⬜'} {task.title}
      </span>
      <button onClick={() => onDelete(task.id)} style={{ marginLeft: '10px' }}>
        🗑️
      </button>
    </li>
  );
});

// ---------- Main Component ----------
function TaskManager(): JSX.Element {
  // useReducer replaces useState for tasks!
  const [tasks, dispatch] = useReducer(taskReducer, []);

  const [newTask, setNewTask] = useState<string>('');
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length
  }), [tasks]);

  // Now using dispatch instead of setTasks
  const toggleTask = useCallback((id: number): void => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const deleteTask = useCallback((id: number): void => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const addTask = (): void => {
    if (newTask.trim() === '') return;
    dispatch({ type: 'ADD_TASK', payload: newTask.trim() });
    setNewTask('');
    inputRef.current?.focus();
  };

  // Effects
  useEffect(() => {
    document.title = `Tasks (${stats.total})`;
  }, [stats.total]);

  useEffect(() => {
    const timer = setInterval(() => setSecondsOnPage((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) dispatch({ type: 'LOAD_TASKS', payload: JSON.parse(saved) as Task[] });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h1>📋 Task Manager</h1>
      <p>⏱️ Time on page: {secondsOnPage}s</p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        placeholder="🔍 Search tasks..."
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />

      <div>
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>

      <p>Total: {stats.total} | Done: {stats.completed} | Pending: {stats.pending}</p>
    </div>
  );
}

export default TaskManager;
```

### useState vs useReducer — When to Use Which

| Scenario | Use |
|----------|-----|
| Single value (count, name, toggle) | `useState` |
| Multiple related values | `useReducer` |
| Next state depends on previous | `useReducer` |
| Complex update logic | `useReducer` |
| State shared via context | `useReducer` (often paired with `useContext`) |

> 💡 **Key Idea**: `useReducer` = "Instead of telling React the new state, tell it what happened (`dispatch`), and the reducer figures out the new state."

---

## Complete Architecture (How Everything Fits Together)

```
┌────────────────────────────────────────────────────────────┐
│                    ThemeProvider (useContext)                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  TaskManager                          │  │
│  │                                                      │  │
│  │  useReducer → tasks state + dispatch                 │  │
│  │  useState   → newTask, searchTerm, secondsOnPage     │  │
│  │  useRef     → inputRef (DOM), renderCount            │  │
│  │  useMemo    → filteredTasks, stats                   │  │
│  │  useCallback→ toggleTask, deleteTask                 │  │
│  │  useEffect  → timer, localStorage, document.title    │  │
│  │  useContext → isDark, toggleTheme (from ThemeProvider)│  │
│  │                                                      │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │ TaskItem   │ │ TaskItem   │ │ TaskItem   │       │  │
│  │  │ (memo)     │ │ (memo)     │ │ (memo)     │       │  │
│  │  └────────────┘ └────────────┘ └────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Cheat Sheet

```tsx
// useState — remember a value
const [count, setCount] = useState<number>(0);

// useEffect — do something after render
useEffect(() => {
  // side effect here
  return () => { /* cleanup */ };
}, [dependency]);

// useRef — access DOM or store mutable value
const inputRef = useRef<HTMLInputElement>(null);

// useMemo — cache a calculated value
const expensive = useMemo(() => compute(data), [data]);

// useCallback — cache a function
const handler = useCallback((id: number) => { ... }, []);

// useContext — access shared data
const { isDark } = useTheme();

// useReducer — complex state with actions
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'ACTION_NAME', payload: data });
```

---

## Common Mistakes to Avoid

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Missing dependency in useEffect | Effect won't re-run when it should | Add all used variables to the dependency array |
| Calling hooks inside conditions | Breaks React's hook ordering | Always call hooks at the top level |
| Forgetting cleanup in useEffect | Memory leaks (timers, subscriptions keep running) | Return a cleanup function |
| Overusing useMemo/useCallback | Adds complexity without benefit | Only optimize when you measure a performance problem |
| Mutating state directly | React won't detect the change | Always create new objects/arrays |
| Not using the callback form of setState | Stale state in closures | Use `setState(prev => ...)` inside useCallback/timers |

---

## What's Next?

Now that you understand the core hooks, explore:
- **Custom Hooks** → Extract reusable logic into your own hooks (e.g., `useLocalStorage`, `useFetch`)
- **React Query / TanStack Query** → Data fetching made easy
- **Zustand / Redux** → Global state management for larger apps

Happy coding! 🚀
