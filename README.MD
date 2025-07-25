# TaskAdmin backend

Task admin backend made with node and express.

## Development Notes

During initial backend development, the usual `feature/` branch convention was not followed, as this was intended as a quick implementation to connect to the frontend and validate core functionality.

Once stabilized, it is recommended to implement a more formal branch structure (such as `feature/`, `bugfix/`, `hotfix/`, etc.) to facilitate collaboration and maintenance.

## Linting code

```bash
npm run lint
```

## Available endpoints:

See postman folder with examples

## 1. Development environment:

### Build and up application and db:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

- App is avaiable in http://localhost:3000.
- Mongodb database is available in http://localhost:27017

### Stop backend and db services (and delete containers):

```bash
docker compose -f docker-compose.dev.yml down
```

### Start and stop without recreate containers:

Starts containers:

```bash
docker compose -f docker-compose.dev.yml start
```

Stop containers but not delete them:

```bash
docker compose -f docker-compose.dev.yml stop
```

## 2.Production environment:

### Build and up application and db:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- App is avaiable in http://localhost:3000.
- Mongodb database is available in http://localhost:27017

### Stop backend and db services (and delete containers):

```bash
docker compose -f docker-compose.prod.yml down
```

### Start and stop without recreate containers:

Starts containers:

```bash
docker compose -f docker-compose.prod.yml start
```

Stop containers but not delete them:

```bash
docker compose -f docker-compose.prod.yml stop
```

## Analizing containers:

1. View containers running:

```bash
docker compose ps
```

2. View backend logs:

- In production:

```bash
docker compose -f docker-compose.prod.yml logs -f task-admin-backend
```

- In development:

```bash
docker compose -f docker-compose.dev.yml logs -f task-admin-backend-dev
```
