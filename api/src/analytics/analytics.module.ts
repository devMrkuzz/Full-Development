import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DocumentRequest } from '../requests/request.entity';
import { VisitorLog } from '../logbook/visitor-log.entity';
import { InquirySession } from '../inquiries/inquiry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentRequest,
      VisitorLog,
      InquirySession,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}