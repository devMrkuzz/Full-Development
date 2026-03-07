import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
    imports: [TypeOrmModule.forFeature
        ([ChatMessage, ChatSession]), GeminiModule,
    ],
    controllers: [ChatController],
    providers: [ChatService],
})

export class ChatModule {}