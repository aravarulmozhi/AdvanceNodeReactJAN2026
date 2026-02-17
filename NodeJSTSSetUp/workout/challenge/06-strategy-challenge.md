# Challenge 6: Strategy Pattern

> **Difficulty:** ⭐⭐⭐ Hard  
> **Estimated Time:** 45 minutes

---

## Objective

Implement multiple task sorting strategies using the Strategy pattern.

---

## Requirements

1. Create `ISortStrategy` interface with method:
   - `sort(tasks: ITask[]): ITask[]`

2. Implement sorting strategies:
   - `SortByPriority` - urgent → high → medium → low
   - `SortByDate` - Newest first (configurable direction)
   - `SortByStatus` - todo → in-progress → review → completed
   - `SortByTitle` - Alphabetically (configurable direction)

3. Create `TaskSorter` context class with:
   - Constructor accepting initial strategy
   - `setStrategy(strategy)` method
   - `sort(tasks)` method

---

## File Structure

```
src/
└── patterns/
    └── strategy/
        ├── ISortStrategy.ts
        ├── SortStrategies.ts
        └── TaskSorter.ts
```

---

## Acceptance Criteria

```typescript
const tasks: ITask[] = [
  { id: '1', title: 'Write docs', priority: 'low', status: 'todo' },
  { id: '2', title: 'Fix bug', priority: 'urgent', status: 'in-progress' },
  { id: '3', title: 'Add feature', priority: 'high', status: 'review' },
];

const sorter = new TaskSorter(new SortByPriority());

// Sort by priority
const byPriority = sorter.sort(tasks);
// Order: Fix bug (urgent), Add feature (high), Write docs (low)

// Change strategy at runtime
sorter.setStrategy(new SortByDate());
const byDate = sorter.sort(tasks);

// Change to alphabetical
sorter.setStrategy(new SortByTitle());
const byTitle = sorter.sort(tasks);
// Order: Add feature, Fix bug, Write docs
```

---

## Priority Order

```typescript
const priorityOrder = {
  'urgent': 0,
  'high': 1,
  'medium': 2,
  'low': 3
};
```

## Status Order

```typescript
const statusOrder = {
  'todo': 0,
  'in-progress': 1,
  'review': 2,
  'completed': 3
};
```

---

## Hints

- Return a new sorted array, don't mutate original
- Use `localeCompare()` for string sorting
- Accept configuration in strategy constructor
- Use spreading `[...tasks]` to avoid mutation

---

## Bonus Challenge

- Add `SortByMultiple` - sort by multiple fields
- Add descending option to all strategies
- Implement a payment strategy example

---

**Solution:** [06-strategy-solution.md](../solutions/06-strategy-solution.md)
