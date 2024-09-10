# Art API

## Run

You can run the server using Docker or manually.

### Docker

```shell
docker compose up
```

### Manual

Requirements:

- Node.js v20
- PostgreSQL v16

#### Start

1. Create a database in PostgreSQL.
2. Create a
   `.env` file in the root directory with your database credentials:

```ini
NITRO_DATABASE_URL = postgresql://<username>:<password>@localhost:5432/<database>
```

3. Start the server:
   `npm run dev`
