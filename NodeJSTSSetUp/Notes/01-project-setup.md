# Chapter 1: Node.js + TypeScript Project Setup

> **Target Audience:** Developers with microservices experience

---

## Step 1: Initialize the Project

```bash
mkdir my-node-ts-app
cd my-node-ts-app
npm init -y
```

---

## Step 2: Install TypeScript and Dependencies

```bash
# TypeScript and Node.js types
npm install typescript @types/node --save-dev

# ts-node for development (run TS directly)
npm install ts-node --save-dev

# nodemon for auto-restart during development
npm install nodemon --save-dev
```

---

## Step 3: Initialize TypeScript Configuration

```bash
npx tsc --init
```

---

## Step 4: Configure tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 5: Create Project Structure

```
my-node-ts-app/
├── src/
│   ├── index.ts
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── routes/
│   └── utils/
├── dist/
├── package.json
├── tsconfig.json
└── nodemon.json
```

---

## Step 6: Configure nodemon.json

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/index.ts"
}
```

---

## Step 7: Update package.json Scripts

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon",
    "build": "tsc",
    "watch": "tsc -w"
  }
}
```

---

## Step 8: Create Entry Point (src/index.ts)

```typescript
import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Node.js + TypeScript Server Running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Step 9: Install Express (if using)

```bash
npm install express
npm install @types/express --save-dev
```

---

## Step 10: Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## Quick Reference Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run watch` | Watch mode for TypeScript compilation |

---

**Next Chapter:** [Introduction to Design Patterns](02-introduction-design-patterns.md)
