# React TypeScript - UI Composition Patterns

## Overview

This guide covers practical UI composition patterns used in real-world applications. These patterns help build maintainable, reusable, and flexible user interfaces.

---

## Pattern 1: Layout Composition

### Basic Layout Components

```tsx
// ====== FLEX CONTAINER ======
interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
  wrap?: boolean;
  className?: string;
}

function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 0,
  wrap = false,
  className = ''
}: FlexProps) {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around'
  };

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justifyMap[justify],
        alignItems: alignMap[align],
        gap: `${gap}px`,
        flexWrap: wrap ? 'wrap' : 'nowrap'
      }}
    >
      {children}
    </div>
  );
}

// ====== GRID CONTAINER ======
interface GridProps {
  children: React.ReactNode;
  columns?: number | string;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  className?: string;
}

function Grid({
  children,
  columns = 1,
  gap = 16,
  rowGap,
  columnGap,
  className = ''
}: GridProps) {
  const gridTemplateColumns = typeof columns === 'number'
    ? `repeat(${columns}, 1fr)`
    : columns;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: `${rowGap ?? gap}px ${columnGap ?? gap}px`
      }}
    >
      {children}
    </div>
  );
}

// ====== USAGE ======
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Grid columns={3} gap={24}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
}

function Header() {
  return (
    <Flex justify="between" align="center" className="header">
      <Logo />
      <Navigation />
      <Flex gap={8}>
        <SearchButton />
        <CartButton />
        <UserMenu />
      </Flex>
    </Flex>
  );
}
```

---

## Pattern 2: Page Layout Pattern

```tsx
// ====== PAGE LAYOUT COMPONENTS ======

interface PageProps {
  children: React.ReactNode;
}

function Page({ children }: PageProps) {
  return <div className="page">{children}</div>;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}

interface PageBodyProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
}

function PageBody({ children, sidebar, sidebarPosition = 'left' }: PageBodyProps) {
  return (
    <div className={`page-body ${sidebar ? 'with-sidebar' : ''}`}>
      {sidebar && sidebarPosition === 'left' && (
        <aside className="page-sidebar">{sidebar}</aside>
      )}
      <main className="page-content">{children}</main>
      {sidebar && sidebarPosition === 'right' && (
        <aside className="page-sidebar">{sidebar}</aside>
      )}
    </div>
  );
}

interface PageFooterProps {
  children: React.ReactNode;
}

function PageFooter({ children }: PageFooterProps) {
  return <footer className="page-footer">{children}</footer>;
}

// Attach sub-components
Page.Header = PageHeader;
Page.Body = PageBody;
Page.Footer = PageFooter;

// ====== USAGE ======
function UsersPage() {
  return (
    <Page>
      <Page.Header
        title="Users"
        subtitle="Manage your team members"
        actions={
          <Button onClick={() => setShowModal(true)}>
            Add User
          </Button>
        }
      />
      <Page.Body
        sidebar={<UserFilters onFilter={handleFilter} />}
      >
        <UserTable users={filteredUsers} />
      </Page.Body>
    </Page>
  );
}

function DashboardPage() {
  return (
    <Page>
      <Page.Header title="Dashboard" />
      <Page.Body>
        <Grid columns={3} gap={24}>
          <StatCard title="Revenue" value="$45,231" />
          <StatCard title="Users" value="2,350" />
          <StatCard title="Orders" value="1,234" />
        </Grid>
        <RecentActivityChart />
      </Page.Body>
    </Page>
  );
}
```

---

## Pattern 3: List & Item Composition

