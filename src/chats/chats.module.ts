import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsModel } from './entity/chats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ChatsMessagesService } from './messages/messages.service';
import { MessagesModel } from './messages/entity/messages.entity';
import { ChatsMessagesController } from './messages/messages.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      ChatsModel,
      MessagesModel,
    ]),
  ],
  controllers: [
    ChatsController,
    ChatsMessagesController,
  ],
  providers: [
    ChatsService,
    ChatsGateway,
    ChatsMessagesService,
  ],
})
export class ChatsModule {}