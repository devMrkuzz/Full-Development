import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRequest } from './entities/document-request.entity';

@Module ({
    imports: [TypeOrmModule.forFeature([DocumentRequest])],
})

export class RequestModule {}