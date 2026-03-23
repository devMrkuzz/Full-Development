import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRequest, RequestStatus } from '../requests/request.entity';
import { VisitorLog } from '../logbook/visitor-log.entity';
import { InquirySession } from '../inquiries/inquiry.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DocumentRequest)
    private requestsRepository: Repository<DocumentRequest>,
    @InjectRepository(VisitorLog)
    private visitorLogRepository: Repository<VisitorLog>,
    @InjectRepository(InquirySession)
    private sessionRepository: Repository<InquirySession>,
  ) {}

  async getOverview() {
    const totalRequests = await this.requestsRepository.count();
    const pendingRequests = await this.requestsRepository.count({
      where: { status: RequestStatus.PENDING },
    });
    const completedRequests = await this.requestsRepository.count({
      where: { status: RequestStatus.COMPLETED },
    });
    const totalVisitors = await this.visitorLogRepository.count();
    const totalInquiries = await this.sessionRepository.count();

    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      totalVisitors,
      totalInquiries,
    };
  }

  async getRequestsByDocumentType() {
    return this.requestsRepository
      .createQueryBuilder('request')
      .select('request.documentType', 'documentType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.documentType')
      .getRawMany();
  }

  async getRequestsByStatus() {
    return this.requestsRepository
      .createQueryBuilder('request')
      .select('request.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.status')
      .getRawMany();
  }

  async getDailyRequests() {
    return this.requestsRepository
      .createQueryBuilder('request')
      .select('DATE(request.submittedAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(request.submittedAt)')
      .orderBy('date', 'DESC')
      .limit(30)
      .getRawMany();
  }

  async getVisitorsByDay() {
    return this.visitorLogRepository
      .createQueryBuilder('log')
      .select('DATE(log.loggedAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(log.loggedAt)')
      .orderBy('date', 'DESC')
      .limit(30)
      .getRawMany();
  }
}