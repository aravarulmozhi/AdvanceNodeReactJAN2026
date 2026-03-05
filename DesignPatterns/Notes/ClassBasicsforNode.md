# Class Basics for Node.js Developers

## Function vs Class - Quick Comparison

### The Function Way (What You Know)
```javascript
// Creating a user with functions
function createUser(name, email) {
    return {
        name: name,
        email: email,
        greet: function() {
            return `Hello, I'm ${this.name}`;
        }
    };
}

const user1 = createUser("John", "john@example.com");
console.log(user1.greet()); // Hello, I'm John
```

### The Class Way (What Patterns Use)
```javascript
// Creating a user with class
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

const user2 = new User("John", "john@example.com");
console.log(user2.greet()); // Hello, I'm John
```

## Key Class Concepts

### 1. Constructor - The Setup Function

```javascript
class DatabaseConnection {
    constructor(host, port) {
        // This runs when you create new instance
        this.host = host;
        this.port = port;
        this.isConnected = false;
    }
}

const db = new DatabaseConnection("localhost", 5432);
```

### 2. Methods - Functions Inside Class
```javascript
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }

    // Method
    log(message) {
        console.log(`[${this.prefix}] ${message}`);
    }

    // Another method
    error(message) {
        console.error(`[${this.prefix}] ERROR: ${message}`);
    }
}

const logger = new Logger("APP");
logger.log("Server started"); // [APP] Server started
```

### 3. Static Methods - No Instance Needed
```javascript
class MathHelper {
    static add(a, b) {
        return a + b;
    }

    static multiply(a, b) {
        return a * b;
    }
}

// No need for 'new'
console.log(MathHelper.add(5, 3)); // 8
```

### 4. Private Fields (ES2022+)
```javascript
class BankAccount {
    #balance = 0; // Private - can't access from outside

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
// console.log(account.#balance); // ERROR! Private field
```