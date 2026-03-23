import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
  } from '@nestjs/common';
  import { InquiriesService } from './inquiries.service';
  
  export class CreateSessionDto {
    userId?: string;
  }
  
  export class ChatMessageDto {
    message: string;
  }
  
  export class AddKnowledgeDto {
    title: string;
    content: string;
    category: string;
    sourceLabel: string;
  }
  
  @Controller('inquiries')
  export class InquiriesController {
    constructor(private inquiriesService: InquiriesService) {}
  
    @Post('session')
    createSession(@Body() body: CreateSessionDto) {
      return this.inquiriesService.createSession(body.userId);
    }
  
    @Get('session/:id/messages')
    getMessages(@Param('id') id: string) {
      return this.inquiriesService.getSessionMessages(id);
    }
  
    @Post('session/:id/chat')
    chat(@Param('id') id: string, @Body() body: ChatMessageDto) {
      return this.inquiriesService.chat(id, body.message);
    }
  
    @Patch('session/:id/end')
    endSession(@Param('id') id: string) {
      return this.inquiriesService.endSession(id);
    }
  
    @Post('knowledge')
    addKnowledge(@Body() body: AddKnowledgeDto) {
      return this.inquiriesService.addKnowledge(
        body.title,
        body.content,
        body.category,
        body.sourceLabel,
      );
    }
  }