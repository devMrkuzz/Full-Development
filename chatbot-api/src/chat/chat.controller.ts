import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller ('chat')
 export class ChatController {
  constructor (private readonly chatService: ChatService) {}

    @Post ()
    async sendMessage(@Body () body: any) {
      const message = body?.message;

      if (!message) {
        return { error: 'Message is required',};
      }

      return this.chatService.handleMessage(message, body?.sessionId);
    }
 }