# Chapter 12: Middleware Pattern (Chain of Responsibility)

> **Category:** Behavioral Pattern

---

## What is Middleware?

The Middleware pattern (also known as Chain of Responsibility) passes a request along a chain of handlers, where each handler can process the request and/or pass it to the next handler.

---

## When to Use

- Request/response processing pipelines
- Authentication and authorization
- Logging and monitoring
- Input validation
- Error handling

---

## Structure

```
Request ──► Handler1 ──► Handler2 ──► Handler3 ──► Response
              │             │             │
              ▼             ▼             ▼
           Process       Process       Process
           or Pass       or Pass       or Pass
```

---

## Express Middleware Signature

```typescript
import { Request, Response, NextFunction } from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
```

---

## Request Logger Middleware

```typescript
// src/middleware/requestLogger.ts

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  console.log(`  Headers:`, req.headers);
  console.log(`  Query:`, req.query);
  console.log(`  Body:`, req.body);
  
  // Track response time
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next(); // Pass to next middleware
};
```

---

## Authentication Middleware

```typescript
// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;
  
  // Check if API key exists
  if (!apiKey) {
    res.status(401).json({ 
      success: false, 
      error: 'API key required',
      message: 'Please provide x-api-key header'
    });
    return; // Stop chain
  }

  // Validate API key
  const validKeys = ['dev-key-123', 'prod-key-456'];
  
  if (!validKeys.includes(apiKey)) {
    res.status(403).json({ 
      success: false, 
      error: 'Invalid API key' 
    });
    return; // Stop chain
  }

  // API key valid, continue to next middleware
  next();
};
```

---

## Validation Middleware

```typescript
// src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';

export const validateTaskCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description } = req.body;
  const errors: string[] = [];

  // Validate title
  if (!title || typeof title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (title.length < 3 || title.length > 100) {
    errors.push('Title must be between 3 and 100 characters');
  }

  // Validate description
  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  // Validate priority (if provided)
  if (req.body.priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(req.body.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  // Return errors or continue
  if (errors.length > 0) {
    res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: errors 
    });
    return;
  }

  next();
};
```

---

## Rate Limiter Middleware

```typescript
// src/middleware/rateLimiter.ts

import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (limit: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientId);
    
    // New client or window expired
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientId, { 
        count: 1, 
        resetTime: now + windowMs 
      });
      next();
      return;
    }

    // Check if limit exceeded
    if (clientData.count >= limit) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: retryAfter,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds`
      });
      return;
    }

    // Increment count and continue
    clientData.count++;
    next();
  };
};
```

---

## Error Handler Middleware

```typescript
// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
};

// Not Found middleware
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
};
```

---

## Applying Middleware

```typescript
// src/index.ts

import express, { Application } from 'express';
import taskRoutes from './routes/task.routes';
import { 
  requestLogger, 
  authMiddleware, 
  rateLimiter, 
  errorHandler, 
  notFound 
} from './middleware';

const app: Application = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware (order matters!)
app.use(requestLogger);                    // 1. Log all requests
app.use(rateLimiter(100, 60000));          // 2. Rate limiting

// Public routes (no auth)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Protected routes (with auth)
app.use('/api/tasks', authMiddleware, taskRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(3000);
```

---

## Middleware Execution Flow

```
Request
   │
   ▼
┌──────────────────┐
│  requestLogger   │  ← Logs request
└────────┬─────────┘
         │ next()
         ▼
┌──────────────────┐
│   rateLimiter    │  ← Checks rate limit
└────────┬─────────┘
         │ next()
         ▼
┌──────────────────┐
│  authMiddleware  │  ← Validates auth
└────────┬─────────┘
         │ next()
         ▼
┌──────────────────┐
│    Controller    │  ← Business logic
└────────┬─────────┘
         │
         ▼
      Response
```

---

## Pros and Cons

### ✅ Pros
- Separation of concerns
- Reusable across routes
- Easy to add/remove handlers
- Decouples request processing

### ❌ Cons
- Order of middleware matters
- Can make debugging harder
- Performance overhead if too many
- Error propagation can be complex

---

**Previous:** [Dependency Injection](11-dependency-injection.md) | **Next:** [Decorator Pattern](13-decorator-pattern.md)
