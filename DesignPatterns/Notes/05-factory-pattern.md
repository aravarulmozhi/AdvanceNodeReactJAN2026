# Chapter 5: Factory Pattern

> **Category:** Creational Pattern

---

## What is Factory?

The Factory pattern provides an interface for creating objects without specifying the exact class of object that will be created.

---

## When to Use

- Creating objects with varying implementations
- When the exact type is determined at runtime
- Centralizing object creation logic
- Supporting multiple related object types

---

## Structure

```
┌──────────────────┐     creates     ┌──────────────────┐
│     Factory      │ ──────────────► │     Product      │
├──────────────────┤                 ├──────────────────┤
│ + create(type)   │                 │ + interface      │
└──────────────────┘                 └──────────────────┘
                                              △
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
          ┌─────────┴────────┐     ┌─────────┴────────┐     ┌─────────┴────────┐
          │   ProductA       │     │   ProductB       │     │   ProductC       │
          └──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## Implementation in TypeScript

```typescript
// Product Interface
interface INotification {
  send(message: string, recipient: string): void;
}

// Concrete Products
class EmailNotification implements INotification {
  send(message: string, recipient: string): void {
    console.log(`📧 EMAIL to ${recipient}: ${message}`);
  }
}

class SMSNotification implements INotification {
  send(message: string, recipient: string): void {
    console.log(`📱 SMS to ${recipient}: ${message}`);
  }
}

class PushNotification implements INotification {
  send(message: string, recipient: string): void {
    console.log(`🔔 PUSH to ${recipient}: ${message}`);
  }
}

// Factory
type NotificationType = 'email' | 'sms' | 'push';

class NotificationFactory {
  static create(type: NotificationType): INotification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

export { NotificationFactory, INotification, NotificationType };
```

---

## Usage Example

```typescript
// Client code doesn't know about concrete classes
const emailNotif = NotificationFactory.create('email');
emailNotif.send('Welcome!', 'user@example.com');

const smsNotif = NotificationFactory.create('sms');
smsNotif.send('Your code is 1234', '+1234567890');

const pushNotif = NotificationFactory.create('push');
pushNotif.send('New message!', 'device-token-123');
```

---

## Real-World Example: User Factory

```typescript
interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

class AdminUser implements User {
  constructor(public id: string, public name: string) {}
  role = 'admin';
  permissions = ['read', 'write', 'delete', 'manage'];
}

class RegularUser implements User {
  constructor(public id: string, public name: string) {}
  role = 'user';
  permissions = ['read', 'write'];
}

class GuestUser implements User {
  constructor(public id: string, public name: string) {}
  role = 'guest';
  permissions = ['read'];
}

class UserFactory {
  static createUser(type: string, id: string, name: string): User {
    switch (type) {
      case 'admin':
        return new AdminUser(id, name);
      case 'user':
        return new RegularUser(id, name);
      case 'guest':
        return new GuestUser(id, name);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}
```

---

## Factory with Registration

```typescript
class NotificationFactoryRegistry {
  private static creators: Map<string, () => INotification> = new Map();

  static register(type: string, creator: () => INotification): void {
    this.creators.set(type, creator);
  }

  static create(type: string): INotification {
    const creator = this.creators.get(type);
    if (!creator) {
      throw new Error(`Unknown notification type: ${type}`);
    }
    return creator();
  }
}

// Register at startup
NotificationFactoryRegistry.register('email', () => new EmailNotification());
NotificationFactoryRegistry.register('sms', () => new SMSNotification());
NotificationFactoryRegistry.register('slack', () => new SlackNotification());
```

---

## Pros and Cons

### ✅ Pros
- Loose coupling between creator and products
- Single Responsibility Principle
- Open/Closed Principle - easy to add new types
- Centralized creation logic

### ❌ Cons
- Can lead to many subclasses
- Requires all products to share interface
- Switch statement can grow large

---

**Previous:** [Singleton Pattern](04-singleton-pattern.md) | **Next:** [MVC Pattern](06-mvc-pattern.md)
