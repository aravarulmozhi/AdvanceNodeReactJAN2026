# Chapter 3: Types of Design Patterns

---

## 1. Creational Patterns

*Deal with object creation mechanisms*

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Singleton** | Ensures only one instance exists | Database connections, Logger |
| **Factory** | Creates objects without specifying exact class | API response handlers |
| **Abstract Factory** | Creates families of related objects | Cross-platform UI components |
| **Builder** | Constructs complex objects step by step | Query builders, Config objects |
| **Prototype** | Creates objects by cloning existing ones | Object caching |

---

## 2. Structural Patterns

*Deal with object composition*

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Adapter** | Converts interface to another expected interface | Third-party integrations |
| **Decorator** | Adds behavior to objects dynamically | Middleware, Logging |
| **Facade** | Provides simplified interface to complex subsystem | API wrappers |
| **Proxy** | Placeholder for another object to control access | Caching, Auth middleware |
| **Composite** | Treats individual objects and compositions uniformly | File systems, Menus |
| **Bridge** | Separates abstraction from implementation | Cross-platform apps |

---

## 3. Behavioral Patterns

*Deal with object communication*

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Observer** | Notifies multiple objects about state changes | Event emitters, Pub/Sub |
| **Strategy** | Defines family of algorithms, makes them interchangeable | Payment methods, Sorting |
| **Command** | Encapsulates request as an object | Undo/Redo, Task queues |
| **Chain of Responsibility** | Passes request along handler chain | Middleware pipeline |
| **State** | Alters behavior based on internal state | Order status, Game states |
| **Template Method** | Defines algorithm skeleton, lets subclasses override | Data processors |
| **Mediator** | Centralizes complex communications | Chat rooms, Event bus |
| **Iterator** | Provides way to access elements sequentially | Custom collections |

---

## Quick Reference: When to Use Each Pattern

| Scenario | Recommended Pattern |
|----------|---------------------|
| Database connection management | Singleton |
| Creating different user types | Factory |
| Building complex query objects | Builder |
| Third-party API integration | Adapter |
| Request/Response middleware | Decorator, Chain of Responsibility |
| Event-driven architecture | Observer |
| Multiple payment methods | Strategy |
| Separating data access logic | Repository |
| Loose coupling between modules | Dependency Injection |
| Web application structure | MVC |

---

## Pattern Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                           │
├─────────────────────────────────────────────────────────┤
│  Singleton ──► Factory ──► Created Objects              │
│       │                          │                       │
│       ▼                          ▼                       │
│  Repository ◄── Decorator ──► Service Layer             │
│       │              │              │                    │
│       ▼              ▼              ▼                    │
│  Observer ◄─── Strategy ◄─── Controller (MVC)           │
└─────────────────────────────────────────────────────────┘
```

---

**Previous:** [Introduction](02-introduction-design-patterns.md) | **Next:** [Singleton Pattern](04-singleton-pattern.md)
