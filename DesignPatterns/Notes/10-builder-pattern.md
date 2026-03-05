# Chapter 10: Builder Pattern

> **Category:** Creational Pattern

---

## What is Builder?

The Builder pattern constructs complex objects step by step, allowing you to produce different types and representations using the same construction code.

---

## When to Use

- Creating complex objects with many optional parameters
- Building objects step by step
- Creating different representations of an object
- Query builders, Configuration objects

---

## Structure

```
┌─────────────────┐       uses        ┌─────────────────┐
│     Client      │ ────────────────► │     Builder     │
└─────────────────┘                   ├─────────────────┤
                                      │ + stepA()       │
                                      │ + stepB()       │
                                      │ + stepC()       │
                                      │ + build()       │
                                      └─────────────────┘
                                              │
                                              ▼
                                      ┌─────────────────┐
                                      │     Product     │
                                      └─────────────────┘
```

---

## Task Query Builder Implementation

```typescript
// src/patterns/builder/TaskQueryBuilder.ts

import { TaskStatus, TaskPriority, ITask } from '../../models/Task.model';

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

class TaskQueryBuilder {
  private query: TaskQuery = {
    filters: {},
    pagination: { limit: 10, offset: 0 },
    sorting: { field: 'createdAt', direction: 'desc' }
  };

  // Filter methods (chainable)
  whereStatus(status: TaskStatus): TaskQueryBuilder {
    this.query.filters.status = status;
    return this;
  }

  wherePriority(priority: TaskPriority): TaskQueryBuilder {
    this.query.filters.priority = priority;
    return this;
  }

  whereCreatedAfter(date: Date): TaskQueryBuilder {
    this.query.filters.createdAfter = date;
    return this;
  }

  whereCreatedBefore(date: Date): TaskQueryBuilder {
    this.query.filters.createdBefore = date;
    return this;
  }

  search(term: string): TaskQueryBuilder {
    this.query.filters.searchTerm = term;
    return this;
  }

  // Pagination methods
  limit(limit: number): TaskQueryBuilder {
    this.query.pagination.limit = Math.max(1, Math.min(100, limit));
    return this;
  }

  offset(offset: number): TaskQueryBuilder {
    this.query.pagination.offset = Math.max(0, offset);
    return this;
  }

  page(pageNumber: number, pageSize: number = 10): TaskQueryBuilder {
    this.query.pagination.limit = pageSize;
    this.query.pagination.offset = (pageNumber - 1) * pageSize;
    return this;
  }

  // Sorting method
  sortBy(field: keyof ITask, direction: 'asc' | 'desc' = 'asc'): TaskQueryBuilder {
    this.query.sorting.field = field;
    this.query.sorting.direction = direction;
    return this;
  }

  // Build the final query object
  build(): TaskQuery {
    return { ...this.query };
  }

  // Reset builder for reuse
  reset(): TaskQueryBuilder {
    this.query = {
      filters: {},
      pagination: { limit: 10, offset: 0 },
      sorting: { field: 'createdAt', direction: 'desc' }
    };
    return this;
  }
}

export { TaskQueryBuilder, TaskQuery };
```

---

## Usage Example

```typescript
import { TaskQueryBuilder } from './TaskQueryBuilder';

// Build a complex query step by step
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

// Pagination example
const page2Query = new TaskQueryBuilder()
  .whereStatus('todo')
  .page(2, 20)  // Page 2, 20 items per page
  .build();
```

---

## Query Executor

```typescript
// Execute the built query against data
class TaskQueryExecutor {
  execute(tasks: ITask[], query: TaskQuery): ITask[] {
    let result = [...tasks];

    // Apply filters
    const { filters } = query;

    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters.createdAfter) {
      result = result.filter(t => new Date(t.createdAt) >= filters.createdAfter!);
    }

    if (filters.createdBefore) {
      result = result.filter(t => new Date(t.createdAt) <= filters.createdBefore!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.description.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    const { field, direction } = query.sorting;
    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const { limit, offset } = query.pagination;
    result = result.slice(offset, offset + limit);

    return result;
  }
}
```

---

## Real-World Example: HTTP Request Builder

```typescript
class HttpRequestBuilder {
  private config: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
    timeout: number;
  } = {
    method: 'GET',
    url: '',
    headers: {},
    timeout: 5000
  };

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): HttpRequestBuilder {
    this.config.method = method;
    return this;
  }

  setUrl(url: string): HttpRequestBuilder {
    this.config.url = url;
    return this;
  }

  addHeader(key: string, value: string): HttpRequestBuilder {
    this.config.headers[key] = value;
    return this;
  }

  setBody(body: any): HttpRequestBuilder {
    this.config.body = body;
    return this;
  }

  setTimeout(ms: number): HttpRequestBuilder {
    this.config.timeout = ms;
    return this;
  }

  build() {
    return { ...this.config };
  }
}

// Usage
const request = new HttpRequestBuilder()
  .setMethod('POST')
  .setUrl('https://api.example.com/tasks')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token123')
  .setBody({ title: 'New Task' })
  .setTimeout(10000)
  .build();
```

---

## Pros and Cons

### ✅ Pros
- Creates complex objects step by step
- Same construction process, different representations
- Isolates complex construction code
- Fluent interface improves readability

### ❌ Cons
- Requires creating multiple classes
- Mutable builder can cause issues
- Can be overkill for simple objects

---

**Previous:** [Strategy Pattern](09-strategy-pattern.md) | **Next:** [Dependency Injection](11-dependency-injection.md)
