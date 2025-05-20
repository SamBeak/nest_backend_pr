import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	){}
	
	signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
		const payload = {
			email: user.email,
			sub: user.id,
			type: isRefreshToken ? 'refresh' : 'access',
		}
		
		const token = this.jwtService.sign(payload, {
			secret: JWT_SECRET,
			expiresIn: isRefreshToken ? '3600' : '300', // 3600s, 300s
		})
		
		return token;
	}
	
	loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
		return {
			accessToken: this.signToken(user, false),
			refreshToken: this.signToken(user, true),
		}
	}
	
	async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
		const existingUser = await this.usersService.getUserByEmail(user.email);
		
		if (!existingUser) {
			throw new UnauthorizedException("존재하지 않는 사용자입니다.");
		}
		
		const passOk = await bcrypt.compare(user.password, existingUser.password);
		
		if (!passOk) {
			throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
		}
		
		return existingUser;
	}
	
	async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
		const existingUser = await this.authenticateWithEmailAndPassword(user);
		
		return this.loginUser(existingUser);
	}
	
	async registerWithEmail(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
		const hash = await bcrypt.hash(
			user.password,
			HASH_ROUND,
		);
		
		const newUser = await this.usersService.createUser({
			...user,
			password: hash,
		});
		
		return this.loginUser(newUser);
	}
}