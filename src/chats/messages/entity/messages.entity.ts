import { IsString } from "class-validator";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { BaseModel } from "src/common/entities/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class MessagesModel extends BaseModel {
    @ManyToOne(() => ChatsModel, (chat) => chat.messages)
    chat: ChatsModel;
    
    @ManyToOne(() => UsersModel, (user) => user.messages)
    user: UsersModel;
    
    @Column()
    @IsString()
    message: string;
}