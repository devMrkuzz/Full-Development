import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KnowledgeBase } from './knowledge-base.entity';

@Injectable()
export class AiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private embedder: any;

  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepository: Repository<KnowledgeBase>,
    private configService: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
    this.model = this.genAI.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_MODEL')!,
    });
  }

  async onModuleInit() {
    const { pipeline } = await import('@xenova/transformers');
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const result = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(result.data as Float32Array);
  }

  async addKnowledge(
    title: string,
    content: string,
    category: string,
    sourceLabel: string,
  ): Promise<KnowledgeBase> {
    const embedding = await this.generateEmbedding(content);
    const knowledge = this.knowledgeBaseRepository.create({
      title,
      content,
      category,
      sourceLabel,
      embedding,
    });
    return this.knowledgeBaseRepository.save(knowledge);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (magA * magB);
  }

  async findRelevantKnowledge(
    query: string,
    topK: number = 5,
  ): Promise<{ knowledge: KnowledgeBase; score: number }[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    const allKnowledge = await this.knowledgeBaseRepository.find();

    const scored = allKnowledge.map((k) => ({
      knowledge: k,
      score: k.embedding
        ? this.cosineSimilarity(queryEmbedding, k.embedding)
        : 0,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((k) => k.score > 0.5);
  }

  async chat(
    userMessage: string,
    sessionHistory: { role: string; content: string }[],
  ): Promise<{ response: string; sources: string[] }> {
    const relevantDocs = await this.findRelevantKnowledge(userMessage);

    const context = relevantDocs
      .map((d) => `[${d.knowledge.sourceLabel}]: ${d.knowledge.content}`)
      .join('\n\n');

    const sources = relevantDocs.map((d) => d.knowledge.sourceLabel);

    const systemPrompt = `You are AskSorSU, the official AI assistant of the Sorsogon State University Registrar's Office. 
Answer only questions related to academic records, document requests, enrollment procedures, university policies, and answer school related questions.
Use ONLY the provided context to answer. If the answer is not in the context, say: "I don't have that information yet. You may visit the Registrar's Office or call the university hotline."
Never make up fees, deadlines, or requirements.
Always be polite and helpful.

CONTEXT:
${context || 'No relevant context found.'}`;

    const history = sessionHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = this.model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am AskSorSU, ready to assist.' }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return { response, sources };
  }
}