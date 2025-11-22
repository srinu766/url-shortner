# Database Setup

## Prerequisites
- PostgreSQL installed and running
- Database user with appropriate permissions

## Setup Instructions

1. Install PostgreSQL if you haven't already:
   - Download from: https://www.postgresql.org/download/
   - During installation, note the password you set for the `postgres` user

2. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE url_shortener;
   ```

3. Update the `.env` file with your database credentials:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=url_shortener
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password  # Update this with your actual password
   ```

4. Run the database initialization script:
   ```bash
   npm run migrate
   ```

## Migration Scripts

Migration scripts are located in `db/migrations/` and are executed in alphabetical order.

## Testing the API

After setting up the database, you can test the API endpoints:

1. Start the server:
   ```bash
   npm run dev
   ```

2. Test the endpoints:
   - Health check: `GET http://localhost:3001/healthz`
   - Get all links: `GET http://localhost:3001/api/links`
   - Create a link: `POST http://localhost:3001/api/links`

## API Endpoints

- `GET /api/links` - Get all links
- `POST /api/links` - Create a new short link
- `GET /api/links/:code` - Get a specific link by code
- `DELETE /api/links/:code` - Delete a link by code
- `PUT /api/links/:code/clicks` - Increment link clicks