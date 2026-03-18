# React TypeScript - Component Composition

## What is Component Composition?

Component composition is the practice of building complex UIs by combining smaller, focused components. Instead of creating one large component, you **compose** multiple smaller components together.

**Key Principle:** "Composition over Inheritance"

---

## Why Composition?

| Approach | Problem |
|----------|---------|
| Inheritance | Creates rigid hierarchies, hard to modify |
| Composition | Flexible, reusable, easier to maintain |

---

## Step 1: Basic Composition

### Breaking Down a UI

**Before (Monolithic Component):**
```tsx
function UserProfile() {
  return (
    <div className="profile">
      <div className="avatar">
        <img src="/user.jpg" alt="User" />
      </div>
      <div className="info">
        <h2>John Doe</h2>
        <p>john@example.com</p>
      </div>
      <div className="actions">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
}
```

**After (Composed Components):**
```tsx
// Small, focused components
interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

function Avatar({ src, alt, size = 'medium' }: AvatarProps) {
  return (
    <div className={`avatar avatar-${size}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

interface UserInfoProps {
  name: string;
  email: string;
}

function UserInfo({ name, email }: UserInfoProps) {
  return (
    <div className="user-info">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="actions">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

// Composed together
interface UserProfileProps {
  user: {
    avatarUrl: string;
    name: string;
    email: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

function UserProfile({ user, onEdit, onDelete }: UserProfileProps) {
  return (
    <div className="profile">
      <Avatar src={user.avatarUrl} alt={user.name} />
      <UserInfo name={user.name} email={user.email} />
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
```

**Benefits:**
- Each component has a single responsibility
- Components can be reused elsewhere
- Easier to test individually
- Easier to maintain and modify

---

## Step 2: Container & Presentational Pattern

### Presentational Components (Dumb Components)
- Focus on **how things look**
- Receive data via props
- Don't manage state

### Container Components (Smart Components)
- Focus on **how things work**
- Manage state and logic
- Pass data to presentational components

```tsx
// ====== PRESENTATIONAL COMPONENTS ======

interface ProductItemProps {
  name: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
}

// Only concerned with display
function ProductItem({ name, price, imageUrl, onAddToCart }: ProductItemProps) {
  return (
    <div className="product-item">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}

interface ProductGridProps {
  products: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  onAddToCart: (id: number) => void;
}

function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductItem
          key={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          onAddToCart={() => onAddToCart(product.id)}
        />
      ))}
    </div>
  );
}

// ====== CONTAINER COMPONENT ======

function ProductListContainer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    // Fetch products
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    console.log(`Added product ${productId} to cart`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProductGrid 
      products={products} 
      onAddToCart={handleAddToCart} 
    />
  );
}
```

---

## Step 3: Component Specialization

Create specialized versions of generic components:

```tsx
// Generic Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {children}
    </button>
  );
}

// Specialized Buttons - Compose from generic Button
interface SpecializedButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function PrimaryButton({ children, ...props }: SpecializedButtonProps) {
  return <Button variant="primary" {...props}>{children}</Button>;
}

function DangerButton({ children, ...props }: SpecializedButtonProps) {
  return <Button variant="danger" {...props}>{children}</Button>;
}

function SubmitButton({ children, disabled }: Omit<SpecializedButtonProps, 'onClick'>) {
  return (
    <Button type="submit" variant="primary" disabled={disabled}>
      {children}
    </Button>
  );
}

// Icon Button - More specialized
interface IconButtonProps extends SpecializedButtonProps {
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function IconButton({ icon, iconPosition = 'left', children, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      {iconPosition === 'left' && <span className="icon">{icon}</span>}
      {children}
      {iconPosition === 'right' && <span className="icon">{icon}</span>}
    </Button>
  );
}

// Usage
<PrimaryButton onClick={() => console.log('clicked')}>
  Save Changes
</PrimaryButton>

<DangerButton onClick={handleDelete}>
  Delete Account
</DangerButton>

<IconButton icon={<SaveIcon />} onClick={handleSave}>
  Save
</IconButton>
```

---

## Step 4: Composition with Layout Components

```tsx
// ====== LAYOUT COMPONENTS ======

interface StackProps {
  children: React.ReactNode;
  gap?: number;
  direction?: 'horizontal' | 'vertical';
}

function Stack({ children, gap = 16, direction = 'vertical' }: StackProps) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: `${gap}px` 
      }}
    >
      {children}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  shadow?: boolean;
}

