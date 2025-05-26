import { BaseModel } from "src/common/entities/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";

@Entity()
export class UsersModel extends BaseModel {
	
	@OneToMany(()=> PostsModel, (post)=>post.author)
	posts: PostsModel[];
	
	@Column()
	nickname: string;
	
	@Column()
	email: string;
	
	@Column()
	password: string;
	
	@Column({
		enum: Object.values(RolesEnum),
		default:RolesEnum.USER,
	})
	role: RolesEnum;
}