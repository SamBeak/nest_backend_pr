import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
	){}
	
	async getUserByEmail(email: string) {
		return this.usersRepository.findOne({
			where: {
				email,
			},
		})
	}
	
	async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
		const newUser = this.usersRepository.create(user);
		
		return this.usersRepository.save(newUser);
	}
 }
