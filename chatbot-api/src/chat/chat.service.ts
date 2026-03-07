import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { GeminiService } from '../gemini/gemini.service';
import { RagService } from '../rag/rag.service';
@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatSession)
        private readonly chatSessionRepo: Repository<ChatSession>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepo: Repository<ChatMessage>,
        private readonly geminiService: GeminiService,
        private readonly ragService: RagService,
     ) {}

    async handleMessage(message: string, sessionId?: string) {
            let session: ChatSession | null = null;

            // If session is exist - continue
            if (sessionId) {
                session = await this.chatSessionRepo.findOne({
                    where: { id: sessionId},
                });
            }

            // if no session - create new one
            if (!session) {
                session = this.chatSessionRepo.create ({
                    language: 'auto',
                });

                session = await this.chatSessionRepo.save(session);
            }

        // Save user message
        const userMessage = this.chatMessageRepo.create ({
            session, 
            role: 'user', 
            content: message,
        });
        await this.chatMessageRepo.save(userMessage);

        // Tempory bot reply
        let botReplyText: string = 'Sorry, I cannot process your request at the moment. Please try again later.';

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
           } else if (lowerMessage.includes('certificate of enrollment') || lowerMessage.includes('coe')) {
            detectedDocumentType = 'COE';
           }

           session.isRequestFlow = true;
           session.requestStep = 'fulle_name';
           session.pendingDocumentType = detectedDocumentType;

           await this.chatSessionRepo.save(session);

           botReplyText = `Sure, You are requesting ${detectedDocumentType}. Please provide your full name.`;
        } else {
            const ragAnswer = this.ragService.findRelevantAnswer(message);

            if (ragAnswer) {
                botReplyText = ragAnswer;
            } else {
                botReplyText = 'AI service is currently unavailable. Please try again later.';
            }
        }

        const botMessage = this.chatMessageRepo.create ({
            session,
            role: 'assistant',
            content: botReplyText,
        });
        await this.chatMessageRepo.save(botMessage);

        return {
            sessionId: session.id,
            botReply: botReplyText,
        }
    }
}
