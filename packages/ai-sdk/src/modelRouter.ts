export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'google' | 'deepseek' | 'local' | 'openai';
  contextWindow: number;
  supportsVision: boolean;
}

export class ModelRouter {
  private static AVAILABLE_MODELS: AIModelConfig[] = [
    { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'google', contextWindow: 1000000, supportsVision: true },
    { id: 'deepseek-r1', name: 'DeepSeek R1 / V3', provider: 'deepseek', contextWindow: 64000, supportsVision: false },
    { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder (Local)', provider: 'local', contextWindow: 32000, supportsVision: false },
    { id: 'openai-gpt-4o', name: 'OpenAI GPT-4o', provider: 'openai', contextWindow: 128000, supportsVision: true },
  ];

  public getAvailableModels(): AIModelConfig[] {
    return ModelRouter.AVAILABLE_MODELS;
  }

  public selectModelForTask(taskType: 'reasoning' | 'fast_completion' | 'large_context'): AIModelConfig {
    switch (taskType) {
      case 'large_context':
        return ModelRouter.AVAILABLE_MODELS[0]; // Gemini 1.5 Pro
      case 'reasoning':
        return ModelRouter.AVAILABLE_MODELS[1]; // DeepSeek R1
      case 'fast_completion':
      default:
        return ModelRouter.AVAILABLE_MODELS[2]; // Qwen 2.5 Coder Local
    }
  }
}
