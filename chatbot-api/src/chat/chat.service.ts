import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { GeminiService } from '../gemini/gemini.service';
@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatSession)
        private readonly chatSessionRepo: Repository<ChatSession>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepo: Repository<ChatMessage>,
        private readonly geminiService: GeminiService,
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
        let botReplyText: string;

        try {
            botReplyText = await this.geminiService.ask(message);
        }catch (error) {
            botReplyText = "Sorry, I'm having trouble processing your request right now.";
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
