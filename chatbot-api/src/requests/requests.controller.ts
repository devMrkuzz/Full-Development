import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { DocumentRequest } from './entities/document-request.entity';
import { Query } from '@nestjs/common';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}


    @Get ('count/document-type/:documentType')
    async getRequestCountByDocumentType(
        @Param('documentType') documentType: string,
    ): Promise<{documentType: string; total: number}> {
        const total = await this.requestsService.countByDocumentType(documentType);
        return { documentType, total};
    }

    @Get()
    async getAllRequests(): Promise<DocumentRequest[]> {
        return this.requestsService.findAll();
    }

    @Get('count/today')
    async getTodayRequestCount(): Promise<{ total: number }> {
        const total = await this.requestsService.countToday();
        return { total };
    }

    @Get('count/month')
    async getThisMonthRequestCount(): Promise< { total: number }> {
        const total = await this.requestsService.countThisMonth();
        return { total };
    }

    @Get('count/year')
    async getThisYearRequestCount(): Promise< { total: number }> {
        const total = await this.requestsService.countThisYear();
        return { total };
    }
    
    @Get('count/completed')
    async genCompleteRequestCount():
    Promise<{ total: number}> {
        const total = await this.requestsService.countCompleted();
        return { total };
    }

    @Get ('count/on-process')
    async getOnProcessRequestCount():
    Promise<{ total: number }> {
        const total = await this.requestsService.countOnProcess();
        return { total };
    }

    @Get('tracking/:trackingCode')
    async getRequestByTrackingCode(
        @Param('trackingCode') trackingCode: string,): Promise<DocumentRequest | null> {
            return this.requestsService.findByTrackingCode(trackingCode);
        }

    @Get('status/:status')
    async getRequestsByStatus(
        @Param('status') status: string,): Promise<DocumentRequest[]> {
            return this.requestsService.findByStatus(status);
        }

    @Get('document-type/:documentType')
    async getRequestDocumentType(
        @Param('documentType') documentType: string, ): Promise<DocumentRequest[]> {
            return this.requestsService.findByDocumentType(documentType);
        }

    @Get ('paginated')
    async getPaginatedRequests(
        @Query('page') page:string,
        @Query('limit') limit:string, ): 
        Promise<DocumentRequest[]> {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;

        return this.requestsService.findPaginated(pageNumber, limitNumber)
        }

    @Get ('sorted')
    async getSortedRequests(
        @Query('order') order: 'ASC' | 'DESC', ):
        Promise<DocumentRequest[]> {
            const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
            return this.requestsService.findSorted(sortOrder);
        }

    @Get ('dashboard/stats')
    async getDashboardStats() {
        return this.requestsService.getDashboardStats();
    }
    
    @Get('count/document-type/:documentType/status/:status')
    async getRequestCountByDocumentTypeAndStatus(
        @Param('documentType') documentType: string,
        @Param('status') status: string,
    ): Promise<{documentType: string; status: string; total: number}> {
        const total = await this.requestsService.countDocumentTypeAndStatus(
            documentType,
            status,
        );
        return { documentType, status, total };
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

