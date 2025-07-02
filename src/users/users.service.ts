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
	
	async getFollowers(userId: number): Promise<UserFollowersModel[]> {
		const user = await this.usersRepository.findOne({
			where: {
				id: userId,
			},
			relations: {
				followers: true,
			}
		});
		
		return user.followers;
	}
	
	async followUser(followerId: number, followeeId: number) {
		const user = await this.usersRepository.findOne({
			where: {
				id: followerId,
			},
			relations: {
				followees: true,
			}
		});
		
		if(!user){
			throw new BadRequestException(`존재하지 않는 팔로워입니다.`);
		}
		
		await this.usersRepository.save({
			...user,
			followees: [
				...user.followees,
				{
					id: followeeId,
				},
			],
		});
	}
 }
