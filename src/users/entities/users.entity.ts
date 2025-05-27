import { BaseModel } from "src/common/entities/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";

@Entity()
export class UsersModel extends BaseModel {
	
	@OneToMany(()=> PostsModel, (post)=>post.author)
	posts: PostsModel[];
	
	@Column()
	nickname: string;
	
	@Column()
	email: string;
	
	@Column()
	@IsString({
		message: "비밀번호는 문자열이어야 합니다.",
	})
	@Length(3, 8, {
		message: "비밀번호는 3자 이상 8자 이하로 입력해주세요.",
	})
	@Exclude({
		toPlainOnly: true,
	})
	password: string;
	
	@Column({
		enum: Object.values(RolesEnum),
		default:RolesEnum.USER,
	})
	role: RolesEnum;
}