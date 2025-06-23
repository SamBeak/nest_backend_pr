import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ChatsMessagesService } from "./messages.service";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

@Controller('chats/:cid/messages')
export class ChatsMessagesController {
    constructor(
        private readonly chatsMessagesService: ChatsMessagesService,
    ) {}
    
    @Get()
    paginateMessages(
        @Query() dto: BasePaginationDto,
        @Param('cid', ParseIntPipe) id: number
    ) {
        return this.chatsMessagesService.paginateMessages(
            dto,
            {
                where: {
                    chat: {
                        id,
                    },
                },
                relations: {
                    user: true,
                    chat: true,
                },
            },
        );
    }
}
