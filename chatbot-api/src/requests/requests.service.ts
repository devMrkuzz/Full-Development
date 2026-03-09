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
}