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
	
	async getFollowers(userId: number, includeNotConfirmed: boolean) {
		const where = {
			followee: {
				id: userId,
			},
		};
		
		if (!includeNotConfirmed) {
			where['isConfirmed'] = true;
		}
		
		const result = await this.userFollowersRepository.find({
			where,
			relations: {
				follower: true,
				followee: true,
			}
		})
		
		return result.map((ufm) => ({
			id: ufm.follower.id,
			nickname: ufm.follower.nickname,
			email: ufm.follower.email,
			isConfirmed: ufm.isConfirmed,
		}));
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
	
	async confirmFollow(followerId: number, followeeId: number) {
		const existing = await this.userFollowersRepository.findOne({
			where: {
				follower: {
					id: followerId,
				},
				followee: {
					id: followeeId,
				},
			},
			relations: {
				follower: true,
				followee: true,
			},
		});
		
		if (!existing) {
			throw new BadRequestException('존재하지 않는 팔로우 요청입니다');
		}
		
		await this.userFollowersRepository.save({
			...existing,
			isConfirmed: true,
		});
		
		return true;
	}
	
	async deleteFollow(followerId: number, followeeId: number) {
		await this.userFollowersRepository.delete({
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
