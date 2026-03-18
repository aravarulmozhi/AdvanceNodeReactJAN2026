# React TypeScript - Children Prop & Slots Pattern

## What is the `children` Prop?

The `children` prop is a special prop that allows you to pass components or elements as data to other components. It's the content between opening and closing tags of a component.

---

## Step 1: Basic Children Usage

```tsx
interface CardProps {
  children: React.ReactNode;  // Can be anything React can render
}

function Card({ children }: CardProps) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage - anything between tags becomes children
<Card>
  <h2>Title</h2>
  <p>Some content here</p>
</Card>

<Card>
  <img src="image.jpg" alt="demo" />
</Card>

<Card>
  Just plain text
</Card>
```

**`React.ReactNode` can be:**
- JSX elements
- Strings
- Numbers
- Arrays of elements
- `null` or `undefined`
- Booleans (render nothing)

---

## Step 2: Different Children Types

```tsx
// Accept only React elements
interface StrictCardProps {
  children: React.ReactElement;  // Only JSX elements, no strings
}

// Accept only string
interface TextOnlyProps {
  children: string;
}

// Accept single child
interface SingleChildProps {
  children: React.ReactElement;  // Exactly one element
}

// Accept multiple children
interface MultiChildProps {
  children: React.ReactNode;  // Any number of any renderable
}

// Accept array of specific elements
interface ListWrapperProps {
  children: React.ReactElement<ListItemProps>[];
}
```

### Example: Wrapper Component

```tsx
interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

function Section({ children, className }: WrapperProps) {
  return (
    <section className={`section ${className || ''}`}>
      {children}
    </section>
  );
}

function Sidebar({ children }: WrapperProps) {
  return (
    <aside className="sidebar">
      {children}
    </aside>
  );
}

function Main({ children }: WrapperProps) {
  return (
    <main className="main-content">
      {children}
    </main>
  );
}

// Usage
<Section>
  <Sidebar>
    <nav>Navigation items</nav>
  </Sidebar>
  <Main>
    <h1>Welcome</h1>
    <p>Main content here</p>
  </Main>
</Section>
```

---

## Step 3: Slots Pattern (Named Children)

Sometimes you need to pass content to specific places. Use props for "named slots":

```tsx
interface PageLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;  // Main content
  footer?: React.ReactNode;
}

function PageLayout({ header, sidebar, children, footer }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <header className="page-header">
        {header}
      </header>
      
      <div className="page-body">
        <aside className="page-sidebar">
          {sidebar}
        </aside>
        <main className="page-main">
          {children}
        </main>
      </div>
      
      {footer && (
        <footer className="page-footer">
          {footer}
        </footer>
      )}
    </div>
  );
}

// Usage
<PageLayout
  header={<Logo />}
  sidebar={<Navigation items={menuItems} />}
  footer={<Copyright year={2024} />}
>
  <h1>Welcome to our site</h1>
  <p>This is the main content area</p>
</PageLayout>
```

### Modal with Slots

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Delete"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
  <p>This action cannot be undone.</p>
</Modal>
```

---

## Step 4: Manipulating Children

React provides utilities to work with children:

```tsx
import { Children, cloneElement, isValidElement } from 'react';

interface TabListProps {
  children: React.ReactNode;
  activeIndex: number;
  onTabChange: (index: number) => void;
}

