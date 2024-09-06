# Back-end: NestJS

This application accompanies a tutorial on the Bonsai blog, as part of the series, 
"Supercharge Your NestJS App with Hosted Search." 

## Relevant Branches

There are multiple branches on the base repository which are relevant to this application:

- nestjs/pre-search
- nestjs/with-elasticsearch

## Getting started

1. First, we'll need to copy the `env-example` file to `.env`:
   ```sh
   cp ./env-example ./.env
   ```

2. Next, we'll install our application's dependencies:
   ```shell
   npm install
   ```

3. Now we're ready to run a [PostgreSQL](https://www.postgresql.org/) database locally, via docker. 
   ```sh
   # To run this detached, run `docker compose up -d postgres`, but beware of silent failures!
   docker compose up postgres
   ```

4. Open another terminal, and run the database migrations:
   ```shell
   npm run migration:run
   ```

5. Seed the database with our favorite movie titles. We'll revisit this piece in the next section!
   ```
   npm run seed:run:relational
   ```

6. And finally, start our development server:
   ```shell
   npm run start:dev
   ```

