import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class UsersModel extends BaseModel {
	
	@Column()
	nickname: string;
	
	@Column()
	email: string;
	
	@Column()
	password: string;
}