# TaskAdmin backend

Task admin backend made with node and express.

## Development Notes

During initial backend development, the usual `feature/` branch convention was not followed, as this was intended as a quick implementation to connect to the frontend and validate core functionality.

Once stabilized, it is recommended to implement a more formal branch structure (such as `feature/`, `bugfix/`, `hotfix/`, etc.) to facilitate collaboration and maintenance.

## Pre requisites

copy .env-template to .env and fill user and password database.

## Install dependencies

```bash
npm install
```

## Available scripts

- linting:

```bash
npm run lint
```

- development:

```bash
npm run start:dev
```

- production:

```bash
npm run start
```

## Build and up application and db:

```bash
docker compose up --build -d
```

- App is avaiable in http://localhost:3000.
- Mongodb database is available in http://localhost:27017

## Stop backend and db services (and delete containers):

```bash
docker compose down
```

## Start and stop without recreate containers:

Starts containers:

```bash
docker compose start
```

Stop containers but not delete them:

```bash
docker compose stop
```

## To view containers running:

```bash
docker compose ps
```

## To view backend logs:

```bash
docker compose logs -f task-admin-backend
```

## Available endpoints:

See postman folder with examples