```tsx
// ====== GENERIC LIST COMPONENTS ======

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found',
  loading = false,
  className = ''
}: ListProps<T>) {
  if (loading) {
    return <ListSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <ul className={`list ${className}`}>
      {items.map((item, index) => (
        <li key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// ====== LIST ITEM COMPONENT ======
interface ListItemContentProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

function ListItemContent({
  leading,
  title,
  subtitle,
  trailing,
  onClick
}: ListItemContentProps) {
  return (
    <div className="list-item-content" onClick={onClick}>
      {leading && <div className="list-item-leading">{leading}</div>}
      <div className="list-item-body">
        <div className="list-item-title">{title}</div>
        {subtitle && <div className="list-item-subtitle">{subtitle}</div>}
      </div>
      {trailing && <div className="list-item-trailing">{trailing}</div>}
    </div>
  );
}

// ====== USAGE ======
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      emptyMessage="No users found"
      renderItem={(user) => (
        <ListItemContent
          leading={<Avatar src={user.avatar} size="medium" />}
          title={user.name}
          subtitle={user.email}
          trailing={<Badge>{user.role}</Badge>}
          onClick={() => navigate(`/users/${user.id}`)}
        />
      )}
    />
  );
}

// With different item types
interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <List
      items={tasks}
      keyExtractor={(task) => task.id}
      renderItem={(task) => (
        <ListItemContent
          leading={
            <Checkbox
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
          }
          title={
            <span className={task.completed ? 'completed' : ''}>
              {task.title}
            </span>
          }
          subtitle={`Due: ${formatDate(task.dueDate)}`}
          trailing={<PriorityBadge priority={task.priority} />}
        />
      )}
    />
  );
}
```

---

## Pattern 4: Data Display Composition

```tsx
// ====== STAT CARD ======
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <Card.Content>
        <Flex justify="between" align="start">
          <div>
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
            {change && (
              <Flex align="center" gap={4}>
                <span className={`change change-${change.type}`}>
                  {change.type === 'increase' ? '↑' : '↓'}
                  {Math.abs(change.value)}%
                </span>
                <span className="change-label">from last month</span>
              </Flex>
            )}
          </div>
          {icon && <div className="stat-icon">{icon}</div>}
        </Flex>
      </Card.Content>
    </Card>
  );
}

// ====== DATA TABLE ======
interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  loading?: boolean;
}

function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  loading
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} />;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ====== USAGE ======
function OrdersTable({ orders }: { orders: Order[] }) {
  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order) => <code>#{order.id}</code>,
      width: '100px'
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <Flex align="center" gap={8}>
          <Avatar src={order.customer.avatar} size="small" />
          <span>{order.customer.name}</span>
        </Flex>
      )
    },
    {
      key: 'total',
      header: 'Total',
      render: (order) => `$${order.total.toFixed(2)}`,
      width: '100px'
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <StatusBadge status={order.status} />,
      width: '120px'
    },
    {
      key: 'date',
      header: 'Date',
      render: (order) => formatDate(order.createdAt),
      width: '150px'
    },
    {
      key: 'actions',
      header: '',
      render: (order) => (
        <Flex gap={4}>
          <IconButton icon={<ViewIcon />} onClick={() => viewOrder(order)} />
          <IconButton icon={<EditIcon />} onClick={() => editOrder(order)} />
        </Flex>
      ),
      width: '80px'
    }
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      keyExtractor={(order) => order.id}
      onRowClick={(order) => navigate(`/orders/${order.id}`)}
    />
  );
}
```

---

## Pattern 5: Modal & Dialog Composition

```tsx
// ====== DIALOG COMPONENTS ======
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

function Dialog({ open, onClose, children, size = 'medium' }: DialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog dialog-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="dialog-header">{children}</div>;
}

function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="dialog-title">{children}</h2>;
}

function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="dialog-content">{children}</div>;
}

function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="dialog-footer">{children}</div>;
}

// Attach sub-components
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;

// ====== PRE-BUILT DIALOGS ======

// Confirmation Dialog
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="small">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>
        <p>{message}</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Flex gap={8} justify="end">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

// ====== USAGE ======
function UserActions() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteUser(userId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
        Delete User
      </Button>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

// Custom Dialog with form
function EditUserDialog({ user, open, onClose, onSave }: EditUserDialogProps) {
  const [formData, setFormData] = useState(user);

  return (
    <Dialog open={open} onClose={onClose} size="medium">
      <Dialog.Header>
        <Dialog.Title>Edit User</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>
        <Form.Field>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Input
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Input
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Form.Field>
      </Dialog.Content>
      <Dialog.Footer>
        <Flex gap={8} justify="end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            Save Changes
          </Button>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}
```

---

## Pattern 6: Empty States & Loading Composition

