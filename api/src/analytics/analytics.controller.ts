import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STAFF', 'ADMIN')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('requests/by-type')
  getRequestsByDocumentType() {
    return this.analyticsService.getRequestsByDocumentType();
  }

  @Get('requests/by-status')
  getRequestsByStatus() {
    return this.analyticsService.getRequestsByStatus();
  }

  @Get('requests/daily')
  getDailyRequests() {
    return this.analyticsService.getDailyRequests();
  }

  @Get('visitors/daily')
  getVisitorsByDay() {
    return this.analyticsService.getVisitorsByDay();
  }
}