export class PromptEngine {
  public static buildRepositorySystemPrompt(repoName: string, symbolCount: number): string {
    return `You are CodeVerse AI, an expert software architecture agent operating on the 3D software universe for repository "${repoName}". 
Repository Context: ${symbolCount} parsed symbols across monorepo packages.
Rules:
1. Provide concise, highly technical responses.
2. Reference specific module node paths (e.g. /apps/web, /packages/universe-sdk).
3. Suggest concrete code enhancements and architecture refactorings.`;
  }

  public static formatRAGPrompt(userPrompt: string, codeSnippets: string[]): string {
    const context = codeSnippets.join('\n---\n');
    return `Context retrieved from 3D Software Graph:
${context}

User Question: ${userPrompt}`;
  }
}