function TabList({ children, activeIndex, onTabChange }: TabListProps) {
  return (
    <div className="tab-list">
      {Children.map(children, (child, index) => {
        // Check if it's a valid React element
        if (isValidElement(child)) {
          // Clone and add props
          return cloneElement(child, {
            isActive: index === activeIndex,
            onClick: () => onTabChange(index)
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

function Tab({ children, isActive, onClick }: TabProps) {
  return (
    <button 
      className={`tab ${isActive ? 'tab-active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Usage
function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabList activeIndex={activeTab} onTabChange={setActiveTab}>
      <Tab>Home</Tab>
      <Tab>Products</Tab>
      <Tab>About</Tab>
    </TabList>
  );
}
```

### Children Utility Functions

```tsx
import { Children } from 'react';

interface ListProps {
  children: React.ReactNode;
}

function List({ children }: ListProps) {
  // Count children
  const count = Children.count(children);
  
  // Convert to array
  const childArray = Children.toArray(children);
  
  // Loop through children
  Children.forEach(children, (child, index) => {
    console.log(`Child ${index}:`, child);
  });

  return (
    <ul>
      <li>Total items: {count}</li>
      {Children.map(children, (child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  );
}
```

---

## Step 5: Render Props Pattern

Pass a function as children that returns what to render:

```tsx
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {children(position)}
    </div>
  );
}

// Usage - children is a function!
<MouseTracker>
  {({ x, y }) => (
    <div>
      <p>Mouse position: ({x}, {y})</p>
      <div 
        style={{ 
          position: 'absolute', 
          left: x, 
          top: y,
          width: 20,
          height: 20,
          background: 'red',
          borderRadius: '50%'
        }} 
      />
    </div>
  )}
</MouseTracker>
```

### Data Fetching with Render Props

```tsx
interface FetchProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

function Fetch<T>({ url, children }: FetchProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// Usage
<Fetch<User[]> url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    if (!data) return null;
    
    return (
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }}
</Fetch>
```

---

## Step 6: Conditional Children

```tsx
interface ShowProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function Show({ when, children, fallback = null }: ShowProps) {
  return when ? <>{children}</> : <>{fallback}</>;
}

// Usage
<Show when={isLoggedIn} fallback={<LoginPrompt />}>
  <Dashboard />
</Show>

<Show when={items.length > 0} fallback={<EmptyState />}>
  <ItemList items={items} />
</Show>
```

### Switch Component

```tsx
interface MatchProps {
  when: boolean;
  children: React.ReactNode;
}

function Match({ when, children }: MatchProps) {
  return when ? <>{children}</> : null;
}

interface SwitchProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function Switch({ children, fallback }: SwitchProps) {
  const childArray = Children.toArray(children);
  
  for (const child of childArray) {
    if (isValidElement(child) && child.props.when) {
      return <>{child}</>;
    }
  }
  
  return <>{fallback}</>;
}

// Usage
function StatusDisplay({ status }: { status: string }) {
  return (
    <Switch fallback={<span>Unknown status</span>}>
      <Match when={status === 'loading'}>
        <Spinner />
      </Match>
      <Match when={status === 'success'}>
        <SuccessIcon />
      </Match>
      <Match when={status === 'error'}>
        <ErrorIcon />
      </Match>
    </Switch>
  );
}
```

---

## Step 7: Iterating Children

```tsx
interface EachProps<T> {
  items: T[];
  children: (item: T, index: number) => React.ReactNode;
}

function Each<T>({ items, children }: EachProps<T>) {
  return <>{items.map((item, index) => children(item, index))}</>;
}

// Usage
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

<ul>
  <Each items={users}>
    {(user, index) => (
      <li key={user.id}>
        {index + 1}. {user.name}
      </li>
    )}
  </Each>
</ul>
```

---

## Real-World Example: Accordion Component

```tsx
interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
}

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="accordion-item">
      <button 
        className="accordion-header" 
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {title}
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

function Accordion({ children, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return allowMultiple ? [...prev, index] : [index];
    });
  };

  return (
    <div className="accordion">
      {Children.map(children, (child, index) => {
        if (isValidElement<AccordionItemProps>(child)) {
          return cloneElement(child, {
            isOpen: openItems.includes(index),
            onToggle: () => toggleItem(index)
          });
        }
        return child;
      })}
    </div>
  );
}

// Usage
<Accordion>
  <AccordionItem title="Section 1">
    <p>Content for section 1</p>
  </AccordionItem>
  <AccordionItem title="Section 2">
    <p>Content for section 2</p>
  </AccordionItem>
  <AccordionItem title="Section 3">
    <p>Content for section 3</p>
  </AccordionItem>
</Accordion>

// Allow multiple open
<Accordion allowMultiple>
  <AccordionItem title="FAQ 1">Answer 1</AccordionItem>
  <AccordionItem title="FAQ 2">Answer 2</AccordionItem>
</Accordion>
```

---

## Key Takeaways

1. **`children`** is a special prop for content between component tags
2. **`React.ReactNode`** is the most flexible type for children
3. **Slots pattern** uses named props for placing content in specific locations
4. **`Children` utilities** help manipulate children programmatically
5. **Render props** pass functions as children for maximum flexibility
6. **`cloneElement`** can inject props into children
