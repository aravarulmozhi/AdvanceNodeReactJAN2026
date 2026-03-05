# Solution 9: Middleware Pattern

---

## Request Logger

```typescript
// src/middleware/requestLogger.ts

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  console.log(`  Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`  Query:`, req.query);
  console.log(`  Body:`, req.body);
  
  // Track response time
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
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
    return;
  }

  // Validate API key (in real app, check against database)
  const validKeys = ['dev-key-123', 'prod-key-456', 'test-key-789'];
  
  if (!validKeys.includes(apiKey)) {
    res.status(403).json({ 
      success: false, 
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
    return;
  }

  // Optionally attach user info to request
  (req as any).apiKeyValid = true;
  
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
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.length > 100) {
    errors.push('Title must not exceed 100 characters');
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

  // Validate status (if provided)
  if (req.body.status) {
    const validStatuses = ['todo', 'in-progress', 'review', 'completed'];
    if (!validStatuses.includes(req.body.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
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

## Rate Limiter

```typescript
// src/middleware/rateLimiter.ts

import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitEntry>();

export const rateLimiter = (limit: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientId);
    
    // New client or window expired - reset counter
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientId, { 
        count: 1, 
        resetTime: now + windowMs 
      });
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', limit - 1);
      res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
      
      next();
      return;
    }

    // Check if limit exceeded
    if (clientData.count >= limit) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', 0);
      
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: retryAfter,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds`
      });
      return;
    }

    // Increment count
    clientData.count++;
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - clientData.count);
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
    
    next();
  };
};
```

---

## Error Handler

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
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.message
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

// Custom error class
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
```

---

## Combining Middleware

```typescript
// src/middleware/index.ts

export { requestLogger } from './requestLogger';
export { authMiddleware } from './auth';
export { validateTaskCreation } from './validation';
export { rateLimiter } from './rateLimiter';
export { errorHandler, notFound, HttpError } from './errorHandler';
```

---

## Application Setup

```typescript
// src/index.ts

import express, { Application } from 'express';
import taskRoutes from './routes/task.routes';
import { 
  requestLogger, 
  authMiddleware, 
  rateLimiter, 
  errorHandler, 
  notFound,
  validateTaskCreation
} from './middleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware (ORDER MATTERS!)
app.use(requestLogger);                    // 1. Log all requests
app.use(rateLimiter(100, 60000));          // 2. Rate limiting (100 req/min)

// Public routes (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Protected routes (with auth)
app.use('/api/tasks', authMiddleware, taskRoutes);

// Task creation with validation
app.post('/api/tasks', authMiddleware, validateTaskCreation, (req, res) => {
  // Handler code
});

// Error handling middleware (MUST BE LAST)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Testing

```bash
# Test without API key (401)
curl http://localhost:3000/api/tasks
# {"success":false,"error":"API key required"...}

# Test with invalid key (403)
curl -H "x-api-key: wrong" http://localhost:3000/api/tasks
# {"success":false,"error":"Invalid API key"...}

# Test with valid key
curl -H "x-api-key: dev-key-123" http://localhost:3000/api/tasks
# {"success":true,"data":[],"count":0}

# Test validation
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-123" \
  -d '{"title": "ab"}'
# {"success":false,"error":"Validation failed","details":["Title must be at least 3 characters",...]}

# Test rate limiting (run 101 times quickly)
for i in {1..101}; do curl -s http://localhost:3000/health > /dev/null; done
# Last request: {"success":false,"error":"Too many requests"...}
```

---

**Challenge:** [09-middleware-challenge.md](../challenge/09-middleware-challenge.md)
