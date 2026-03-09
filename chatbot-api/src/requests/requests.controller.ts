import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { DocumentRequest } from './entities/document-request.entity';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get()
    async getAllRequests(): Promise<DocumentRequest[]> {
        return this.requestsService.findAll();
    }

    @Get(':id') 
    async getRequestbyId(@Param('id') id: string): Promise<DocumentRequest | null> {
        return this.requestsService.findOne(id);
    }

    @Patch (':id/status')
    async updateRequestStatus(
        @Param('id') id:string,
        @Body() body: { status: string },
    ): Promise<DocumentRequest | null> {
        return this.requestsService.updateStatus(id, body.status);
    }

    @Get('count/all')
    async getTotalRequestCount(): Promise<{ total: number }> {
        const total = await this.requestsService.countAll();
        return { total };
    }

    @Get('count/status/:status')
    async getRequestCountByStatus(
        @Param('status') status: string,
    ): Promise<{status: string; total: number }> {
        const total = await this.requestsService.countByStatus(status);
        return { status, total};
    }
}

