import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFollowersModel } from './entities/user-followers.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
		
		@InjectRepository(UserFollowersModel)
		private readonly userFollowersRepository: Repository<UserFollowersModel>,
	){}
	
	getAllUsers() {
		return this.usersRepository.find();
	}
	
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
	
	async getFollowers(userId: number): Promise<UsersModel[]> {
		const result = await this.userFollowersRepository.find({
			where: {
				followee: {
					id: userId,
				},
			},
			relations: {
				follower: true,
				followee: true,
			}
		})
		
		return result.map((ufm) => ufm.follower);
	}
	
	async followUser(followerId: number, followeeId: number) {
		const result = await this.userFollowersRepository.save({
			follower: {
				id: followerId,
			},
			followee: {
				id: followeeId,
			},
		})
		
		return true;
	}
 }
