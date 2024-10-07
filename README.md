# Artanova frontend

See https://github.com/Flammans/artanova

# Artanova backend

This project is hosted on [Railway](https://railway.app/) (both API and database)
but can be deployed on any platform that supports Node.js.

The backend is built using the Nitro framework, with PostgreSQL as the database.

The API retrieves artwork data from multiple configurable sources.
Data is fetched periodically to ensure the database remains up-to-date.

To automate this process, the project utilizes the Nitro tasks feature,
functioning similarly to cron jobs.
Artwork data is updated hourly,
fetching the latest information from external sources
and synchronizing it with the PostgreSQL database.

To trigger the update manually, you can open `/update`.

## Local run

You can run the server using Docker or manually.

### Docker

Just
`docker compose up`

### Manually

1. Install requirements:
    - Node.js v20
    - PostgreSQL v16
2. Create a database in PostgreSQL
3. Create
   `.env` file with
   `NITRO_DATABASE_URL` variable
   (see [env vars](#environment-variables))
4. Start the server:
   `npm run dev`

## Environment Variables

Server configuration is done through environment variables.

For local development,
you can create a
`.env` file in the root directory of the project
and set the necessary variables there.

| Name                 | Description                                                                                          | Default Value |
|----------------------|------------------------------------------------------------------------------------------------------|---------------|
| NITRO_DATABASE_URL   | PostgreSQL database URL (for example `postgresql://<username>:<password>@localhost:5432/<database>`) |               |
| NITRO_ARTWORKS_LIMIT | Maximum number of artworks to fetch from each source per update (0 for unlimited)                    | `100`         |
| NITRO_JWT_SECRET     | Secret key for JWT tokens (important to change in production)                                        | `secret`      |
