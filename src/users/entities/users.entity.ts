import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UsersModel {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	nickname: string;
	
	@Column()
	email: string;
	
	@Column()
	password: string;
	
	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updatedAt: Date;
}