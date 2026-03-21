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

**Backend**
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
│       └── database/
│           └── connection.js
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

## API Endpoints

### Attendants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /atendentes | List all attendants |
| GET | /atendentes/:id | Get attendant by ID |
| POST | /atendentes | Create attendant |
| PUT | /atendentes/:id | Update attendant |
| DELETE | /atendentes/:id | Disable attendant |

### Products — Clothing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /produtos/roupas | List all clothing items |
| GET | /produtos/roupas/:id | Get clothing item by ID |
| POST | /produtos/roupas | Create clothing item |
| PUT | /produtos/roupas/:id | Update clothing item |
| DELETE | /produtos/roupas/:id | Disable clothing item |

### Products — Perfumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /produtos/perfumes | List all perfumes |
| GET | /produtos/perfumes/:id | Get perfume by ID |
| POST | /produtos/perfumes | Create perfume |
| PUT | /produtos/perfumes/:id | Update perfume |
| DELETE | /produtos/perfumes/:id | Disable perfume |

### Conditional Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /condicionais | List all open conditionals |
| GET | /condicionais/:id | Get conditional by ID |
| POST | /condicionais | Create conditional |
| PUT | /condicionais/:id | Update conditional status |
| GET | /condicionais/:id/itens | Get conditional items |
| POST | /condicionais/:id/itens | Add item to conditional |
| PATCH | /condicionais/:id/itens/:itemId | Update returned quantity |

## Status

Frontend complete. Backend complete. Next step: connect frontend to the API.