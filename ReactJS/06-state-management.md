# State Management in React (TypeScript)

## What is State?

**State** is data that changes over time in your application. Think of it like a variable that, when updated, automatically re-renders your component to show the new value.

### Real-World Analogy
Imagine a scoreboard at a game:
- The **score** is the state
- When a team scores, the scoreboard **updates** automatically
- Everyone watching sees the **new score** immediately

---

## useState Hook - The Basics

`useState` is React's built-in way to add state to a component.

### Syntax
```tsx
const [value, setValue] = useState<Type>(initialValue);
```

- `value` → current state value
- `setValue` → function to update the state
- `initialValue` → starting value
- `<Type>` → TypeScript type annotation (optional for primitives, required for complex types)

---

## Example 1: Simple Counter

```tsx
import { useState } from 'react';

function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### What's Happening?
1. `useState<number>(0)` creates a state variable of type `number` starting at `0`
2. Clicking "Increase" calls `setCount(count + 1)` → state becomes `1`
3. React **re-renders** the component with the new count

---

## Example 2: Toggle (Boolean State)

```tsx
import { useState } from 'react';

function LightSwitch(): JSX.Element {
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <div>
      <p>The light is {isOn ? 'ON 💡' : 'OFF 🌑'}</p>
      <button onClick={() => setIsOn(!isOn)}>
        Toggle
      </button>
    </div>
  );
}
```

---

## Example 3: Input Field (String State)

```tsx
import { useState, ChangeEvent } from 'react';

function NameInput(): JSX.Element {
  const [name, setName] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={name} 
        onChange={handleChange} 
        placeholder="Enter your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}
```

---

## Example 4: Object State

```tsx
import { useState } from 'react';

// Define type/interface for the state object
interface User {
  name: string;
  age: number;
  city: string;
}

function UserProfile(): JSX.Element {
  const [user, setUser] = useState<User>({
    name: 'John',
    age: 25,
    city: 'New York'
  });

  const updateCity = (newCity: string): void => {
    setUser({
      ...user,        // spread existing properties
      city: newCity   // override city
    });
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>City: {user.city}</p>
      <button onClick={() => updateCity('Los Angeles')}>
        Move to LA
      </button>
    </div>
  );
}
```

> ⚠️ **Important**: Always create a NEW object when updating object state. Never mutate directly!

---

## Example 5: Array State (Todo List)

```tsx
import { useState, ChangeEvent } from 'react';

// Define type for todo item
interface Todo {
  id: number;
  text: string;
}

function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  const addTodo = (): void => {
    if (input.trim()) {
      const newTodo: Todo = { id: Date.now(), text: input };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  const removeTodo = (id: number): void => {
    setTodos(todos.filter((todo: Todo) => todo.id !== id));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={handleChange}
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## State Update Rules

### ✅ Do's
```tsx
// Updating primitives
setCount(count + 1);

// Updating objects (create new object)
setUser({ ...user, name: 'Jane' });

// Updating arrays (create new array)
setItems([...items, newItem]);        // Add
setItems(items.filter((i: Item) => i.id !== id));  // Remove
```

### ❌ Don'ts
```tsx
// WRONG - Mutating state directly
user.name = 'Jane';  // Won't trigger re-render!
setUser(user);

// WRONG - Mutating arrays
items.push(newItem);  // Won't trigger re-render!
setItems(items);
```

---

## Multiple State Variables

You can use multiple `useState` calls in one component:

```tsx
function Form(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Each state is independent
  return (
    // ... form JSX
  );
}
```

---

## State vs Props - Quick Comparison

| Feature | State | Props |
|---------|-------|-------|
| Where it lives | Inside the component | Passed from parent |
| Who can change it | The component itself | Parent only |
| Mutable? | Yes (via setter) | No (read-only) |
| Triggers re-render? | Yes | Yes |

---

## When to Use State

Use state when you need to:
- Track user input (forms, search)
- Toggle UI elements (modals, menus)
- Store fetched data
- Track counts or quantities
- Manage loading/error states

---

## Summary

1. **State** = data that changes and triggers UI updates
2. Use **useState** hook to create state
3. Always use the **setter function** to update state
4. Never **mutate** state directly
5. Create **new objects/arrays** when updating complex state
6. Use **TypeScript generics** `useState<Type>()` for type safety

```tsx
// The pattern to remember
const [value, setValue] = useState<Type>(initialValue);
```

Happy coding! 🚀
