import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommentsModel } from './entities/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentsRepository: Repository<CommentsModel>,
        private readonly commonService: CommonService,
    ) {}
    
    paginateComments(
        postId: number,
        dto: PaginateCommentsDto,
    ){
        return this.commonService.paginate(
            dto,
            this.commentsRepository,
            {
                where: {
                    post: {
                        id: postId,
                    },
                },
                ...DEFAULT_COMMENT_FIND_OPTIONS,
            },
            `posts/${postId}/comments`,
        )
    }
    
    async getCommentById(id: number) {
        const comment = await this.commentsRepository.findOne({
            where: {
                id,
            },
            ...DEFAULT_COMMENT_FIND_OPTIONS,
        });
        
        if (!comment) {
            throw new BadRequestException(`id: ${id} Comments는 존재하지 않습니다.`);
        }
        
        return comment;
    }
    
    async createComment(
        dto: CreateCommentsDto,
        postId: number,
        user: UsersModel,
    ) {
        return this.commentsRepository.save({
            ...dto,
            post: {
                id: postId,
            },
            user: {
                id: user.id,
            },
        })
    }
    
    async updateComment(
        commentId: number,
        dto: UpdateCommentsDto,
    ) {
        
        const comment = await this.getCommentById(commentId);
        
        if (!comment) {
            throw new BadRequestException(`id: ${commentId} Comments는 존재하지 않습니다.`);
        }
        
        const prevComment = await this.commentsRepository.preload({
            id: commentId,
            ...dto,
        });
        
        const newComment = await this.commentsRepository.save(prevComment);
        
        return newComment;
    }
    
    async deleteComment(commentId: number) {
        const comment = await this.getCommentById(commentId);
        
        if (!comment) {
            throw new BadRequestException(`id: ${commentId} Comments는 존재하지 않습니다.`);
        }
        
        await this.commentsRepository.delete(commentId);
        
        return commentId;
    }
}
