# Chapter 14: Summary & Quick Reference

---

## Design Patterns Overview

### Creational Patterns

| Pattern | Purpose | Key Concept |
|---------|---------|-------------|
| **Singleton** | Single instance | `getInstance()` |
| **Factory** | Create without specifying class | `create(type)` |
| **Builder** | Step-by-step construction | Chainable methods |

### Structural Patterns

| Pattern | Purpose | Key Concept |
|---------|---------|-------------|
| **Repository** | Abstract data access | Interface over storage |
| **Decorator** | Add behavior dynamically | Wrapping objects |
| **MVC** | Separate concerns | Model-View-Controller |

### Behavioral Patterns

| Pattern | Purpose | Key Concept |
|---------|---------|-------------|
| **Observer** | Event notification | Subscribe/Notify |
| **Strategy** | Interchangeable algorithms | `setStrategy()` |
| **Middleware** | Request processing chain | `next()` |

---

## Pattern Selection Guide

```
Need single shared instance?
└── Singleton

Need to create objects based on type?
└── Factory

Need to build complex objects step-by-step?
└── Builder

Need to abstract data layer?
└── Repository

Need event-driven notifications?
└── Observer

Need swappable algorithms?
└── Strategy

Need request processing pipeline?
└── Middleware

Need to add features without modifying code?
└── Decorator

Need loose coupling between components?
└── Dependency Injection
```

---

## Pattern Relationships in an Application

```
┌─────────────────────────────────────────────────────────────┐
│                        APPLICATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────┐      │
│   │ Request  │───►│Middleware│───►│   Controller     │      │
│   └──────────┘    │ (Chain)  │    │     (MVC)        │      │
│                   └──────────┘    └────────┬─────────┘      │
│                                            │                 │
│                                            ▼                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────┐      │
│   │ Singleton│───►│  Service │◄───│   DI Container   │      │
│   │  (DB)    │    │  Layer   │    └──────────────────┘      │
│   └──────────┘    └────┬─────┘                              │
│                        │                                     │
│                        ▼                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────┐      │
│   │ Observer │◄───│Repository│───►│    Decorator     │      │
│   │ (Events) │    │ (Data)   │    │   (Caching)      │      │
│   └──────────┘    └──────────┘    └──────────────────┘      │
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────┐      │
│   │ Factory  │    │ Strategy │    │     Builder      │      │
│   │(Objects) │    │(Sorting) │    │   (Queries)      │      │
│   └──────────┘    └──────────┘    └──────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Snippets Quick Reference

### Singleton
```typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {}
  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

### Factory
```typescript
class Factory {
  static create(type: string): Product {
    switch(type) {
      case 'A': return new ProductA();
      case 'B': return new ProductB();
      default: throw new Error('Unknown type');
    }
  }
}
```

### Observer
```typescript
class Subject {
  private observers: Observer[] = [];
  subscribe(o: Observer) { this.observers.push(o); }
  notify(data: any) { this.observers.forEach(o => o.update(data)); }
}
```

### Strategy
```typescript
class Context {
  constructor(private strategy: Strategy) {}
  setStrategy(s: Strategy) { this.strategy = s; }
  execute() { return this.strategy.execute(); }
}
```

### Builder
```typescript
class Builder {
  private product = {};
  setA(a: string) { this.product.a = a; return this; }
  setB(b: string) { this.product.b = b; return this; }
  build() { return this.product; }
}
```

---

## Best Practices

1. **Don't over-engineer** - Use patterns when they solve a real problem
2. **Start simple** - Add patterns as complexity grows
3. **Combine patterns** - They work well together
4. **Document decisions** - Explain why patterns were chosen
5. **Consider testability** - Patterns should improve, not hinder testing

---

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## Chapter Index

1. [Project Setup](01-project-setup.md)
2. [Introduction to Design Patterns](02-introduction-design-patterns.md)
3. [Types of Design Patterns](03-types-of-design-patterns.md)
4. [Singleton Pattern](04-singleton-pattern.md)
5. [Factory Pattern](05-factory-pattern.md)
6. [MVC Pattern](06-mvc-pattern.md)
7. [Repository Pattern](07-repository-pattern.md)
8. [Observer Pattern](08-observer-pattern.md)
9. [Strategy Pattern](09-strategy-pattern.md)
10. [Builder Pattern](10-builder-pattern.md)
11. [Dependency Injection](11-dependency-injection.md)
12. [Middleware Pattern](12-middleware-pattern.md)
13. [Decorator Pattern](13-decorator-pattern.md)
14. [Summary](14-summary.md) ← You are here

---

**Happy Coding! 🚀**
