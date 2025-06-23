import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessageDto } from "./messages/dto/create-message.dto";
import { ChatsMessagesService } from "./messages/messages.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
    
    constructor(
        private readonly chatsService: ChatsService,
        private readonly chatsMessagesService: ChatsMessagesService,
    ) {}
    
    @WebSocketServer()
    server: Server; // 현재 namespace의 서버
    
    handleConnection(socket: Socket) {
        console.log(`on connect called: ${socket.id}`);
    }
    
    @SubscribeMessage('create_chat')
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
        const chat = await this.chatsService.createChat(data);
    }
    
    @SubscribeMessage('enter_chat')
    async enterChat(
        // 방의 chat ID들을 리스트로 받는다
        @MessageBody() data : EnterChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
		for (const chatId of data.chatIds) {
			const exists = await this.chatsService.checkIfChatExists(chatId);
			
			if (!exists) {
				throw new WsException({
					statusCode: 100,
					message: `${chatId}는 존재하지 않는 채팅방입니다.`,
				});
			}
		}
        socket.join(data.chatIds.map((x) => x.toString()));
    }
    
    // socket.on('send_message', (message)=> {console.log(message)})
    @SubscribeMessage('send_message')
    async sendMessage(
        @MessageBody() dto: CreateMessageDto,
        @ConnectedSocket() socket: Socket,
    ) {
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
        
        if (!chatExists) {
            throw new WsException({
                statusCode: 100,
                message: `${dto.chatId}는 존재하지 않는 채팅방입니다.`,
            });
        }
        
        const message = await this.chatsMessagesService.createMessage(dto);
        
        socket.to(message.chat.id.toString()).emit('receive_message', message.message);
    }
}