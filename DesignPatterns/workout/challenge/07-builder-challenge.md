# Challenge 7: Builder Pattern

> **Difficulty:** ⭐⭐⭐ Hard  
> **Estimated Time:** 1 hour

---

## Objective

Create a Task Query Builder using the Builder pattern.

---

## Requirements

1. Create `TaskQueryBuilder` class with chainable methods:

   **Filters:**
   - `whereStatus(status)` - Filter by status
   - `wherePriority(priority)` - Filter by priority
   - `whereCreatedAfter(date)` - Filter by creation date
   - `whereCreatedBefore(date)` - Filter by creation date
   - `search(term)` - Search in title/description

   **Pagination:**
   - `limit(n)` - Limit results
   - `offset(n)` - Skip results
   - `page(pageNumber, pageSize)` - Pagination helper

   **Sorting:**
   - `sortBy(field, direction)` - Sort results

   **Build:**
   - `build()` - Return the query object
   - `reset()` - Reset builder for reuse

2. Create `execute(tasks)` method to apply query to array

---

## File Structure

```
src/
└── patterns/
    └── builder/
        └── TaskQueryBuilder.ts
```

---

## Acceptance Criteria

```typescript
const query = new TaskQueryBuilder()
  .whereStatus('in-progress')
  .wherePriority('high')
  .whereCreatedAfter(new Date('2026-01-01'))
  .search('urgent')
  .limit(10)
  .offset(0)
  .sortBy('createdAt', 'desc')
  .build();

console.log(query);
// {
//   filters: {
//     status: 'in-progress',
//     priority: 'high',
//     createdAfter: Date,
//     searchTerm: 'urgent'
//   },
//   pagination: { limit: 10, offset: 0 },
//   sorting: { field: 'createdAt', direction: 'desc' }
// }

// Execute against data
const results = new TaskQueryBuilder()
  .whereStatus('todo')
  .page(2, 20)
  .execute(allTasks);
```

---

## Query Interface

```typescript
interface TaskQuery {
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    createdAfter?: Date;
    createdBefore?: Date;
    searchTerm?: string;
  };
  pagination: {
    limit: number;
    offset: number;
  };
  sorting: {
    field: keyof ITask;
    direction: 'asc' | 'desc';
  };
}
```

---

## Hints

- All methods should return `this` for chaining
- Set sensible defaults in constructor
- Validate limit (max 100) and offset (min 0)
- `page(2, 20)` = offset 20, limit 20
- Search should be case-insensitive

---

## Bonus Challenge

- Add `whereIn(field, values)` for multiple value matching
- Add `execute()` method that applies query to tasks
- Create `HttpRequestBuilder` example

---

**Solution:** [07-builder-solution.md](../solutions/07-builder-solution.md)
