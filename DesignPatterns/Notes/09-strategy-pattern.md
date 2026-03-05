# Chapter 9: Strategy Pattern

> **Category:** Behavioral Pattern

---

## What is Strategy?

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

---

## When to Use

- Multiple algorithms for a specific task
- Need to switch algorithms at runtime
- Avoiding conditional statements for algorithm selection
- Different variations of an algorithm

---

## Structure

```
┌─────────────────┐        uses        ┌─────────────────┐
│     Context     │ ─────────────────► │    Strategy     │
├─────────────────┤                    ├─────────────────┤
│ - strategy      │                    │ + execute()     │
│ + setStrategy() │                    └─────────────────┘
│ + executeOp()   │                            △
└─────────────────┘                            │
                                  ┌────────────┼────────────┐
                                  │            │            │
                           ┌──────┴─────┐ ┌────┴─────┐ ┌────┴──────┐
                           │ StrategyA  │ │ StrategyB│ │ StrategyC │
                           └────────────┘ └──────────┘ └───────────┘
```

---

## Strategy Interface

```typescript
// src/patterns/strategy/ISortStrategy.ts

import { ITask } from '../../models/Task.model';

interface ISortStrategy {
  sort(tasks: ITask[]): ITask[];
}

export { ISortStrategy };
```

---

## Concrete Strategies

```typescript
// src/patterns/strategy/SortStrategies.ts

import { ITask, TaskPriority, TaskStatus } from '../../models/Task.model';
import { ISortStrategy } from './ISortStrategy';

// Sort by priority (urgent → high → medium → low)
class SortByPriority implements ISortStrategy {
  private priorityOrder: Record<TaskPriority, number> = {
    'urgent': 0,
    'high': 1,
    'medium': 2,
    'low': 3
  };

  sort(tasks: ITask[]): ITask[] {
    return [...tasks].sort((a, b) => 
      this.priorityOrder[a.priority] - this.priorityOrder[b.priority]
    );
  }
}

// Sort by date (newest or oldest first)
class SortByDate implements ISortStrategy {
  constructor(private ascending: boolean = false) {}

  sort(tasks: ITask[]): ITask[] {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.ascending ? dateA - dateB : dateB - dateA;
    });
  }
}

// Sort by status (todo → in-progress → review → completed)
class SortByStatus implements ISortStrategy {
  private statusOrder: Record<TaskStatus, number> = {
    'todo': 0,
    'in-progress': 1,
    'review': 2,
    'completed': 3
  };

  sort(tasks: ITask[]): ITask[] {
    return [...tasks].sort((a, b) => 
      this.statusOrder[a.status] - this.statusOrder[b.status]
    );
  }
}

// Sort alphabetically by title
class SortByTitle implements ISortStrategy {
  constructor(private descending: boolean = false) {}

  sort(tasks: ITask[]): ITask[] {
    return [...tasks].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return this.descending ? -comparison : comparison;
    });
  }
}

export { SortByPriority, SortByDate, SortByStatus, SortByTitle };
```

---

## Context Class

```typescript
// src/patterns/strategy/TaskSorter.ts

import { ITask } from '../../models/Task.model';
import { ISortStrategy } from './ISortStrategy';

class TaskSorter {
  private strategy: ISortStrategy;

  constructor(strategy: ISortStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ISortStrategy): void {
    this.strategy = strategy;
  }

  sort(tasks: ITask[]): ITask[] {
    return this.strategy.sort(tasks);
  }
}

export { TaskSorter };
```

---

## Usage Example

```typescript
import { TaskSorter } from './TaskSorter';
import { SortByPriority, SortByDate, SortByStatus, SortByTitle } from './SortStrategies';

const tasks: ITask[] = [
  { id: '1', title: 'Write docs', priority: 'low', status: 'todo', ... },
  { id: '2', title: 'Fix bug', priority: 'urgent', status: 'in-progress', ... },
  { id: '3', title: 'Add feature', priority: 'high', status: 'review', ... },
];

// Create sorter with default strategy
const sorter = new TaskSorter(new SortByPriority());

// Sort by priority
console.log('By Priority:', sorter.sort(tasks));
// Output: Fix bug (urgent), Add feature (high), Write docs (low)

// Change strategy at runtime
sorter.setStrategy(new SortByDate());
console.log('By Date:', sorter.sort(tasks));

// Change to status sorting
sorter.setStrategy(new SortByStatus());
console.log('By Status:', sorter.sort(tasks));

// Alphabetical sorting
sorter.setStrategy(new SortByTitle());
console.log('By Title:', sorter.sort(tasks));
```

---

## Real-World Example: Payment Strategy

```typescript
// Payment Strategy Interface
interface PaymentStrategy {
  pay(amount: number): void;
}

// Concrete Strategies
class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}
  
  pay(amount: number): void {
    console.log(`Paid $${amount} via Credit Card ****${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}
  
  pay(amount: number): void {
    console.log(`Paid $${amount} via PayPal: ${this.email}`);
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private wallet: string) {}
  
  pay(amount: number): void {
    console.log(`Paid $${amount} via Crypto: ${this.wallet.slice(0, 8)}...`);
  }
}

// Context
class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  checkout(amount: number): void {
    this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment('4111111111111234'));
processor.checkout(99.99);

processor.setStrategy(new PayPalPayment('user@example.com'));
processor.checkout(49.99);
```

---

## Pros and Cons

### ✅ Pros
- Eliminates conditional statements
- Easy to add new strategies
- Algorithms are interchangeable
- Open/Closed principle

### ❌ Cons
- Clients must be aware of strategies
- Increased number of classes
- Communication overhead between strategy and context

---

**Previous:** [Observer Pattern](08-observer-pattern.md) | **Next:** [Builder Pattern](10-builder-pattern.md)
