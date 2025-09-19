export const mcpConfig = {
  mssql: {
    command: '/Users/havivrosh/work/SQL-AI-samples/MssqlMcp/dotnet/MssqlMcp/bin/Debug/net9.0/MssqlMcp',
    args: [] as string[],
    env: {
      CONNECTION_STRING: "Server=localhost;Initial Catalog=profiletailor;TrustServerCertificate=True;Pooling=True;User ID=SA;Password=YourStrong!Passw0rd;",
      LOGGING__LOGLEVEL__DEFAULT: "Error",
      LOGGING__LOGLEVEL__MICROSOFT: "Error",
      LOGGING__LOGLEVEL__SYSTEM: "Error",
      LOGGING__LOGLEVEL__MODELCONTEXTPROTOCOL: "Error"
    }
  },
  nexus: {
    url: 'http://localhost:3000/mcp-nexus/server'
  },
  settings: {
    maxSteps: 10
  }
};
