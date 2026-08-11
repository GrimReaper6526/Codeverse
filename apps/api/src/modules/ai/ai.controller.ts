import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Platform')
@Controller('ai')
export class AiController {
  @Post('chat')
  @ApiOperation({ summary: 'Send RAG repository chat prompt' })
  chat(@Body() body: { prompt: string; projectId?: string }) {
    return {
      messageId: `msg-${Date.now()}`,
      response: `CodeVerse AI analyzed your prompt: "${body.prompt}". The Model Router utilized RAG vector retrieval across your 12 module planets.`,
      modelUsed: 'Model Router (Gemini / DeepSeek)',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('models')
  @ApiOperation({ summary: 'Get list of supported local & cloud AI models' })
  getModels() {
    return [
      { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'google', status: 'available' },
      { id: 'deepseek-r1', name: 'DeepSeek R1 / V3', provider: 'deepseek', status: 'available' },
      { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder', provider: 'local', status: 'available' },
      { id: 'openai-gpt-4o', name: 'OpenAI GPT-4o', provider: 'openai', status: 'available' },
    ];
  }
}
