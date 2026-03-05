# Solution 2: Factory Pattern

---

## Complete Implementation

```typescript
// src/patterns/factory/NotificationFactory.ts

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

class SlackNotification implements INotification {
  send(message: string, recipient: string): void {
    console.log(`💬 SLACK to ${recipient}: ${message}`);
  }
}

// Type for valid notification types
type NotificationType = 'email' | 'sms' | 'push' | 'slack';

// Factory Class
class NotificationFactory {
  static create(type: NotificationType): INotification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      case 'slack':
        return new SlackNotification();
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
// test-factory.ts

import { NotificationFactory } from './patterns/factory/NotificationFactory';

// Create different notification types
const emailNotif = NotificationFactory.create('email');
emailNotif.send('Welcome to our platform!', 'user@example.com');

const smsNotif = NotificationFactory.create('sms');
smsNotif.send('Your verification code is 123456', '+1234567890');

const pushNotif = NotificationFactory.create('push');
pushNotif.send('You have a new message!', 'device-token-abc123');

const slackNotif = NotificationFactory.create('slack');
slackNotif.send('Build completed successfully', '#deployments');

// Error case
try {
  NotificationFactory.create('unknown' as any);
} catch (error) {
  console.log('Error:', error.message);
}
```

---

## Output

```
📧 EMAIL to user@example.com: Welcome to our platform!
📱 SMS to +1234567890: Your verification code is 123456
🔔 PUSH to device-token-abc123: You have a new message!
💬 SLACK to #deployments: Build completed successfully
Error: Unknown notification type: unknown
```

---

## Bonus: Factory with Registration

```typescript
// Advanced factory with dynamic registration

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

  static getTypes(): string[] {
    return Array.from(this.creators.keys());
  }
}

// Register at application startup
NotificationFactoryRegistry.register('email', () => new EmailNotification());
NotificationFactoryRegistry.register('sms', () => new SMSNotification());
NotificationFactoryRegistry.register('push', () => new PushNotification());

// Usage
const notif = NotificationFactoryRegistry.create('email');
notif.send('Hello', 'user@test.com');

console.log('Available types:', NotificationFactoryRegistry.getTypes());
// ['email', 'sms', 'push']
```

---

## Key Points

1. **Interface defines contract** - All notifications must implement `send()`
2. **Factory hides creation logic** - Client doesn't know about concrete classes
3. **Easy to extend** - Add new types without changing client code
4. **Type safety** - TypeScript ensures only valid types are used

---

**Challenge:** [02-factory-challenge.md](../challenge/02-factory-challenge.md)
