import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRequest } from './entities/document-request.entity';

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(DocumentRequest)
        private readonly documentRequestRepo: Repository<DocumentRequest>,
    ) {}

    async findAll(): Promise<DocumentRequest[]> {
        return this.documentRequestRepo.find({
            order: {
                createdAt: 'DESC',
            }
        });
    }
     async findOne(id: string):
        Promise<DocumentRequest | null> {
            return this.documentRequestRepo.findOne({
                where: { id },

            });
        }

        async updateStatus(id: string, status: string): Promise<DocumentRequest | null> {
            const request = await this.documentRequestRepo.findOne({
                where: { id },
            });

            if (!request) {
                return null;
            }

            request.status = status;
            return this.documentRequestRepo.save(request);
        }

        async countAll(): Promise<number>{
            return this.documentRequestRepo.count();
        }

        async countByStatus(status: string): Promise<number> {
            return this.documentRequestRepo.count({
                where: { status }
            });
        }

        async countByDocumentType(documentType: string): Promise<number> {
            return this.documentRequestRepo.count({
                where: { documentType },
            })
        }

        async countThisMonth(): Promise<number> {
           const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            return this.documentRequestRepo
            .createQueryBuilder('request')
            .where('request.createdAt BETWEEN :start AND :end', {
                start: startOfMonth,
                end: endOfMonth,
            })
            .getCount();
        }

        async countThisYear(): Promise<number> {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            return this.documentRequestRepo
            .createQueryBuilder('request')
            .where('request.createdAt >= :startOfYear', {startOfYear})
            .andWhere('request.createdAt <= :endOfYear', { endOfYear }
            ) 
            .getCount();
        }

        async countToday(): Promise<number> {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            return this.documentRequestRepo
            .createQueryBuilder('request')
            .where('request.createdAt BETWEEN :start AND :end', {
                start: startOfDay,
                end: endOfDay,
            })
            .getCount();
        }
}