# Price-Predictor

Price-prediction **ML** project with a **backend** and **frontend** running via Docker.

---

## Prerequisites

Make sure you have **Docker** installed on your machine.  
You can download it from [Docker Desktop](https://www.docker.com/products/docker-desktop/).

---

## Quick Start

### 1. Build Docker containers (no cache)
```bash
docker compose build --no-cache
```
### 2. Start the project
```bash
docker compose up
```

### 3. Verify
```
backend-1  | Starting development server at http://0.0.0.0:8000
frontend-1 | VITE vX.X ready in XXX ms
frontend-1 | Local: http://localhost:3000
```

### Project Structure
├── backend/&nbsp;&nbsp;&nbsp;# Backend code (Django)<br>
├── frontend/&nbsp;&nbsp;&nbsp;# Frontend code (React/Vite)<br>
├── docker-compose.yaml<br>
└── README.md

### How it Works
> - Backend: Handles price prediction logic, API endpoints, and data processing.
> - Frontend: Displays interactive UI for users to view predictions and charts.
> - Docker: Ensures both backend and frontend run seamlessly in isolated containers.
