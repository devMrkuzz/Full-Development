import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RequestModule } from './requests/requests.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { RagModule } from './rag/rag.module';
@Module({
  imports: [

    ConfigModule.forRoot ({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5Ydek6Q9',
      database: 'chatbot_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  
    ChatModule,
    HealthModule,
    RequestModule,
    RagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}