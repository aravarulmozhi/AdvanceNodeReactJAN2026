# Problem: Factory Pattern - Tight Coupling and Scattered Object Creation

## Node.js Project Setup

### Quick Start
```bash
mkdir factory-pattern-problem && cd factory-pattern-problem
npm init -y
npm install --save-dev typescript ts-node @types/node
```

### Create tsconfig.json
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

### Add to package.json scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/problem.ts",
    "dev": "ts-node src/problem.ts"
  }
}
```

### Run Code
```bash
npm start
```

---

## The Problem

Save this code in `src/problem.ts` and run `npm start`:

```typescript
/**
 * PROBLEM: Tight Coupling and Scattered Object Creation
 * 
 * Scenario: You have a notification system where different services
 * directly instantiate notification classes. This creates tight coupling
 * and makes it hard to add new notification types or change implementations.
 */

// === Types ===
interface OrderDetails {
    email: string;
    phone: string;
    deviceToken: string;
    amount: number;
}

// === Notification Classes ===
class EmailNotification {
    constructor() {
        console.log("Creating EmailNotification instance");
    }

    send(message: string, recipient: string): void {
        console.log(`📧 EMAIL to ${recipient}: ${message}`);
    }
}

class SMSNotification {
    constructor() {
        console.log("Creating SMSNotification instance");
    }

    send(message: string, recipient: string): void {
        console.log(`📱 SMS to ${recipient}: ${message}`);
    }
}

class PushNotification {
    constructor() {
        console.log("Creating PushNotification instance");
    }

    send(message: string, recipient: string): void {
        console.log(`🔔 PUSH to ${recipient}: ${message}`);
    }
}

// === orderService.ts - Tightly coupled to EmailNotification ===
class OrderService {
    confirmOrder(orderDetails: OrderDetails): void {
        // ❌ PROBLEM: Directly creating concrete class
        const notification = new EmailNotification();
        notification.send(`Order confirmed! Amount: $${orderDetails.amount}`, orderDetails.email);
    }

    // What if we want SMS? We have to modify this class!
    confirmOrderViaSMS(orderDetails: OrderDetails): void {
        // ❌ PROBLEM: Another direct instantiation
        const notification = new SMSNotification();
        notification.send(`Order confirmed! Amount: $${orderDetails.amount}`, orderDetails.phone);
    }

    // And for Push? Yet another method!
    confirmOrderViaPush(orderDetails: OrderDetails): void {
        // ❌ PROBLEM: More tight coupling
        const notification = new PushNotification();
        notification.send(`Order confirmed! Amount: $${orderDetails.amount}`, orderDetails.deviceToken);
    }
}

// === shippingService.ts - Same problems repeated! ===
class ShippingService {
    notifyShipped(orderDetails: OrderDetails): void {
        // ❌ PROBLEM: Duplicated creation logic
        const notification = new EmailNotification();
        notification.send("Your order has shipped!", orderDetails.email);
    }
}

// === paymentService.ts - Even more duplication! ===
class PaymentService {
    notifyPaymentReceived(orderDetails: OrderDetails): void {
        // ❌ PROBLEM: Scattered object creation
        const notification = new EmailNotification();
        notification.send("Payment received!", orderDetails.email);
    }
}

// Run this to see the problem
console.log("=== THE PROBLEM: Tight Coupling & Scattered Creation ===\n");

const order: OrderDetails = {
    email: "user@example.com",
    phone: "+1234567890",
    deviceToken: "device-abc-123",
    amount: 99.99
};

const orderService = new OrderService();
const shippingService = new ShippingService();
const paymentService = new PaymentService();

console.log("--- Order Confirmation (3 different methods for 3 notification types!) ---");
orderService.confirmOrder(order);
orderService.confirmOrderViaSMS(order);
orderService.confirmOrderViaPush(order);

console.log("\n--- Shipping Notification ---");
shippingService.notifyShipped(order);

console.log("\n--- Payment Notification ---");
paymentService.notifyPaymentReceived(order);

console.log("\n❌ PROBLEM 1: OrderService has 3 separate methods for each notification type");
console.log("❌ PROBLEM 2: Adding a new notification type (WhatsApp?) requires changing ALL services");
console.log("❌ PROBLEM 3: Each service is tightly coupled to concrete notification classes");
console.log("❌ PROBLEM 4: Can't easily mock notifications for testing");
console.log("❌ PROBLEM 5: Object creation logic is scattered across the codebase");

export { OrderService, ShippingService, PaymentService };
