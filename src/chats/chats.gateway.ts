import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { CreateMessageDto } from "./messages/dto/create-message.dto";
import { ChatsMessagesService } from "./messages/messages.service";
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";
import { SocketBearerTokenGuard } from "src/auth/guard/socket/socket-bearer-token.guard";
import { UsersModel } from "src/users/entities/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
    
    constructor(
        private readonly chatsService: ChatsService,
        private readonly chatsMessagesService: ChatsMessagesService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}
    
    @WebSocketServer()
    server: Server; // 현재 namespace의 서버
    
    async handleConnection(socket: Socket & { user: UsersModel }) {
        console.log(`on connect called: ${socket.id}`);
        
        const headers = socket.handshake.headers;
        
        const rawToken = headers['authorization'];
        
        try {
            if (!rawToken) {
                socket.disconnect();
            }
            
            const token = this.authService.extractTokenFromHeader(rawToken, true);
            
            const payload = this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email);
            
            socket.user = user;
            
            return true;
        }
        catch (e) {
            socket.disconnect();
        }
    }
    
    @UsePipes(new ValidationPipe({
        transform: true, // dto에 정의된 타입으로 자동 변환
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    @SubscribeMessage('create_chat')
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
    ) {
        const chat = await this.chatsService.createChat(data);
    }
    
    @SubscribeMessage('enter_chat')
    @UsePipes(new ValidationPipe({
        transform: true, // dto에 정의된 타입으로 자동 변환
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async enterChat(
        // 방의 chat ID들을 리스트로 받는다
        @MessageBody() data : EnterChatDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
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
    @UsePipes(new ValidationPipe({
        transform: true, // dto에 정의된 타입으로 자동 변환
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async sendMessage(
        @MessageBody() dto: CreateMessageDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
    ) {
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
        
        if (!chatExists) {
            throw new WsException({
                statusCode: 100,
                message: `${dto.chatId}는 존재하지 않는 채팅방입니다.`,
            });
        }
        
        const message = await this.chatsMessagesService.createMessage(dto, socket.user.id);
        
        socket.to(message.chat.id.toString()).emit('receive_message', message.message);
    }
}