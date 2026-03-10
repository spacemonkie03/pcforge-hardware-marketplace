# PCForge – PC Hardware Marketplace

A comprehensive e-commerce platform for buying and selling PC hardware components, featuring an intelligent PC builder with compatibility checks, live price tracking, and advanced search capabilities.

## Tech Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Search**: Elasticsearch
- **Infrastructure**: Docker, Docker Compose, Nginx

## Features

- **PC Builder**: Interactive tool to build custom PCs with real-time compatibility validation
- **Product Catalog**: Extensive hardware listings with detailed specifications
- **Seller Management**: Platform for hardware vendors to list and manage products
- **User Reviews**: Customer feedback and ratings system
- **Advanced Search**: Elasticsearch-powered product search with filters
- **Price Tracking**: Live price monitoring and comparison
- **Authentication**: Secure user registration and login
- **Order Management**: Complete e-commerce workflow
- **Admin Dashboard**: Management interface for administrators

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pc-hardware-marketplace
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up -d
   ```

3. The application will be available at http://localhost:8080

### Services

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Elasticsearch**: localhost:9200

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run start:dev
```

## Project Structure

```
pc-hardware-marketplace/
├── backend/          # NestJS API server
├── frontend/         # Next.js React application
├── database/         # Database migrations
├── nginx/           # Nginx configuration
├── docker-compose.yml
└── README.md
```
```

Configure `NEXT_PUBLIC_API_URL=http://localhost:4000/api` in `frontend/.env.local`.

---

Authentication is JWT-based; the frontend stores the token in `localStorage` and sends it via `Authorization: Bearer` headers. Extend admin and seller dashboards to call more backend APIs as your requirements grow.

