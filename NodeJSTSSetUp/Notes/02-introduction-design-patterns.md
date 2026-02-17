# Chapter 2: Introduction to Design Patterns

---

## What are Design Patterns?

Design patterns are **reusable solutions** to common problems that occur in software design. They are templates or blueprints that can be applied to solve recurring design challenges.

---

## Why Use Design Patterns?

| Benefit | Description |
|---------|-------------|
| **Code Reusability** | Proven solutions reduce development time |
| **Maintainability** | Structured code is easier to maintain |
| **Scalability** | Patterns support application growth |
| **Communication** | Common vocabulary among developers |
| **Best Practices** | Industry-tested approaches |

---

## The Gang of Four (GoF)

Design patterns were popularized by the book **"Design Patterns: Elements of Reusable Object-Oriented Software"** by:
- Erich Gamma
- Richard Helm
- Ralph Johnson
- John Vlissides

These four authors are collectively known as the "Gang of Four" (GoF).

---

## Three Categories of Design Patterns

```
Design Patterns
├── Creational Patterns
│   └── Deal with object creation mechanisms
├── Structural Patterns
│   └── Deal with object composition
└── Behavioral Patterns
    └── Deal with object communication
```

---

## Pattern Selection Guidelines

### When to Use Creational Patterns
- Need to control object instantiation
- Want to hide complex creation logic
- Require flexibility in object creation

### When to Use Structural Patterns
- Need to compose objects into larger structures
- Want to add functionality without modifying existing code
- Require simplified interfaces to complex systems

### When to Use Behavioral Patterns
- Need to define communication between objects
- Want to encapsulate algorithms
- Require flexible assignment of responsibilities

---

## Design Principles Behind Patterns

1. **Single Responsibility Principle (SRP)**
   - A class should have only one reason to change

2. **Open/Closed Principle (OCP)**
   - Open for extension, closed for modification

3. **Liskov Substitution Principle (LSP)**
   - Subtypes must be substitutable for base types

4. **Interface Segregation Principle (ISP)**
   - Many specific interfaces are better than one general interface

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions, not concretions

---

**Previous:** [Project Setup](01-project-setup.md) | **Next:** [Types of Design Patterns](03-types-of-design-patterns.md)
