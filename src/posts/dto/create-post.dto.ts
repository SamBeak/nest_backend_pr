import { PickType } from "@nestjs/mapped-types";
import { PostsModel } from "../entities/posts.entity";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
    @IsString({
        each: true,
    })
    @IsOptional()
    images? : string[];
}