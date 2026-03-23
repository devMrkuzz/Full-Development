import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquirySession, InquiryMessage } from './inquiry.entity';
import { AiService } from './ai.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(InquirySession)
    private sessionRepository: Repository<InquirySession>,
    @InjectRepository(InquiryMessage)
    private messageRepository: Repository<InquiryMessage>,
    private aiService: AiService,
  ) {}

  async createSession(userId?: string): Promise<InquirySession> {
    const session = this.sessionRepository.create({
      sessionToken: uuidv4(),
      user: userId ? ({ id: userId } as any) : null,
    });
    return this.sessionRepository.save(session);
  }

  async chat(
    sessionId: string,
    userMessage: string,
  ): Promise<{ message: InquiryMessage; sources: string[] }> {
    const history = await this.getSessionMessages(sessionId);

    const sessionHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    await this.addMessage(sessionId, 'user', userMessage);

    const { response, sources } = await this.aiService.chat(
      userMessage,
      sessionHistory,
    );

    const aiMessage = await this.addMessage(
      sessionId,
      'assistant',
      response,
      sources.map((s) => ({ source: s })),
    );

    return { message: aiMessage, sources };
  }

  async addMessage(
    sessionId: string,
    role: string,
    content: string,
    ragSources?: Record<string, any>[],
  ): Promise<InquiryMessage> {
    const message = this.messageRepository.create({
      session: { id: sessionId } as any,
      role,
      content,
      ragSources,
    });
    return this.messageRepository.save(message);
  }

  async getSessionMessages(sessionId: string): Promise<InquiryMessage[]> {
    return this.messageRepository.find({
      where: { session: { id: sessionId } },
      order: { sentAt: 'ASC' },
    });
  }

  async endSession(sessionId: string): Promise<InquirySession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new Error('Session not found');
    session.endedAt = new Date();
    return this.sessionRepository.save(session);
  }

  async addKnowledge(
    title: string,
    content: string,
    category: string,
    sourceLabel: string,
  ) {
    return this.aiService.addKnowledge(title, content, category, sourceLabel);
  }
}