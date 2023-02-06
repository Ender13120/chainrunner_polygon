import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnchainAutomationModule } from './onchain-automation/onchain-automation.module';
import { AttackSystemModule } from './attack-system/attack-system.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockCrawler } from './onchain-automation/block-crawler.service';
import { AttackController } from './attack-system/attacks.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AttackService } from './attack-system/attacks.service';
import { AttackCrawler } from './attack-system/attacksData.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OnchainAutomationModule,
    AttackSystemModule,
    ScheduleModule.forRoot(),
    PrismaModule,
  ],
  controllers: [AppController, AttackController],
  providers: [
    AppService,
    PrismaService,
    AttackCrawler,
    BlockCrawler,
    AttackService,
  ],
})
export class AppModule {}
