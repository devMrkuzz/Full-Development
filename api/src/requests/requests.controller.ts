import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
  } from '@nestjs/common';
  import { RequestsService } from './requests.service';
  import { DocumentType, RequestStatus } from './request.entity';
  
  export class CreateRequestDto {
    requesterId: string;
    documentType: DocumentType;
    metadata: Record<string, any>;
  }
  
  export class UpdateStatusDto {
    status: RequestStatus;
    notes?: string;
  }
  
  @Controller('requests')
  export class RequestsController {
    constructor(private requestsService: RequestsService) {}
  
    @Post()
    create(@Body() body: CreateRequestDto) {
      return this.requestsService.create(
        body.requesterId,
        body.documentType,
        body.metadata,
      );
    }
  
    @Get()
    findAll() {
      return this.requestsService.findAll();
    }
  
    @Get('track/:code')
    findByTrackingCode(@Param('code') code: string) {
      return this.requestsService.findByTrackingCode(code);
    }
  
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
      return this.requestsService.updateStatus(id, body.status, body.notes);
    }
  }