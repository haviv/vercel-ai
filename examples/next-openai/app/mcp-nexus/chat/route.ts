import { openai } from '@ai-sdk/openai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  convertToModelMessages,
  experimental_createMCPClient,
  stepCountIs,
  streamText,
} from 'ai';
import { mcpConfig } from '../config/mcp-config';
import { systemPrompts } from '../config/system-prompts';

export async function POST(req: Request) {
  const url = new URL(mcpConfig.nexus.url);
  const transport = new StreamableHTTPClientTransport(url);
  let mssqlMcpClient: Awaited<ReturnType<typeof experimental_createMCPClient>> | undefined;

  const mssqlStdioTransport = new StdioClientTransport({
      command: mcpConfig.mssql.command,
      args: mcpConfig.mssql.args,
      env: mcpConfig.mssql.env,
    });

    mssqlMcpClient = await experimental_createMCPClient({
      transport: mssqlStdioTransport,
    });

   const mssqlTools = await mssqlMcpClient.tools();
   const tools = { ...mssqlTools };
   const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  const [client, { messages }] = await Promise.all([
    mssqlMcpClient,
    req.json(),
  ]);

  // Print all messages for debugging context length issues
  console.log('=== DEBUGGING CONTEXT LENGTH ===');
  console.log('Total messages count:', messages.length);
  
  // Only use the latest user message to prevent context buildup
  const latestUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();
  const messagesToSend = latestUserMessage ? [latestUserMessage] : [];
  
  console.log('Latest user message:', JSON.stringify(latestUserMessage, null, 10));
  console.log('Sending only the latest user input to prevent context buildup');
  
  let contentSize = 0;
  if (latestUserMessage?.parts) {
    latestUserMessage.parts.forEach((part: any) => {
      if (part.text) contentSize += part.text.length;
    });
  }
  
  console.log('Latest message size:', contentSize, 'characters');
  console.log('System prompt size:', systemPrompts.grcAssistant.length, 'characters');
  console.log('Total size:', contentSize + systemPrompts.grcAssistant.length, 'characters');
  console.log('Estimated tokens:', Math.ceil((contentSize + systemPrompts.grcAssistant.length) / 4));
  console.log('=== END DEBUG INFO ===\n');
  try {
    const tools = await client.tools();

    const result = streamText({
      model: openai('gpt-4o'),
      tools,
      stopWhen: stepCountIs(mcpConfig.settings.maxSteps),
      onStepFinish: async ({ toolResults }) => {
        console.log(`STEP RESULTS: ${JSON.stringify(toolResults, null, 2)}`);
      },
      system: systemPrompts.grcAssistant,
      messages: convertToModelMessages(messagesToSend), // Only send latest user message
      onFinish: async () => {
        await client.close();
      },
      // Optional, enables immediate clean up of resources but connection will not be retained for retries:
      // onError: async error => {
      //   await client.close();
      // },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
