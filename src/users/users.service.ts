import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
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
	
	getUsersRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<UsersModel>(UsersModel) : this.usersRepository;
	}
	
	getUserFollowersRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<UserFollowersModel>(UserFollowersModel) : this.userFollowersRepository;
	}
	
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
	
	async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.getUserFollowersRepository(qr);
		await userFollowersRepository.save({
			follower: {
				id: followerId,
			},
			followee: {
				id: followeeId,
			},
		})
		
		return true;
	}
	
	async confirmFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.getUserFollowersRepository(qr);
		const existing = await userFollowersRepository.findOne({
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
		
		await userFollowersRepository.save({
			...existing,
			isConfirmed: true,
		});
		
		return true;
	}
	
	async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.getUserFollowersRepository(qr);
		
		await userFollowersRepository.delete({
			follower: {
				id: followerId,
			},
			followee: {
				id: followeeId,
			},
		})
		
		return true;
	}
	
	async incrementFollower(userId: number, qr?: QueryRunner){
		const usersRepository = this.getUsersRepository(qr);
		await usersRepository.increment({
			id: userId,
		}, 'followersCount', 1);
	}
	
	async decrementFollower(userId: number, qr?: QueryRunner){
		const usersRepository = this.getUsersRepository(qr);
		await usersRepository.increment({
			id: userId,
		}, 'followersCount', -1);
	}
 }
