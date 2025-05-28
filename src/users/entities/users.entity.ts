import { BaseModel } from "src/common/entities/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { ValidationArguments } from "class-validator";
import { LengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";

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
		message: LengthValidationMessage,
	})
	nickname: string;
	
	@Column()
	@IsString({
		message: stringValidationMessage,
	})
	@IsEmail({}, {
		message: emailValidationMessage,
	})
	email: string;
	
	@Column()
	@IsString({
		message: stringValidationMessage,
	})
	@Length(3, 8, {
		message: LengthValidationMessage,
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