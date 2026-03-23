import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { AiService } from './ai.service';
import { InquirySession, InquiryMessage } from './inquiry.entity';
import { KnowledgeBase } from './knowledge-base.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquirySession,
      InquiryMessage,
      KnowledgeBase,
    ]),
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService, AiService],
  exports: [InquiriesService, AiService],
})
export class InquiriesModule {}