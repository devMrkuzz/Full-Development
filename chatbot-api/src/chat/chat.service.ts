import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { GeminiService } from '../gemini/gemini.service';
import { RagService } from '../rag/rag.service';
import { DocumentRequest } from '../requests/entities/document-request.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSessionRepo: Repository<ChatSession>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,

    @InjectRepository(DocumentRequest)
    private readonly documentRequestRepo: Repository<DocumentRequest>,

    private readonly geminiService: GeminiService,
    private readonly ragService: RagService,
  ) {}

  async handleMessage(message: string, sessionId?: string) {
    let session: ChatSession | null = null;

    if (sessionId) {
      session = await this.chatSessionRepo.findOne({
        where: { id: sessionId },
      });
    }

    if (!session) {
      session = this.chatSessionRepo.create({
        language: 'auto',
      });

      session = await this.chatSessionRepo.save(session);
    }

    const userMessage = this.chatMessageRepo.create({
      session,
      role: 'user',
      content: message,
    });

    await this.chatMessageRepo.save(userMessage);

    let botReplyText =
      'Sorry, I cannot process your request at the moment. Please try again later.';

    if (session.isRequestFlow && session.requestStep === 'full_name') {
      session.requesterFullName = message;
      session.requestStep = 'purpose';

      await this.chatSessionRepo.save(session);

      botReplyText = `Thank you. What is your purpose for requesting ${session.pendingDocumentType}?`;
    } else if (session.isRequestFlow && session.requestStep === 'purpose') {
      session.requesterPurpose = message;
      session.requestStep = 'contact';

      await this.chatSessionRepo.save(session);

      botReplyText =
        'Got it. Lastly, please provide your contact information (email or phone number).';
    } else if (session.isRequestFlow && session.requestStep === 'contact') {
      session.requesterContact = message;
      session.requestStep = 'completed';
      session.isRequestFlow = false;

      await this.chatSessionRepo.save(session);

      const trackingCode = `REQ-${Date.now()}`;

      const newRequest = this.documentRequestRepo.create({
        trackingCode,
        requesterRole: 'VISITOR',
        requesterName: session.requesterFullName ?? 'UNKNOWN',
        contactNumber: session.requesterContact ?? '',
        documentType: session.pendingDocumentType ?? 'DOCUMENT',
        purpose: session.requesterPurpose ?? '',
        status: 'PENDING',
      });

      await this.documentRequestRepo.save(newRequest);

      botReplyText = `Thank you. Your document request has been recorded successfully. Your tracking code is ${trackingCode}. We will process your request and contact you soon.`;
    } else {
      const lowerMessage = message.toLowerCase();

      const isDocumentRequest =
        lowerMessage.includes('request') ||
        lowerMessage.includes('tor') ||
        lowerMessage.includes('certificate') ||
        lowerMessage.includes('document');

      if (isDocumentRequest) {
        let detectedDocumentType = 'DOCUMENT';

        if (lowerMessage.includes('tor')) {
          detectedDocumentType = 'TOR';
        } else if (
          lowerMessage.includes('certificate of enrollment') ||
          lowerMessage.includes('coe')
        ) {
          detectedDocumentType = 'COE';
        }

        session.isRequestFlow = true;
        session.requestStep = 'full_name';
        session.pendingDocumentType = detectedDocumentType;

        await this.chatSessionRepo.save(session);

        botReplyText = `Sure. You are requesting ${detectedDocumentType}. Please provide your full name.`;
      } else {
        const ragAnswer = this.ragService.findRelevantAnswer(message);

        if (ragAnswer) {
          botReplyText = ragAnswer;
        } else {
          botReplyText =
            'AI service is currently unavailable. Please try again later.';
        }
      }
    }

    const botMessage = this.chatMessageRepo.create({
      session,
      role: 'assistant',
      content: botReplyText,
    });

    await this.chatMessageRepo.save(botMessage);

    return {
      sessionId: session.id,
      botReply: botReplyText,
    };
  }
}