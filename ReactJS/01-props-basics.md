# React TypeScript - Props Basics

## What are Props?

Props (short for "properties") are the mechanism for passing data from parent components to child components. They are **read-only** and help make components reusable.

---

## Step 1: Basic Props with TypeScript

### Defining Props Interface

```tsx
// Define the shape of props using an interface
interface GreetingProps {
  name: string;
  age: number;
}

// Use the interface to type your component
function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Greeting name="Alice" age={25} />
```

**Explanation:**
- `interface GreetingProps` defines what props the component accepts
- TypeScript will show errors if you pass wrong types or miss required props
- Destructuring `{ name, age }` extracts values from props object

---

## Step 2: Optional Props

```tsx
interface CardProps {
  title: string;
  description?: string;  // Optional prop (note the ?)
  imageUrl?: string;
}

function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

// All valid usages:
<Card title="My Card" />
<Card title="My Card" description="Some text" />
<Card title="My Card" description="Some text" imageUrl="/image.jpg" />
```

**Explanation:**
- `?` after prop name makes it optional
- Use conditional rendering `{description && ...}` to handle missing optional props

---

## Step 3: Default Props

```tsx
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

function Button({ 
  label, 
  variant = 'primary',    // Default value
  size = 'medium',        // Default value
  disabled = false        // Default value
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Usage examples:
<Button label="Click Me" />                          // Uses all defaults
<Button label="Delete" variant="danger" />           // Overrides variant
<Button label="Small Button" size="small" />         // Overrides size
```

**Explanation:**
- Default values are assigned in the destructuring pattern
- If prop is not passed, the default value is used
- Union types like `'primary' | 'secondary'` restrict values to specific strings

---

## Step 4: Props with Different Types

### Arrays as Props

```tsx
interface ListProps {
  items: string[];
  title: string;
}

function SimpleList({ items, title }: ListProps) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// Usage
<SimpleList 
  title="Fruits" 
  items={['Apple', 'Banana', 'Orange']} 
/>
```

### Objects as Props

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
  showEmail?: boolean;
}

function UserCard({ user, showEmail = false }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {showEmail && <p>Email: {user.email}</p>}
    </div>
  );
}

// Usage
const currentUser: User = { id: 1, name: 'John', email: 'john@example.com' };
<UserCard user={currentUser} showEmail />
```

### Array of Objects as Props

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
  currency?: string;
}

function ProductList({ products, currency = '$' }: ProductListProps) {
  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-item">
          <span>{product.name}</span>
          <span>{currency}{product.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

// Usage
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Mouse', price: 29.99 },
  { id: 3, name: 'Keyboard', price: 79.99 }
];

<ProductList products={products} currency="₹" />
```

---

## Step 5: Function Props (Callbacks)

```tsx
interface CounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

function Counter({ count, onIncrement, onDecrement, onReset }: CounterProps) {
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={onDecrement}>-</button>
      <button onClick={onIncrement}>+</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}

// Usage in Parent Component
function App() {
  const [count, setCount] = useState(0);

  return (
    <Counter
      count={count}
      onIncrement={() => setCount(c => c + 1)}
      onDecrement={() => setCount(c => c - 1)}
      onReset={() => setCount(0)}
    />
  );
}
```

### Function Props with Parameters

```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  );
}

// Usage
function App() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Perform search logic
  };

  return <SearchBar onSearch={handleSearch} placeholder="Search products..." />;
}
```

---

## Step 6: Spread Props Pattern

```tsx
interface InputProps {
  label: string;
  error?: string;
}

// Extend HTML input attributes
type TextInputProps = InputProps & React.InputHTMLAttributes<HTMLInputElement>;

function TextInput({ label, error, ...inputProps }: TextInputProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input {...inputProps} className={error ? 'error' : ''} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// Usage - can pass any valid input attributes
<TextInput
  label="Email"
  type="email"
  placeholder="Enter email"
  required
  onChange={(e) => console.log(e.target.value)}
/>
```

**Explanation:**
- `React.InputHTMLAttributes<HTMLInputElement>` includes all standard HTML input attributes
- `...inputProps` spreads remaining props to the input element
- This pattern makes components flexible and reusable

---

## Quick Reference: Common Prop Types

```tsx
interface AllTypesExample {
  // Primitives
  stringProp: string;
  numberProp: number;
  booleanProp: boolean;
  
  // Arrays
  stringArray: string[];
  numberArray: number[];
  
  // Objects
  objectProp: { name: string; value: number };
  
  // Functions
  onClick: () => void;
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => Promise<void>;
  
  // React specific
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  
  // Union types
  status: 'loading' | 'success' | 'error';
  size: 'sm' | 'md' | 'lg';
}
```

---

## Practice Exercise

Create a `TodoItem` component that accepts:
- `id: number`
- `text: string`
- `completed: boolean`
- `onToggle: (id: number) => void`
- `onDelete: (id: number) => void`

Try implementing it yourself before checking the solution!

```tsx
// Your implementation here
```

---

## Key Takeaways

1. **Always type your props** with interfaces or types
2. **Use `?`** for optional props
3. **Provide default values** for optional props when sensible
4. **Use union types** for props with limited valid values
5. **Function props** enable child-to-parent communication
6. **Spread operator** helps create flexible wrapper components