function Card({ children, padding = 16, shadow = true }: CardProps) {
  return (
    <div 
      style={{ 
        padding: `${padding}px`,
        borderRadius: '8px',
        boxShadow: shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        backgroundColor: 'white'
      }}
    >
      {children}
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  centered?: boolean;
}

function Container({ children, maxWidth = 1200, centered = true }: ContainerProps) {
  return (
    <div 
      style={{ 
        maxWidth: `${maxWidth}px`,
        margin: centered ? '0 auto' : '0',
        padding: '0 16px'
      }}
    >
      {children}
    </div>
  );
}

// ====== COMPOSING LAYOUTS ======

function Dashboard() {
  return (
    <Container maxWidth={1400}>
      <Stack gap={24}>
        <h1>Dashboard</h1>
        
        <Stack direction="horizontal" gap={16}>
          <Card>
            <h3>Total Users</h3>
            <p>1,234</p>
          </Card>
          <Card>
            <h3>Revenue</h3>
            <p>$45,678</p>
          </Card>
          <Card>
            <h3>Orders</h3>
            <p>567</p>
          </Card>
        </Stack>

        <Card padding={24}>
          <h2>Recent Activity</h2>
          <Stack gap={8}>
            <p>User John signed up</p>
            <p>Order #123 completed</p>
            <p>Payment received</p>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
```

---

## Step 5: Higher-Order Component (HOC) Pattern

HOCs are functions that take a component and return an enhanced component:

```tsx
// HOC that adds loading state
interface WithLoadingProps {
  isLoading: boolean;
}

function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent({ isLoading, ...props }: P & WithLoadingProps) {
    if (isLoading) {
      return <div className="spinner">Loading...</div>;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

// Usage
interface UserListProps {
  users: User[];
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Enhanced component
const UserListWithLoading = withLoading(UserList);

// In parent component
<UserListWithLoading 
  isLoading={loading} 
  users={users} 
/>
```

### HOC with Authentication

```tsx
interface WithAuthProps {
  isAuthenticated: boolean;
}

function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent({ isAuthenticated, ...props }: P & WithAuthProps) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

// Protected component
const ProtectedDashboard = withAuth(Dashboard);

// Usage
<ProtectedDashboard isAuthenticated={user !== null} />
```

---

## Real-World Example: Form Composition

```tsx
// ====== ATOMIC FORM COMPONENTS ======

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

function Label({ htmlFor, children, required }: LabelProps) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && <span className="required">*</span>}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

function Input({ error, ...props }: InputProps) {
  return (
    <>
      <input className={error ? 'input-error' : ''} {...props} />
      {error && <span className="error-text">{error}</span>}
    </>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
}

function FormGroup({ children }: FormGroupProps) {
  return <div className="form-group">{children}</div>;
}

// ====== COMPOSED FORM FIELD ======

interface FormFieldProps extends InputProps {
  label: string;
  name: string;
  required?: boolean;
}

function FormField({ label, name, required, ...inputProps }: FormFieldProps) {
  return (
    <FormGroup>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <Input id={name} name={name} required={required} {...inputProps} />
    </FormGroup>
  );
}

// ====== COMPLETE FORM ======

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(email, password);
  };

  return (
    <Card padding={32}>
      <form onSubmit={handleSubmit}>
        <Stack gap={16}>
          <h2>Login</h2>
          
          <FormField
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          
          <FormField
            label="Password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          
          <SubmitButton disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Stack>
      </form>
    </Card>
  );
}
```

---

## Key Composition Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility** | Each component does one thing well |
| **Reusability** | Components can be used in multiple places |
| **Composability** | Small components combine to build complex UIs |
| **Flexibility** | Components accept props to customize behavior |
| **Testability** | Smaller components are easier to test |

---

## Practice Exercise

Build a `NotificationSystem` by composing these components:
1. `NotificationIcon` - shows icon based on type
2. `NotificationMessage` - displays the message
3. `NotificationDismiss` - close button
4. `Notification` - composes all above
5. `NotificationList` - renders multiple notifications

Try it yourself first!
