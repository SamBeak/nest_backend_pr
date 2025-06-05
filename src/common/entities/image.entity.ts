import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./base.entity";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { ImageModelType } from "../const/image-model.const";
import { Transform } from "class-transformer";
import { join } from "path";
import { POST_PUBLIC_IMAGE_PATH } from "../const/path.const";
import { PostsModel } from "src/posts/entities/posts.entity";

@Entity()
export class ImageModel extends BaseModel {
    @Column({
        default: 0,
    })
    @IsInt()
    @IsOptional()
    order?: number;
    
    @Column({
        enum: ImageModelType,
        default: ImageModelType.POST_IMAGE,
    })
    @IsEnum(ImageModelType)
    @IsString()
    type: ImageModelType;
    
    @Column()
    @IsString()
    @Transform(({value, obj}) => {
        // obj는 ImageModel이 인스턴스화 된 현재 객체를 나타낸다.
        if (obj.type === ImageModelType.POST_IMAGE) {
            return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
        }
        else {
            return value;
        }
    })
    path: string;
    
    @ManyToOne((type) => PostsModel, (post) => post.images) // type은 PostsModel을 나타낸다.
    post?: PostsModel;
}
