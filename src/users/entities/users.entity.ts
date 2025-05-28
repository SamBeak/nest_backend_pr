import { BaseModel } from "src/common/entities/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { ValidationArguments } from "class-validator";

@Entity()
export class UsersModel extends BaseModel {
	
	@OneToMany(()=> PostsModel, (post)=>post.author)
	posts: PostsModel[];
	
	@Column({
		length: 20,
		unique: true,
	})
	@IsString()
	@Length(1, 20, {
		message(args:ValidationArguments) {
			if (args.constraints.length === 2){
				return `${args.property}는 ${args.constraints[0]}자 이상 ${args.constraints[1]}자 이하로 입력해주세요.`;
			}
			else {
				return `${args.property}는 최소 ${args.constraints[0]}자 이상 입력해주세요.`;
			}
		}
	})
	nickname: string;
	
	@Column()
	@IsString()
	@IsEmail()
	email: string;
	
	@Column()
	@IsString()
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