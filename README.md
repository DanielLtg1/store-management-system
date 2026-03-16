# Store Management System

> ⚠️ This project's UI and codebase are written in **Brazilian Portuguese**, as it is built for a local Brazilian business.

Store management system for two shops — **Sonho Infantil Store** (children's clothing) and **Amore Mio Cosméticos** (perfumes). Built to run locally on a Wi-Fi network, replacing manual notebooks and spreadsheets.

## Features

- Stock control — product registration, entries and exits
- Conditional sales — track items taken by customers, partial returns and closing
- Attendant management with PIN authentication per action
- Separate themes and product catalogs for each store

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router DOM

**Backend** *(in progress)*
- Node.js + Express
- MySQL

## Project Structure

```
store-management-system/
├── src/                  # Frontend (React)
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── theme.js
├── backend/              # Backend (Node.js)
│   └── src/
│       ├── server.js
│       ├── db.js
│       └── routes/
└── database/
    └── schema.sql        # Database schema
```

## Getting Started

### Database

Create the database by running the schema script in your MySQL client:

```bash
mysql -u root -p < database/schema.sql
```

Or open `database/schema.sql` manually in MySQL Workbench and execute it.

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Environment variables

Create a `.env` file inside `/backend`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestao_lojas
PORT=3000
```

## Status

Currently in development — frontend complete, backend in progress.
