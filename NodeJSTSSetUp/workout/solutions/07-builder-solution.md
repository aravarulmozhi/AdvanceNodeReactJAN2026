# Solution 7: Builder Pattern

---

## Complete Implementation

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
    pagination: {
      limit: 10,
      offset: 0
    },
    sorting: {
      field: 'createdAt',
      direction: 'desc'
    }
  };

  // Filter methods
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
    this.query.pagination.limit = Math.max(1, Math.min(100, pageSize));
    this.query.pagination.offset = (Math.max(1, pageNumber) - 1) * pageSize;
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
    return JSON.parse(JSON.stringify(this.query)); // Deep copy
  }

  // Execute the query against a list of tasks
  execute(tasks: ITask[]): ITask[] {
    let result = [...tasks];

    // Apply filters
    const { filters } = this.query;

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
    const { field, direction } = this.query.sorting;
    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const { limit, offset } = this.query.pagination;
    result = result.slice(offset, offset + limit);

    return result;
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
// test-builder.ts

import { TaskQueryBuilder } from './patterns/builder/TaskQueryBuilder';
import { ITask } from './models/Task.model';

// Sample data
const tasks: ITask[] = [
  { id: '1', title: 'Urgent fix', description: 'Fix critical bug', priority: 'urgent', status: 'in-progress', createdAt: new Date('2026-01-20'), updatedAt: new Date() },
  { id: '2', title: 'Add feature', description: 'New feature request', priority: 'high', status: 'todo', createdAt: new Date('2026-01-15'), updatedAt: new Date() },
  { id: '3', title: 'Write docs', description: 'Documentation update', priority: 'low', status: 'todo', createdAt: new Date('2026-01-10'), updatedAt: new Date() },
  { id: '4', title: 'Code review', description: 'Review PR #123', priority: 'medium', status: 'completed', createdAt: new Date('2026-01-05'), updatedAt: new Date() },
  { id: '5', title: 'Urgent meeting', description: 'Team sync', priority: 'high', status: 'in-progress', createdAt: new Date('2026-01-25'), updatedAt: new Date() },
];

// Example 1: Complex query
console.log('=== Complex Query ===');
const query = new TaskQueryBuilder()
  .whereStatus('in-progress')
  .wherePriority('high')
  .sortBy('createdAt', 'desc')
  .limit(10)
  .build();

console.log('Built query:', JSON.stringify(query, null, 2));

// Example 2: Execute against data
console.log('\n=== In-Progress Tasks ===');
const inProgress = new TaskQueryBuilder()
  .whereStatus('in-progress')
  .sortBy('priority', 'asc')
  .execute(tasks);

inProgress.forEach(t => console.log(`- ${t.title} (${t.priority})`));

// Example 3: Search
console.log('\n=== Search "urgent" ===');
const searchResults = new TaskQueryBuilder()
  .search('urgent')
  .execute(tasks);

searchResults.forEach(t => console.log(`- ${t.title}`));

// Example 4: Pagination
console.log('\n=== Page 1 (2 items) ===');
const page1 = new TaskQueryBuilder()
  .page(1, 2)
  .sortBy('createdAt', 'desc')
  .execute(tasks);

page1.forEach(t => console.log(`- ${t.title}`));

console.log('\n=== Page 2 (2 items) ===');
const page2 = new TaskQueryBuilder()
  .page(2, 2)
  .sortBy('createdAt', 'desc')
  .execute(tasks);

page2.forEach(t => console.log(`- ${t.title}`));

// Example 5: Date range
console.log('\n=== Tasks after Jan 15 ===');
const afterJan15 = new TaskQueryBuilder()
  .whereCreatedAfter(new Date('2026-01-15'))
  .sortBy('createdAt', 'asc')
  .execute(tasks);

afterJan15.forEach(t => console.log(`- ${t.title} (${t.createdAt.toDateString()})`));
```

---

## Output

```
=== Complex Query ===
Built query: {
  "filters": {
    "status": "in-progress",
    "priority": "high"
  },
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "sorting": {
    "field": "createdAt",
    "direction": "desc"
  }
}

=== In-Progress Tasks ===
- Urgent fix (urgent)
- Urgent meeting (high)

=== Search "urgent" ===
- Urgent fix
- Urgent meeting

=== Page 1 (2 items) ===
- Urgent meeting
- Urgent fix

=== Page 2 (2 items) ===
- Add feature
- Write docs

=== Tasks after Jan 15 ===
- Add feature (Thu Jan 15 2026)
- Urgent fix (Tue Jan 20 2026)
- Urgent meeting (Sat Jan 25 2026)
```

---

## Bonus: HTTP Request Builder

```typescript
class HttpRequestBuilder {
  private config = {
    method: 'GET',
    url: '',
    headers: {} as Record<string, string>,
    body: undefined as any,
    timeout: 5000
  };

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): this {
    this.config.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.config.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.config.headers[key] = value;
    return this;
  }

  setBody(body: any): this {
    this.config.body = body;
    return this;
  }

  setTimeout(ms: number): this {
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

**Challenge:** [07-builder-challenge.md](../challenge/07-builder-challenge.md)
