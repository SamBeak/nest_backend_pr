import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch(HttpException) // 잡고 싶은 에러 타입
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost): void {
        
        const socket = host.switchToWs().getClient();
        socket.emit(
            'exception',
            {
                data: exception.getResponse(), // 실제 에러 정보를 받을 수 있다.
            }
        )
    }
}