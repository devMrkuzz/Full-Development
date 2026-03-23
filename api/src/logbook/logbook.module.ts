import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { VisitorLog } from './visitor-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorLog])],
  controllers: [LogbookController],
  providers: [LogbookService],
  exports: [LogbookService],
})
export class LogbookModule {}