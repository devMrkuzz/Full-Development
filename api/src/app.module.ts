import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { LogbookModule } from './logbook/logbook.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { User } from './users/user.entity';
import { DocumentRequest } from './requests/request.entity';
import { VisitorLog } from './logbook/visitor-log.entity';
import { InquirySession, InquiryMessage } from './inquiries/inquiry.entity';
import { KnowledgeBase } from './inquiries/knowledge-base.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST')!,
        port: parseInt(configService.get<string>('DB_PORT')!),
        username: configService.get<string>('DB_USERNAME')!,
        password: configService.get<string>('DB_PASSWORD')!,
        database: configService.get<string>('DB_NAME')!,
        entities: [User, DocumentRequest, VisitorLog, InquirySession, InquiryMessage, KnowledgeBase],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RequestsModule,
    LogbookModule,
    InquiriesModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}