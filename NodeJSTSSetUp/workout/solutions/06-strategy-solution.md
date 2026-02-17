# Solution 6: Strategy Pattern

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

// Sort by date (configurable direction)
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

// Sort by multiple fields
class SortByMultiple implements ISortStrategy {
  constructor(private strategies: ISortStrategy[]) {}

  sort(tasks: ITask[]): ITask[] {
    let result = [...tasks];
    // Apply strategies in reverse order (last has highest priority)
    for (let i = this.strategies.length - 1; i >= 0; i--) {
      result = this.strategies[i].sort(result);
    }
    return result;
  }
}

export { 
  SortByPriority, 
  SortByDate, 
  SortByStatus, 
  SortByTitle,
  SortByMultiple 
};
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
    console.log(`Sorting ${tasks.length} tasks using ${this.strategy.constructor.name}`);
    return this.strategy.sort(tasks);
  }
}

export { TaskSorter };
```

---

## Usage Example

```typescript
// test-strategy.ts

import { TaskSorter } from './patterns/strategy/TaskSorter';
import { 
  SortByPriority, 
  SortByDate, 
  SortByStatus, 
  SortByTitle 
} from './patterns/strategy/SortStrategies';
import { ITask } from './models/Task.model';

// Sample data
const tasks: ITask[] = [
  { 
    id: '1', 
    title: 'Write documentation', 
    description: '', 
    priority: 'low', 
    status: 'todo',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date()
  },
  { 
    id: '2', 
    title: 'Fix critical bug', 
    description: '', 
    priority: 'urgent', 
    status: 'in-progress',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date()
  },
  { 
    id: '3', 
    title: 'Add new feature', 
    description: '', 
    priority: 'high', 
    status: 'review',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date()
  },
  { 
    id: '4', 
    title: 'Code review', 
    description: '', 
    priority: 'medium', 
    status: 'completed',
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date()
  },
];

// Create sorter with default strategy
const sorter = new TaskSorter(new SortByPriority());

// Sort by priority
console.log('=== By Priority ===');
const byPriority = sorter.sort(tasks);
byPriority.forEach(t => console.log(`${t.priority}: ${t.title}`));
// urgent: Fix critical bug
// high: Add new feature
// medium: Code review
// low: Write documentation

// Change strategy at runtime
console.log('\n=== By Date (Newest First) ===');
sorter.setStrategy(new SortByDate(false));
const byDate = sorter.sort(tasks);
byDate.forEach(t => console.log(`${t.createdAt.toDateString()}: ${t.title}`));

console.log('\n=== By Status ===');
sorter.setStrategy(new SortByStatus());
const byStatus = sorter.sort(tasks);
byStatus.forEach(t => console.log(`${t.status}: ${t.title}`));

console.log('\n=== By Title (A-Z) ===');
sorter.setStrategy(new SortByTitle());
const byTitle = sorter.sort(tasks);
byTitle.forEach(t => console.log(t.title));
// Add new feature
// Code review
// Fix critical bug
// Write documentation
```

---

## Output

```
=== By Priority ===
Sorting 4 tasks using SortByPriority
urgent: Fix critical bug
high: Add new feature
medium: Code review
low: Write documentation

=== By Date (Newest First) ===
Sorting 4 tasks using SortByDate
Tue Jan 20 2026: Add new feature
Thu Jan 15 2026: Write documentation
Sat Jan 10 2026: Fix critical bug
Mon Jan 05 2026: Code review

=== By Status ===
Sorting 4 tasks using SortByStatus
todo: Write documentation
in-progress: Fix critical bug
review: Add new feature
completed: Code review

=== By Title (A-Z) ===
Sorting 4 tasks using SortByTitle
Add new feature
Code review
Fix critical bug
Write documentation
```

---

## Bonus: Payment Strategy

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

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

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  setStrategy(strategy: PaymentStrategy) { this.strategy = strategy; }
  checkout(amount: number) { this.strategy.pay(amount); }
}
```

---

**Challenge:** [06-strategy-challenge.md](../challenge/06-strategy-challenge.md)
