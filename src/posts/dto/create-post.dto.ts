import { IsString } from "class-validator";

export class CreatePostDto {
    @IsString({
		message: "title은 문자열이어야 합니다.",
	})
	title: string;
    
    @IsString({
		message: "content은 문자열이어야 합니다.",
	})
    content: string;
}