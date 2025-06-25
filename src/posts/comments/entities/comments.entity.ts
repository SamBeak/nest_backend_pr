import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CommentsModel extends BaseModel {
    @ManyToOne(() => PostsModel, (post) => post.comments)
    post: PostsModel;
    
    @ManyToOne(() => UsersModel, (user) => user.postComments)
    user: UsersModel;
    
    @Column()
    @IsString()
    comment: string;
    
    @Column(
        {
            default: 0,
        }
    )
    @IsNumber()
    likeCount: number;
}