# Docker Setup for MCP Nexus

This directory contains Docker configuration to run the MCP Nexus Next.js application in a containerized environment.

## Quick Start

1. **Make sure Docker is running**
2. **Run the setup script:**
   ```bash
   ./dev-setup.sh
   ```

## Manual Setup

1. **Build and run the containers:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d
   ```

## Services

- **nextjs-app**: The Next.js application running on port 3000
- **sqlserver**: Microsoft SQL Server Express on port 1433 (optional)

## Environment Variables

The Docker setup uses the `.env` file in this directory. Key variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `MCP_CONNECTION_STRING`: Database connection (points to Docker SQL Server)
- `MCP_NEXUS_URL`: MCP server URL
- `MCP_SQL_COMMAND`: Path to MCP executable

## Development Workflow

1. **Start the development environment:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f nextjs-app
   ```

3. **Access the application:**
   - Next.js App: http://localhost:3000
   - MCP Nexus: http://localhost:3000/mcp-nexus

4. **Stop the environment:**
   ```bash
   docker-compose down
   ```

## File Structure

```
.
├── Dockerfile              # Next.js app container
├── docker-compose.yml      # Multi-service setup
├── dev-setup.sh           # Quick setup script
├── .dockerignore          # Docker ignore rules
└── .env                   # Environment configuration
```

## Hot Reloading

The setup supports hot reloading by mounting your source code as a volume. Changes to your code will automatically trigger rebuilds.

## SQL Server Access

If you enable the SQL Server container, you can connect using:

- **Host**: localhost
- **Port**: 1433
- **Username**: SA
- **Password**: YourStrong!Passw0rd

## Troubleshooting

### Port Already in Use
```bash
# Kill processes using port 3000
lsof -ti:3000 | xargs kill -9
```

### Container Issues
```bash
# Rebuild containers
docker-compose build --no-cache
docker-compose up --force-recreate
```

### View Container Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs nextjs-app
```

### Shell Access
```bash
# Access the Next.js container
docker-compose exec nextjs-app sh
```
