# React TypeScript - Compound Components Pattern

## What are Compound Components?

Compound components are a pattern where multiple components work together to form a complete UI element, sharing an implicit state. Think of HTML's `<select>` and `<option>` - they only make sense together.

**Benefits:**
- Flexible API for consumers
- Components communicate behind the scenes
- Clean, declarative usage

---

## Step 1: Basic Compound Component

### Simple Toggle Switch

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Create context for shared state
interface ToggleContextType {
  isOn: boolean;
  toggle: () => void;
}

const ToggleContext = createContext<ToggleContextType | null>(null);

// 2. Custom hook to access context
function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('Toggle components must be used within a Toggle');
  }
  return context;
}

// 3. Parent component - provides state
interface ToggleProps {
  children: ReactNode;
  initialValue?: boolean;
  onToggle?: (isOn: boolean) => void;
}

function Toggle({ children, initialValue = false, onToggle }: ToggleProps) {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onToggle?.(newValue);
  };

  return (
    <ToggleContext.Provider value={{ isOn, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

// 4. Child components - consume state
function ToggleButton() {
  const { isOn, toggle } = useToggle();
  return (
    <button onClick={toggle} className={`toggle-btn ${isOn ? 'on' : 'off'}`}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}

function ToggleStatus() {
  const { isOn } = useToggle();
  return <span>The toggle is {isOn ? 'on' : 'off'}</span>;
}

// 5. Attach child components to parent
Toggle.Button = ToggleButton;
Toggle.Status = ToggleStatus;

// Usage - clean, declarative API!
<Toggle onToggle={(isOn) => console.log('Toggled:', isOn)}>
  <Toggle.Button />
  <Toggle.Status />
</Toggle>
```

---

## Step 2: Menu Compound Component

```tsx
import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

// ====== CONTEXT ======
interface MenuContextType {
  isOpen: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu');
  }
  return context;
}

// ====== PARENT COMPONENT ======
interface MenuProps {
  children: ReactNode;
}

function Menu({ children }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <MenuContext.Provider value={{ isOpen, activeIndex, setActiveIndex, toggleMenu, closeMenu }}>
      <div ref={menuRef} className="menu-container">
        {children}
      </div>
    </MenuContext.Provider>
  );
}

// ====== CHILD COMPONENTS ======
interface MenuButtonProps {
  children: ReactNode;
}

function MenuButton({ children }: MenuButtonProps) {
  const { isOpen, toggleMenu } = useMenu();
  
  return (
    <button 
      onClick={toggleMenu}
      aria-expanded={isOpen}
      className="menu-button"
    >
      {children}
      <span className="menu-arrow">{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

interface MenuListProps {
  children: ReactNode;
}

function MenuList({ children }: MenuListProps) {
  const { isOpen } = useMenu();
  
  if (!isOpen) return null;
  
  return (
    <ul className="menu-list" role="menu">
      {children}
    </ul>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function MenuItem({ children, onClick, disabled = false }: MenuItemProps) {
  const { closeMenu } = useMenu();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    closeMenu();
  };

  return (
    <li 
      className={`menu-item ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      role="menuitem"
    >
      {children}
    </li>
  );
}

interface MenuDividerProps {}

function MenuDivider({}: MenuDividerProps) {
  return <li className="menu-divider" role="separator" />;
}

// ====== ATTACH CHILD COMPONENTS ======
Menu.Button = MenuButton;
Menu.List = MenuList;
Menu.Item = MenuItem;
Menu.Divider = MenuDivider;

export { Menu };

// ====== USAGE ======
function UserMenu() {
  return (
    <Menu>
      <Menu.Button>
        <Avatar src="/user.jpg" size="small" />
        John Doe
      </Menu.Button>
      <Menu.List>
        <Menu.Item onClick={() => navigate('/profile')}>
          Profile
        </Menu.Item>
        <Menu.Item onClick={() => navigate('/settings')}>
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

---

## Step 3: Tabs Compound Component

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// ====== TYPES ======
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }
  return context;
}

// ====== TABS COMPONENT ======
interface TabsProps {
  children: ReactNode;
  defaultTab: string;
  onChange?: (tabId: string) => void;
}

function Tabs({ children, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSetActiveTab = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// ====== TAB LIST ======
interface TabListProps {
  children: ReactNode;
  className?: string;
}

function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`tab-list ${className}`} role="tablist">
      {children}
    </div>
  );
}

// ====== TAB ======
interface TabProps {
  children: ReactNode;
  id: string;
  disabled?: boolean;
}

function Tab({ children, id, disabled = false }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      className={`tab ${isActive ? 'tab-active' : ''} ${disabled ? 'tab-disabled' : ''}`}
      onClick={() => !disabled && setActiveTab(id)}
    >
      {children}
    </button>
  );
}

// ====== TAB PANELS CONTAINER ======
interface TabPanelsProps {
  children: ReactNode;
}

function TabPanels({ children }: TabPanelsProps) {
  return <div className="tab-panels">{children}</div>;
}

// ====== TAB PANEL ======
interface TabPanelProps {
  children: ReactNode;
  id: string;
}

function TabPanel({ children, id }: TabPanelProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== id) return null;
  
  return (
    <div className="tab-panel" role="tabpanel">
      {children}
    </div>
  );
}

// ====== ATTACH SUB-COMPONENTS ======
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

export { Tabs };

// ====== USAGE ======
function ProductPage() {
  return (
    <Tabs defaultTab="description" onChange={(tab) => console.log('Active:', tab)}>
      <Tabs.List>
        <Tabs.Tab id="description">Description</Tabs.Tab>
        <Tabs.Tab id="specifications">Specifications</Tabs.Tab>
        <Tabs.Tab id="reviews">Reviews (24)</Tabs.Tab>
        <Tabs.Tab id="shipping" disabled>Shipping</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panels>
        <Tabs.Panel id="description">
          <h3>Product Description</h3>
          <p>This is an amazing product...</p>
        </Tabs.Panel>
        
        <Tabs.Panel id="specifications">
          <h3>Technical Specifications</h3>
          <ul>
            <li>Weight: 500g</li>
            <li>Dimensions: 10x20x5 cm</li>
          </ul>
        </Tabs.Panel>
        
        <Tabs.Panel id="reviews">
          <h3>Customer Reviews</h3>
          <ReviewsList productId={123} />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

---

## Step 4: Select/Dropdown Compound Component

```tsx
import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

// ====== TYPES ======
interface SelectContextType {
  isOpen: boolean;
  selectedValue: string | null;
  selectedLabel: string;
  setSelected: (value: string, label: string) => void;
  toggleOpen: () => void;
  closeDropdown: () => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within Select');
  }
  return context;
}

// ====== SELECT COMPONENT ======
interface SelectProps {
  children: ReactNode;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

function Select({ children, value, placeholder = 'Select...', onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(value || null);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setSelected = (value: string, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        selectedValue,
        selectedLabel,
        setSelected,
        toggleOpen: () => setIsOpen(prev => !prev),
        closeDropdown: () => setIsOpen(false)
      }}
    >
      <div ref={selectRef} className="select-container">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// ====== TRIGGER ======
function SelectTrigger() {
  const { isOpen, selectedLabel, toggleOpen } = useSelect();

  return (
    <button
      type="button"
      className={`select-trigger ${isOpen ? 'open' : ''}`}
      onClick={toggleOpen}
      aria-expanded={isOpen}
    >
      <span>{selectedLabel}</span>
      <span className="select-arrow">{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

// ====== OPTIONS LIST ======
interface SelectOptionsProps {
  children: ReactNode;
}

function SelectOptions({ children }: SelectOptionsProps) {
  const { isOpen } = useSelect();
  
  if (!isOpen) return null;
  
  return (
    <ul className="select-options" role="listbox">
      {children}
    </ul>
  );
}

// ====== OPTION ======
interface SelectOptionProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}

function SelectOption({ children, value, disabled = false }: SelectOptionProps) {
  const { selectedValue, setSelected } = useSelect();
  const isSelected = selectedValue === value;
  const label = typeof children === 'string' ? children : value;

  return (
    <li
      className={`select-option ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && setSelected(value, label)}
      role="option"
      aria-selected={isSelected}
    >
      {children}
      {isSelected && <span className="check">✓</span>}
    </li>
  );
}

// ====== ATTACH ======
Select.Trigger = SelectTrigger;
Select.Options = SelectOptions;
Select.Option = SelectOption;

export { Select };

// ====== USAGE ======
function CountrySelector() {
  const [country, setCountry] = useState('');

  return (
    <Select value={country} onChange={setCountry} placeholder="Select country">
      <Select.Trigger />
      <Select.Options>
        <Select.Option value="us">United States</Select.Option>
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="ca">Canada</Select.Option>
        <Select.Option value="au">Australia</Select.Option>
        <Select.Option value="in">India</Select.Option>
      </Select.Options>
    </Select>
  );
}
```

---

## Step 5: Card Compound Component

```tsx
import { ReactNode } from 'react';

// Simple compound component without context
// (when children don't need to share state)

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  className?: string;
}

function Card({ children, variant = 'default', className = '' }: CardProps) {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

function CardTitle({ children, as: Tag = 'h3' }: CardTitleProps) {
  return <Tag className="card-title">{children}</Tag>;
}

interface CardDescriptionProps {
  children: ReactNode;
}

function CardDescription({ children }: CardDescriptionProps) {
  return <p className="card-description">{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`card-image ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export { Card };

// ====== USAGE ======

// Basic card
<Card>
  <Card.Header>
    <Card.Title>Welcome</Card.Title>
    <Card.Description>Get started with our platform</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Main content goes here...</p>
  </Card.Content>
</Card>

// Product card
<Card variant="elevated">
  <Card.Image src="/product.jpg" alt="Product" />
  <Card.Content>
    <Card.Title>Wireless Headphones</Card.Title>
    <Card.Description>Premium sound quality</Card.Description>
    <p className="price">$199.99</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Add to Cart</Button>
    <Button variant="secondary">Wishlist</Button>
  </Card.Footer>
</Card>

// User profile card
<Card variant="bordered">
  <Card.Header>
    <Avatar src="/user.jpg" size="large" />
    <Card.Title>John Doe</Card.Title>
    <Card.Description>Software Engineer</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Bio: Passionate about building great products...</p>
  </Card.Content>
  <Card.Footer>
    <Button>Follow</Button>
    <Button variant="secondary">Message</Button>
  </Card.Footer>
</Card>
```

---

## Step 6: Form Compound Component

```tsx
import { createContext, useContext, useState, ReactNode, FormEvent } from 'react';

// ====== TYPES ======
type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

interface FormContextType {
  values: FormValues;
  errors: FormErrors;
  setValue: (name: string, value: string) => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
}

const FormContext = createContext<FormContextType | null>(null);

function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within Form');
  }
  return context;
}

// ====== FORM COMPONENT ======
interface FormProps {
  children: ReactNode;
  onSubmit: (values: FormValues) => void;
  initialValues?: FormValues;
}

function Form({ children, onSubmit, initialValues = {} }: FormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const setValue = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setError = (name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const clearError = (name: string) => {
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <FormContext.Provider value={{ values, errors, setValue, setError, clearError }}>
      <form onSubmit={handleSubmit} className="form">
        {children}
      </form>
    </FormContext.Provider>
  );
}

// ====== FORM FIELD ======
interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

function FormField({ children, className = '' }: FormFieldProps) {
  return <div className={`form-field ${className}`}>{children}</div>;
}

// ====== LABEL ======
interface FormLabelProps {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
}

function FormLabel({ children, htmlFor, required }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {children}
      {required && <span className="required">*</span>}
    </label>
  );
}

// ====== INPUT ======
interface FormInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function FormInput({ name, type = 'text', placeholder, required }: FormInputProps) {
  const { values, errors, setValue, clearError } = useFormContext();

  return (
    <>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name] || ''}
        onChange={(e) => {
          setValue(name, e.target.value);
          clearError(name);
        }}
        placeholder={placeholder}
        required={required}
        className={`form-input ${errors[name] ? 'input-error' : ''}`}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </>
  );
}

// ====== TEXTAREA ======
interface FormTextareaProps {
  name: string;
  placeholder?: string;
  rows?: number;
}

function FormTextarea({ name, placeholder, rows = 4 }: FormTextareaProps) {
  const { values, errors, setValue, clearError } = useFormContext();

  return (
    <>
      <textarea
        id={name}
        name={name}
        value={values[name] || ''}
        onChange={(e) => {
          setValue(name, e.target.value);
          clearError(name);
        }}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${errors[name] ? 'input-error' : ''}`}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </>
  );
}

// ====== SUBMIT BUTTON ======
interface FormSubmitProps {
  children: ReactNode;
  disabled?: boolean;
}

function FormSubmit({ children, disabled }: FormSubmitProps) {
  return (
    <button type="submit" className="form-submit" disabled={disabled}>
      {children}
    </button>
  );
}

// ====== ATTACH ======
Form.Field = FormField;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Textarea = FormTextarea;
Form.Submit = FormSubmit;

export { Form };

// ====== USAGE ======
function ContactForm() {
  const handleSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
    // Send to API
  };

  return (
    <Form onSubmit={handleSubmit} initialValues={{ name: '', email: '' }}>
      <Form.Field>
        <Form.Label htmlFor="name" required>Name</Form.Label>
        <Form.Input name="name" placeholder="Your name" required />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="email" required>Email</Form.Label>
        <Form.Input name="email" type="email" placeholder="your@email.com" required />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="message">Message</Form.Label>
        <Form.Textarea name="message" placeholder="Your message..." rows={5} />
      </Form.Field>

      <Form.Submit>Send Message</Form.Submit>
    </Form>
  );
}
```

---

## When to Use Compound Components

| Use Compound Components When | Example |
|------------------------------|---------|
| Components share implicit state | Tabs, Accordion |
| Need flexible composition | Menu with various items |
| Related components work together | Select with options |
| Building component libraries | UI kit components |

| Avoid When |
|------------|
| Simple, single-purpose components |
| Components don't need to communicate |
| The API would be overly complex |

---

## Key Takeaways

1. **Context** enables state sharing without prop drilling
2. **Custom hooks** provide type-safe access to context
3. **Attach sub-components** to parent using dot notation
4. Works great for **tabs, menus, forms, and accordions**
5. Provides **flexible, declarative APIs** for consumers
