# 📚 Library Management System API

A professional, production-ready RESTful API for managing library operations built with Node.js, Express, and PostgreSQL.

## ✨ Features

### Core Functionality
- **Book Management**: Add, update, delete, search, and list books with ISBN validation
- **Borrower Management**: Register and manage borrower accounts
- **Borrowing Operations**: Complete checkout/return workflow with due date tracking
- **Overdue Tracking**: Automatic monitoring of overdue books
- **Analytics & Reporting**: Export borrowing data in CSV/XLSX formats

### Security & Performance
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🛡️ **Helmet.js Integration**: Enhanced security headers protection
- 💉 **SQL Injection Prevention**: Parameterized queries using `$1, $2, ...` notation
- ⚡ **Database Indexing**: Optimized read operations on frequently queried fields
- 🚦 **Rate Limiting**: API abuse prevention on critical endpoints
- ✅ **Input Validation**: Comprehensive request validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/hazemmx/Library-Management-API.git
cd Library-Management-API

# Start the application with Docker Compose
docker-compose up -d

# The API will be available at http://localhost:3005
```

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/hazemmx/Library-Management-API.git
cd Library-Management-API

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Create database and run migrations
psql -U postgres -f database/schema.sql

# 5. Start the server
npm start
```

---

## 🗄️ Database Schema

The system uses a normalized PostgreSQL schema with the following tables:

### Tables
- **books**: Book inventory with ISBN, title, author, quantity, and shelf location
- **borrowers**: Registered library users
- **borrowings**: Tracks checkout/return transactions with due dates

### Key Indexes (Performance Optimization)
```sql
-- Books table
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);

-- Borrowers table
CREATE INDEX idx_borrowers_email ON borrowers(email);

-- Borrowings table
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);
CREATE INDEX idx_borrowings_borrower_id ON borrowings(borrower_id);
```

**See detailed schema:** [`database/schema.sql`](https://dbdiagram.io/d/library-management-697dd68cbd82f5fce23419f7)

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Rate Limited |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register new borrower | ✅ |
| POST | `/api/auth/login` | Login and receive JWT token | ✅ |

### Books
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | List all books | ❌ |
| GET | `/api/books/search?q=` | Search books by title/author/ISBN | ❌ |
| POST | `/api/books` | Add new book | ✅ |
| PUT | `/api/books/:id` | Update book details | ✅ |
| DELETE | `/api/books/:id` | Delete book | ✅ |

### Borrowers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/borrowers` | List all borrowers | ✅ |
| GET | `/api/borrowers/:id` | Get borrower details | ✅ |
| PUT | `/api/borrowers/:id` | Update borrower info | ✅ |
| DELETE | `/api/borrowers/:id` | Delete borrower | ✅ |

### Borrowing Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/borrowings/checkout` | Checkout a book | ✅ |
| POST | `/api/borrowings/return/:id` | Return a book | ✅ |
| GET | `/api/borrowings/my-books` | Get user's current books | ✅ |
| GET | `/api/borrowings/overdue` | List overdue books | ✅ |

### Analytics & Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports/borrowings?start=&end=&format=csv` | Export borrowing data | ✅ |
| GET | `/api/reports/overdue?format=xlsx` | Export overdue books | ✅ |

---

## 🔒 Security Features

### 1. **Parameterized Queries**
All database queries use PostgreSQL parameterized syntax to prevent SQL injection:

```javascript
// ✅ SECURE - Using $1, $2 parameters
const result = await pool.query(
  'SELECT * FROM books WHERE title = $1 AND author = $2',
  [title, author]
);

// ❌ INSECURE - Never used in this project
const result = await pool.query(
  `SELECT * FROM books WHERE title = '${title}'`
);
```

### 2. **Helmet.js Security Headers**
Automatically sets secure HTTP headers:
- Content Security Policy
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Strict-Transport-Security (HTTPS enforcement)

### 3. **JWT Authentication**
- Stateless authentication using JSON Web Tokens
- Secure password hashing with bcrypt
- Token expiration and refresh mechanisms

### 4. **Rate Limiting**
Protected endpoints (login & register):
- 5 requests per 15 minutes per IP
- Prevents brute force attacks

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- books.test.js
```

### Test Coverage
Unit tests are implemented for the **Books module** covering:
- ✅ Book creation and validation
- ✅ ISBN format validation
- ✅ Search functionality
- ✅ Update and delete operations
- ✅ Error handling

---

## 📮 Postman Collection

The repository includes a complete Postman collection with:

### 🎯 **Automated Token Management**
The collection features a **pre-request script** that automatically:
1. Checks if a valid token exists
2. Logs in and retrieves a new token if expired
3. Sets the token in environment variables
4. Injects the token into request headers

**No manual token copying required!** 🎉

### Import Instructions
1. Import `Library-Management.postman_collection.json`
2. Import `Library-MNG.postman_environment.json`
3. Set your environment variables (base URL, credentials)
4. Start testing - tokens are handled automatically!

**Postman Script Highlights:**
```javascript
// Automatic token refresh on every request
if (!pm.environment.get('token') || isTokenExpired()) {
    await login();
    pm.environment.set('token', response.token);
}
```

---

## 📊 Example Usage

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

### 2. Add a Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "quantity": 5,
    "shelf_location": "A-12"
  }'
```

### 3. Checkout a Book
```bash
curl -X POST http://localhost:3000/api/borrowings/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"book_id": 1}'
```

### 4. Export Overdue Books
```bash
curl -X GET "http://localhost:3000/api/reports/overdue?format=xlsx" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output overdue_books.xlsx
```

---

## 🏗️ Project Structure

```
Library-Management-API/
├── database/
│   ├── schema.sql              # Database schema with indexes
│   └── db.js                   # Database connection pool
├── src/
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth, rate limiting, validation
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   └── utils/                  # Helpers (CSV/XLSX export)
├── tests/                      # Unit tests
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Container definition
└── package.json                # Dependencies
```

---

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Security**: Helmet.js, express-rate-limit
- **Validation**: express-validator
- **File Export**: csv-writer, xlsx
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

---

## 📝 Environment Variables

```env
PORT=3005
DB_USER=postgres
DB_HOST=localhost
DB_NAME=library-db
DB_PASSWORD=mystery122
DB_PORT=5432
JWT_SECRET=secret
```

---

## 🎯 Assessment Compliance

### ✅ Functional Requirements
- [x] Complete book management (CRUD)
- [x] Borrower management (CRUD)
- [x] Checkout/return workflow
- [x] Overdue tracking
- [x] Search functionality

### ✅ Non-Functional Requirements
- [x] Optimized read operations (database indexes)
- [x] Scalable architecture (modular design)
- [x] SQL injection prevention (parameterized queries)
- [x] Input validation

### ✅ Technical Requirements
- [x] Node.js implementation
- [x] PostgreSQL database
- [x] RESTful API design
- [x] Comprehensive error handling

### ✅ Bonus Features
- [x] Analytics & data export (CSV/XLSX)
- [x] Rate limiting (auth endpoints)
- [x] Docker containerization
- [x] JWT authentication
- [x] Unit tests (Books module)

---

## 📄 License

This project is created for the Bosta Back-end Engineer Technical Assessment.

---

## 👨‍💻 Author

**Hazem Gobran**  
[GitHub](https://github.com/hazemmx) | [Repository](https://github.com/hazemmx/Library-Management-API)

---
