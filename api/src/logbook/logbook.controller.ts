import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { LogbookService } from './logbook.service';

export class CreateVisitorLogDto {
  fullName: string;
  purpose: string;
  contact?: string;
  department?: string;
  metadata?: Record<string, any>;
}

@Controller('logbook')
export class LogbookController {
  constructor(private logbookService: LogbookService) {}

  @Post()
  create(@Body() body: CreateVisitorLogDto) {
    return this.logbookService.create(body);
  }

  @Get()
  findAll() {
    return this.logbookService.findAll();
  }

  @Get('today')
  findToday() {
    return this.logbookService.findToday();
  }
}