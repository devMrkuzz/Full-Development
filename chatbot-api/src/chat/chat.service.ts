import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatSession)
        private readonly chatSessionRepo: Repository<ChatSession>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepo: Repository<ChatMessage>,
     ) {}

    async handleMessage(message: string) {

        //create new chat session
        const session = this.chatSessionRepo.create({
            language: 'auto',
        });
        const savedSession = await this.chatSessionRepo.save(session);

        //save user message
        const userMessage = this.chatMessageRepo.create({
            session: savedSession,
            role: 'user',
            content: message,
        });
        await this.chatMessageRepo.save(userMessage);

        //temporary response
        const botReplyText = 
        "Hello! I am a chatbot. I can help you with various tasks. How can I assist you today?";

        //save bot reply
        const botMessage = this.chatMessageRepo.create({
            session: savedSession,
            role: 'assistant',
            content: botReplyText,
        });
        await this.chatMessageRepo.save(botMessage);

        //return response

        return {
            sessionId: savedSession.id,
            userMessage: message,
            botReply: botReplyText,
        };
    }
}
