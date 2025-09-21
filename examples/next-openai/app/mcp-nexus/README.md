# MCP Nexus - GRC Assistant

This directory contains a GRC (Governance, Risk & Compliance) Assistant powered by the Model Context Protocol (MCP).

## Setup

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure the following:

```bash
# MCP (Model Context Protocol) Configuration
MCP_CONNECTION_STRING="Server=localhost;Initial Catalog=your_database;TrustServerCertificate=True;Pooling=True;User ID=your_user;Password=your_password;"
MCP_NEXUS_URL="http://localhost:3000/mcp-nexus/server"
MCP_SQL_COMMAND="/path/to/your/MssqlMcp/executable"
```

### MCP SQL Server

You'll need to build and run the MssqlMcp server. This should be a separate executable that provides database access through the Model Context Protocol.

1. Build your MssqlMcp server
2. Update `MCP_SQL_COMMAND` in your `.env` file to point to the executable
3. Configure your database connection string in `MCP_CONNECTION_STRING`

## Features

- **Database Querying**: Query your GRC database through natural language
- **Real-time Chat**: Interactive chat interface with streaming responses
- **Rich Formatting**: Support for tables, code blocks, and markdown
- **Tool Integration**: Uses MCP tools for structured database access

## Usage

1. Start your Next.js development server: `npm run dev`
2. Navigate to `/mcp-nexus`
3. Start chatting with your GRC data!

## Architecture

- `/page.tsx` - Main chat interface
- `/chat/route.ts` - Chat API endpoint
- `/server/route.ts` - MCP server endpoint
- `/config/mcp-config.ts` - MCP configuration
- `/config/system-prompts.ts` - System prompts for the AI
