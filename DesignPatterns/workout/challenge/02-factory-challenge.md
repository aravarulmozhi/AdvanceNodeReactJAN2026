# Challenge 2: Factory Pattern

> **Difficulty:** ⭐⭐ Medium  
> **Estimated Time:** 45 minutes

---

## Node.js Project Setup

### Quick Start
```bash
mkdir factory-challenge && cd factory-challenge
npm init -y
npm install --save-dev typescript ts-node @types/node
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "dev": "ts-node src/index.ts"
  }
}
```

### Directory Structure
```
src/
├── patterns/
│   └── factory/
│       └── NotificationFactory.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Create a notification factory that produces different types of notifications.

---

## Requirements

1. Create an interface `INotification` with method:
   - `send(message: string, recipient: string): void`

2. Implement three notification types:
   - `EmailNotification` - Logs email sending
   - `SMSNotification` - Logs SMS sending
   - `PushNotification` - Logs push notification

3. Create a `NotificationFactory` class with a static `create(type)` method

4. Factory should throw error for unknown types

---

## Acceptance Criteria

```typescript
const emailNotif = NotificationFactory.create('email');
emailNotif.send('Welcome!', 'user@example.com');
// Output: 📧 EMAIL to user@example.com: Welcome!

const smsNotif = NotificationFactory.create('sms');
smsNotif.send('Your code is 1234', '+1234567890');
// Output: 📱 SMS to +1234567890: Your code is 1234

const pushNotif = NotificationFactory.create('push');
pushNotif.send('New message!', 'device-token');
// Output: 🔔 PUSH to device-token: New message!

// Should throw error
NotificationFactory.create('unknown'); // Error: Unknown notification type
```

---

## File Structure

```
src/
└── patterns/
    └── factory/
        └── NotificationFactory.ts
```

---

## Hints

- Define a type union for valid notification types
- Use a switch statement in the factory
- Each notification class implements the interface

---

## Bonus Challenge

- Add a `SlackNotification` type
- Implement a factory registry pattern
- Add configuration options to each notification type

---

**Solution:** [02-factory-solution.md](../solutions/02-factory-solution.md)