```tsx
// ====== EMPTY STATE ======
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Flex direction="column" align="center" gap={16} className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </Flex>
  );
}

// ====== LOADING STATES ======
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

function Skeleton({ width = '100%', height = 16, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={`skeleton skeleton-${variant}`}
      style={{ width, height }}
    />
  );
}

// Card skeleton
function CardSkeleton() {
  return (
    <Card>
      <Card.Content>
        <Flex gap={12} align="center">
          <Skeleton variant="circular" width={48} height={48} />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={14} />
          </div>
        </Flex>
      </Card.Content>
    </Card>
  );
}

// List skeleton
function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="list-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <Flex key={i} gap={12} align="center" className="list-skeleton-item">
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton width="70%" />
            <Skeleton width="50%" />
          </div>
        </Flex>
      ))}
    </div>
  );
}

// ====== ASYNC STATE WRAPPER ======
interface AsyncStateProps<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

function AsyncState<T>({
  loading,
  error,
  data,
  loadingComponent = <ListSkeleton />,
  errorComponent = (err) => <ErrorMessage error={err} />,
  emptyComponent = <EmptyState title="No data found" />,
  children
}: AsyncStateProps<T>) {
  if (loading) return <>{loadingComponent}</>;
  if (error) return <>{errorComponent(error)}</>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <>{emptyComponent}</>;
  return <>{children(data)}</>;
}

// ====== USAGE ======
function UserListPage() {
  const { data: users, loading, error } = useFetch<User[]>('/api/users');

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={users}
      loadingComponent={<ListSkeleton count={10} />}
      emptyComponent={
        <EmptyState
          icon={<UsersIcon />}
          title="No users yet"
          description="Get started by adding your first team member"
          action={<Button onClick={openAddModal}>Add User</Button>}
        />
      }
    >
      {(users) => <UserList users={users} />}
    </AsyncState>
  );
}
```

---

## Pattern 7: Responsive Composition

```tsx
// ====== RESPONSIVE HELPER COMPONENTS ======
interface ShowOnProps {
  children: React.ReactNode;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

function ShowOnMobile({ children }: { children: React.ReactNode }) {
  return <div className="show-mobile">{children}</div>;
}

function ShowOnDesktop({ children }: { children: React.ReactNode }) {
  return <div className="show-desktop">{children}</div>;
}

function HideOnMobile({ children }: { children: React.ReactNode }) {
  return <div className="hide-mobile">{children}</div>;
}

// ====== RESPONSIVE NAVIGATION ======
function Navigation() {
  return (
    <>
      {/* Desktop Navigation */}
      <HideOnMobile>
        <nav className="desktop-nav">
          <Flex gap={24}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </Flex>
        </nav>
      </HideOnMobile>

      {/* Mobile Navigation */}
      <ShowOnMobile>
        <MobileMenu />
      </ShowOnMobile>
    </>
  );
}

// ====== RESPONSIVE GRID ======
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}

function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16
}: ResponsiveGridProps) {
  return (
    <div
      className="responsive-grid"
      style={{
        '--cols-mobile': cols.mobile,
        '--cols-tablet': cols.tablet,
        '--cols-desktop': cols.desktop,
        '--gap': `${gap}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// CSS for ResponsiveGrid:
// .responsive-grid {
//   display: grid;
//   gap: var(--gap);
//   grid-template-columns: repeat(var(--cols-mobile), 1fr);
// }
// @media (min-width: 768px) {
//   .responsive-grid { grid-template-columns: repeat(var(--cols-tablet), 1fr); }
// }
// @media (min-width: 1024px) {
//   .responsive-grid { grid-template-columns: repeat(var(--cols-desktop), 1fr); }
// }

// ====== USAGE ======
function ProductsPage() {
  return (
    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={24}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ResponsiveGrid>
  );
}
```

---

## Summary: When to Use Each Pattern

| Pattern | Use Case |
|---------|----------|
| **Layout Components** | Consistent spacing, alignment, containers |
| **Page Layout** | Standard page structure with header/body/footer |
| **List & Item** | Any list of data with consistent item layout |
| **Data Display** | Stats, tables, data visualization |
| **Modal/Dialog** | User confirmations, forms, detailed views |
| **Empty/Loading** | Handle async states gracefully |
| **Responsive** | Adapt UI across screen sizes |

---

## Best Practices

1. **Start with small, focused components**
2. **Compose larger UIs from smaller pieces**
3. **Use TypeScript for prop type safety**
4. **Create reusable layout primitives (Flex, Grid, Stack)**
5. **Handle loading, error, and empty states consistently**
6. **Build compound components for related UI elements**
7. **Test components in isolation**
