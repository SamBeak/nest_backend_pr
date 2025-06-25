import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RolesEnum } from "src/users/const/roles.const";
import { PostsService } from "../posts.service";
import { Request } from "express";
import { UsersModel } from "src/users/entities/users.entity";

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
    constructor(
        private readonly postsService: PostsService,
    ){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request & { user: UsersModel };
        
        const { user } = req;
        
        if(!user) {
            throw new UnauthorizedException(`사용자 정보를 가져올 수 없습니다.`);
        }
        
        if(user.role === RolesEnum.ADMIN) {
            return true;
        }
        
        const postId = req.params.postId;
        
        if(!postId) {
            throw new BadRequestException(`Post ID 파라미터는 필수입니다.`);
        }
        
        return this.postsService.isPostMine(user.id, parseInt(postId));
    }
}