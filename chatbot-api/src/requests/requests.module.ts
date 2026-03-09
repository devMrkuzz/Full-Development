import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRequest } from './entities/document-request.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module ({
    imports: [TypeOrmModule.forFeature([DocumentRequest])],
    controllers: [RequestsController],
    providers: [RequestsService],
})

export class RequestModule {}