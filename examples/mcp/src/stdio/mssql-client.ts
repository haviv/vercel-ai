import { openai } from '@ai-sdk/openai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { experimental_createMCPClient, streamText, stepCountIs } from 'ai';
import 'dotenv/config';
import * as readline from 'readline';

async function main() {
  let mcpClient: Awaited<ReturnType<typeof experimental_createMCPClient>> | undefined;

  try {
    // Create stdio transport for MSSQL MCP server
    const stdioTransport = new StdioClientTransport({
      command: '/Users/havivrosh/work/SQL-AI-samples/MssqlMcp/dotnet/MssqlMcp/bin/Debug/net9.0/MssqlMcp',
      args: [],
      env: {
        CONNECTION_STRING: "Server=localhost;Initial Catalog=profiletailor;TrustServerCertificate=True;Pooling=True;User ID=SA;Password=YourStrong!Passw0rd;"
      },
    });

    mcpClient = await experimental_createMCPClient({
      transport: stdioTransport,
    });

    // Get the tools from the MCP client (no need to specify schemas as they come from the server)
    const tools = await mcpClient.tools();

    // Display available tools
    console.log('🔧 Available tools from MSSQL MCP server:');
    const toolNames = Object.keys(tools);
    if (toolNames.length > 0) {
      toolNames.forEach((toolName, index) => {
        console.log(`  ${index + 1}. ${toolName}`);
      });
    } else {
      console.log('  No tools available');
    }
    console.log('');

    // Create readline interface for interactive input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n🗄️ Ask me anything about the database (or type "exit" to quit): '
    });

    console.log('🚀 SQL Database AI Assistant started!');
    console.log('💡 I can help you query and analyze data from the MSSQL database.');
    rl.prompt();

    // Handle each line of input
    rl.on('line', async (input) => {
      const question = input.trim();
      
      if (question.toLowerCase() === 'exit' || question.toLowerCase() === 'quit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      if (!question) {
        rl.prompt();
        return;
      }

      console.log('\n🔄 Processing your database question...\n');

      try {
        const result = streamText({
          model: openai('gpt-4o-mini'),
          tools,
          stopWhen: stepCountIs(10),
          system: `You are an expert database analyst with access to a MSSQL database called 'profiletailor'. 
Use the available database tools to query and analyze data when needed to provide accurate and detailed information.
When writing SQL queries, be careful about SQL syntax and always consider the database schema.
Provide clear explanations of the data you retrieve and any insights you can derive from it.`,
          prompt: question,
          onError: ({ error }) => {
            console.error('❌ Error:', error);
          },
          onStepFinish: async ({ toolResults }) => {
            if (toolResults && toolResults.length > 0) {
              console.log('\n📊 Database Query Results:');
              toolResults.forEach((result, index) => {
                console.log(`  ${index + 1}. ${result.toolName}:`);
                if (result.output && typeof result.output === 'object') {
                  console.log(JSON.stringify(result.output, null, 4));
                } else {
                  console.log(result.output);
                }
              });
              console.log('');
            }
          },
        });

        // Stream the text output to stdout
        for await (const textPart of result.textStream) {
          process.stdout.write(textPart);
        }

        // Wait for the stream to finish
        await result.text;
        
        console.log('\n');
        console.log('✅ Response complete!');
        
      } catch (error) {
        console.error('❌ An error occurred:', error);
      }

      rl.prompt();
    });

    // Handle exit gracefully
    rl.on('close', async () => {
      console.log('\n🔄 Shutting down...');
      await mcpClient?.close();
      process.exit(0);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      console.log('\n\n🔄 Received interrupt signal, shutting down...');
      rl.close();
    });

  } catch (error) {
    console.error('❌ Failed to initialize MSSQL MCP client:', error);
    await mcpClient?.close();
    process.exit(1);
  }
}

main().catch(console.error);
