import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsModel } from './entity/chats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatsModel,
      CommonModule,
    ]),
  ],
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ChatsGateway,
  ],
})
export class ChatsModule {}