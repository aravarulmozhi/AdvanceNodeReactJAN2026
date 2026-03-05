# Challenge 9: Middleware Pattern

> **Difficulty:** ⭐⭐ Medium  
> **Estimated Time:** 45 minutes

---

## Node.js Project Setup

### Quick Start
```bash
mkdir middleware-challenge && cd middleware-challenge
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
├── middleware/
│   ├── Middleware.ts
│   ├── AuthMiddleware.ts
│   ├── LoggingMiddleware.ts
│   └── ValidationMiddleware.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Create a custom middleware chain for Express.js request processing.

---

## Requirements

Implement the following middleware:

1. **requestLogger**
   - Log: timestamp, method, path
   - Log: query params and body
   - Track response time

2. **authMiddleware**
   - Check for `x-api-key` header
   - Validate against allowed keys
   - Return 401 if missing, 403 if invalid

3. **validateTaskCreation**
   - Validate title (required, 3-100 chars)
   - Validate description (required)
   - Validate priority (if provided, must be valid)
   - Return 400 with error details

4. **rateLimiter**
   - Configurable: limit and window (ms)
   - Track requests per client IP
   - Return 429 if limit exceeded

5. **errorHandler**
   - Catch all errors
   - Return appropriate status code
   - Include stack trace in development only

---

## File Structure

```
src/
└── middleware/
    ├── index.ts
    ├── requestLogger.ts
    ├── auth.ts
    ├── validation.ts
    ├── rateLimiter.ts
    └── errorHandler.ts
```

---

## Acceptance Criteria

```typescript
// Apply middleware
app.use(requestLogger);
app.use(rateLimiter(100, 60000)); // 100 req/min

// Public route
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Protected routes
app.use('/api/tasks', authMiddleware, taskRoutes);

// Error handling (last)
app.use(notFound);
app.use(errorHandler);
```

---

## Middleware Signature

```typescript
import { Request, Response, NextFunction } from 'express';

type Middleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => void;
```

---

## Rate Limiter Response

```json
{
  "success": false,
  "error": "Too many requests",
  "retryAfter": 45,
  "message": "Rate limit exceeded. Try again in 45 seconds"
}
```

---

## Hints

- Use `res.on('finish', ...)` to track response time
- Store rate limit data in a Map by client IP
- Call `next()` to continue chain, or send response to stop
- Error handler has 4 parameters: (err, req, res, next)

---

## Bonus Challenge

- Add role-based authorization middleware
- Implement CORS middleware
- Add request ID tracking middleware

---

**Solution:** [09-middleware-solution.md](../solutions/09-middleware-solution.md)
