# Exhibition Curator Project API

The project is hosted on [Render](https://render.com/) (both API and database)
but can be deployed on any other platform that supports Node.js.

The project uses [Nitro](https://nitro.unjs.io/) as a framework and PostgreSQL as a database.

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
