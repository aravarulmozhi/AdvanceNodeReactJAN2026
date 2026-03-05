# Problems That Factory Pattern Resolves

---

## Problem 1: Tight Coupling Between Client and Concrete Classes

### ❌ Without Factory Pattern

```typescript
class OrderService {
  sendConfirmation(orderDetails: any) {
    // Client directly creates concrete class
    const notification = new EmailNotification();
    notification.send('Order confirmed', orderDetails.email);
  }
}
```

**Issues:**
- `OrderService` is tightly coupled to `EmailNotification`
- Changing notification type requires modifying `OrderService`
- Hard to test - can't easily mock the notification

### ✅ With Factory Pattern

```typescript
class OrderService {
  sendConfirmation(orderDetails: any, notificationType: NotificationType) {
    const notification = NotificationFactory.create(notificationType);
    notification.send('Order confirmed', orderDetails.recipient);
  }
}
```

**Benefits:**
- `OrderService` only knows about the interface
- Easy to switch notification types at runtime
- Easy to test with mock factory

---

## Problem 2: Scattered Object Creation Logic

### ❌ Without Factory Pattern

```typescript
// In file1.ts
const admin = new AdminUser();
admin.permissions = ['read', 'write', 'delete', 'manage'];
admin.role = 'admin';

// In file2.ts
const admin2 = new AdminUser();
admin2.permissions = ['read', 'write', 'delete']; // Oops! Missing 'manage'
admin2.role = 'admin';

// In file3.ts
const admin3 = new AdminUser();
admin3.permissions = ['read', 'write', 'delete', 'manage'];
admin3.role = 'Admin'; // Oops! Inconsistent casing
```

**Issues:**
- Duplicated creation logic across the codebase
- Inconsistent object initialization
- Hard to enforce creation rules

### ✅ With Factory Pattern

```typescript
// All creation logic in one place
class UserFactory {
  static createAdmin(id: string, name: string): User {
    return new AdminUser(id, name); // Always consistent
  }
}

// Usage everywhere
const admin1 = UserFactory.createAdmin('1', 'John');
const admin2 = UserFactory.createAdmin('2', 'Jane');
```

**Benefits:**
- Single source of truth for object creation
- Consistent initialization every time
- Easy to update creation logic in one place

---

## Problem 3: Violation of Open/Closed Principle

### ❌ Without Factory Pattern

```typescript
class NotificationService {
  send(type: string, message: string, recipient: string) {
    // Adding new type requires modifying this class
    if (type === 'email') {
      const email = new EmailNotification();
      email.send(message, recipient);
    } else if (type === 'sms') {
      const sms = new SMSNotification();
      sms.send(message, recipient);
    }
    // Need to add more else-if for each new type
  }
}
```

**Issues:**
- Must modify existing code to add new notification types
- Risk of breaking existing functionality
- Growing complexity in client code

### ✅ With Factory Pattern (Registry)

```typescript
// Add new types without modifying existing code
NotificationFactoryRegistry.register('slack', () => new SlackNotification());
NotificationFactoryRegistry.register('telegram', () => new TelegramNotification());

// Client code remains unchanged
const notification = NotificationFactoryRegistry.create(type);
notification.send(message, recipient);
```

**Benefits:**
- Open for extension (add new types)
- Closed for modification (no changes to existing code)
- Clean separation of concerns

---

## Problem 4: Complex Object Construction

### ❌ Without Factory Pattern

```typescript
// Complex setup repeated everywhere
const dbConnection = new DatabaseConnection();
dbConnection.setHost('localhost');
dbConnection.setPort(5432);
dbConnection.setUsername(process.env.DB_USER);
dbConnection.setPassword(process.env.DB_PASS);
dbConnection.setPoolSize(10);
dbConnection.enableSSL();
await dbConnection.connect();
```

**Issues:**
- Complex setup logic scattered across codebase
- Easy to forget configuration steps
- Hard to maintain consistency

### ✅ With Factory Pattern

```typescript
class DatabaseConnectionFactory {
  static createProduction(): DatabaseConnection {
    const conn = new DatabaseConnection();
    conn.setHost(process.env.DB_HOST);
    conn.setPort(5432);
    conn.setUsername(process.env.DB_USER);
    conn.setPassword(process.env.DB_PASS);
    conn.setPoolSize(10);
    conn.enableSSL();
    return conn;
  }

  static createDevelopment(): DatabaseConnection {
    const conn = new DatabaseConnection();
    conn.setHost('localhost');
    conn.setPort(5432);
    conn.setUsername('dev');
    conn.setPassword('dev');
    conn.setPoolSize(2);
    return conn;
  }
}

// Simple usage
const db = DatabaseConnectionFactory.createProduction();
```

---

## Problem 5: Difficulty in Testing

### ❌ Without Factory Pattern

```typescript
class PaymentProcessor {
  processPayment(amount: number) {
    // Direct instantiation - hard to mock
    const gateway = new StripeGateway();
    return gateway.charge(amount);
  }
}

// Testing becomes difficult
// How do you test without actually charging a card?
```

### ✅ With Factory Pattern

```typescript
class PaymentProcessor {
  constructor(private gatewayFactory: PaymentGatewayFactory) {}

  processPayment(amount: number) {
    const gateway = this.gatewayFactory.create();
    return gateway.charge(amount);
  }
}

// Easy to test with mock factory
class MockPaymentGatewayFactory implements PaymentGatewayFactory {
  create() {
    return new MockPaymentGateway(); // Returns mock for testing
  }
}

const processor = new PaymentProcessor(new MockPaymentGatewayFactory());
```

---

## Summary Table

| Problem | Without Factory | With Factory |
|---------|-----------------|--------------|
| Tight Coupling | Client knows concrete classes | Client only knows interface |
| Scattered Logic | Creation code duplicated | Centralized creation |
| Adding New Types | Modify existing code | Register new types |
| Complex Setup | Repeated everywhere | Encapsulated in factory |
| Testing | Hard to mock dependencies | Easy to inject mocks |

---

**Related:** [Factory Pattern](05-factory-pattern.md)
