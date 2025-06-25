import { FindManyOptions } from "typeorm";
import { CommentsModel } from "../entities/comments.entity";

export const DEFAULT_COMMENT_FIND_OPTIONS: FindManyOptions<CommentsModel> = {
    relations: {
        user: true,
    },
    select: {
        user: {
            id: true,
            nickname: true,
        },
    }
}
