import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { JWT_SECRET } from './const/auth.const';

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
}
