import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRequest, RequestStatus, DocumentType } from './request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(DocumentRequest)
    private requestsRepository: Repository<DocumentRequest>,
  ) {}

  private generateTrackingCode(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `REQ-${year}-${random}`;
  }

  async create(
    requesterId: string,
    documentType: DocumentType,
    metadata: Record<string, any>,
  ): Promise<DocumentRequest> {
    const request = this.requestsRepository.create({
      trackingCode: this.generateTrackingCode(),
      requester: { id: requesterId } as any,
      documentType,
      metadata,
      status: RequestStatus.PENDING,
    });
    return this.requestsRepository.save(request as any);
  }

  async findAll(): Promise<DocumentRequest[]> {
    return this.requestsRepository.find({
      relations: ['requester', 'assignedTo'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findByTrackingCode(
    trackingCode: string,
  ): Promise<DocumentRequest | null> {
    return this.requestsRepository.findOne({
      where: { trackingCode },
      relations: ['requester', 'assignedTo'],
    });
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
    notes?: string,
  ): Promise<DocumentRequest> {
    const request = await this.requestsRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    request.status = status;
    if (notes) request.notes = notes;
    if (status === RequestStatus.COMPLETED) {
      request.completedAt = new Date();
    }
    return this.requestsRepository.save(request);
  }
}