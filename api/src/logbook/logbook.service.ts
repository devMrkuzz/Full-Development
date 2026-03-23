import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorLog } from './visitor-log.entity';

@Injectable()
export class LogbookService {
  constructor(
    @InjectRepository(VisitorLog)
    private visitorLogRepository: Repository<VisitorLog>,
  ) {}

  async create(data: Partial<VisitorLog>): Promise<VisitorLog> {
    const log = this.visitorLogRepository.create(data);
    return this.visitorLogRepository.save(log);
  }

  async findAll(): Promise<VisitorLog[]> {
    return this.visitorLogRepository.find({
      order: { loggedAt: 'DESC' },
    });
  }

  async findToday(): Promise<VisitorLog[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.visitorLogRepository
      .createQueryBuilder('log')
      .where('log.loggedAt >= :today', { today })
      .andWhere('log.loggedAt < :tomorrow', { tomorrow })
      .orderBy('log.loggedAt', 'DESC')
      .getMany();
  }
}