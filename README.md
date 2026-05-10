# Ledgerly API

## 1. Project Introduction

Ledgerly API is the backend for a personalized ledger application.

It helps users turn messy bank statement data into a clean, usable personal ledger without forcing traditional accounting rules.

### What problem it solves

Bank statements are often hard to read and organize. Ledgerly makes this easier by:

- accepting uploaded bank statement files
- storing raw transactions safely
- extracting readable entities from descriptions
- letting users group data with categories
- generating a ledger view that matches each user's style

### Entities and categories (quick idea)

- `Entity`: who/what a transaction is related to (for example: a merchant, platform, or biller)
- `Category`: how the user wants to group spending/income (for example: Food, Transport, Salary)

This is not a full accounting ERP. It is a user-controlled personal ledger experience.

## 2. Features

- Bank statement upload
- Excel/statement parsing
- Raw transaction storage
- Entity extraction from transaction descriptions
- Transaction annotation/customization
- Category management
- Personalized ledger-style transaction view

## 3. Tech Stack

- Node.js
- Express.js
- Prisma
- PostgreSQL
- Zod
- Nodemon

## 4. Project Structure

```text
LedgerlyApi/
  src/
    config/         # App and environment configuration
    controllers/    # Request handlers
    middlewares/    # Auth, validation, and shared middleware
    modules/        # Feature modules (auth, uploads, transactions, ledger)
    parsers/        # Bank/Excel parsing logic
    routes/         # API route definitions
    services/       # Business logic
    models/         # DTOs, request models, response models
    utils/          # Shared helper functions
    data/           # Local data helpers/resources
    server.js       # Application entry point
  prisma/           # Prisma schema and DB mapping files
  .env.example      # Environment variable template
```

## 5. Environment Setup

1. Clone the repository.
2. Install dependencies.
3. Create a `.env` file in the project root.
4. Add required values:

```env
DATABASE_URL=your_postgresql_connection_url
PORT=3000
```

## 6. Run Commands

```bash
npm install
npm run dev
npm start
npm test
```

## 7. API Overview

### Transaction APIs

Used to upload, store, view, and annotate transaction records.

### Category APIs

Used to create and manage user-defined categories for organizing transactions.

### Ledger APIs

Used to return a personalized ledger view by combining transactions, entities, categories, and user annotations.

## 8. Ledger Architecture (Simple View)

- `raw_transactions`: Original transaction rows from uploaded bank statements.
- `entities`: Cleaned/extracted "who" from raw descriptions.
- `categories`: User-defined grouping layer for budgeting and tracking.
- `transaction_annotations`: User customization layer (notes, mapping, corrections, overrides).

Think of it as a pipeline:

1. Raw bank data comes in.
2. Ledgerly cleans and enriches it.
3. User controls final organization and meaning.

## 9. Future Scope

- AI-based category suggestions
- Smarter entity recognition for noisy descriptions
- Better spending and cashflow analytics
- Recurring transaction detection

## 10. Contribution Notes

- Keep code readable and predictable.
- Avoid over-engineering.
- Prefer simple, clear business logic.
- Keep structure beginner-friendly so new contributors can onboard quickly.

---

If you are new to the project, start with the `uploads`, `transactions`, and `ledger` modules to understand the core flow end-to-end.
