import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
@Injectable()
export class BaererTokenGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean>{
		const req = context.switchToHttp().getRequest();
		
		const rowToken = req.headers['authorization'];
		
		if (!rowToken) {
			throw new UnauthorizedException('토큰이 없습니다');
		}
		
		const token = this.authService.extractTokenFromHeader(rowToken, true);
		
		const result = await this.authService.verifyToken(token);
		
		const user = await this.usersService.getUserByEmail(result.email);
		
		req.token = token;
		req.tokenType = result.type;
		req.user = user;
		
		return true;
	}
}
@Injectable()
export class AccessTokenGuard extends BaererTokenGuard {
	async canActivate(context: ExecutionContext): Promise<boolean>{
		
		const req = context.switchToHttp().getRequest();
		
		await super.canActivate(context);
		
		if (req.tokenType !== 'access') {
			throw new UnauthorizedException('엑세스 토큰이 아닙니다');
		}
		
		return true;
	}
}
@Injectable()
export class RefreshTokenGuard extends BaererTokenGuard {
	async canActivate(context: ExecutionContext): Promise<boolean>{
		
		const req = context.switchToHttp().getRequest();
		
		await super.canActivate(context);
		
		if (req.tokenType !== 'refresh') {
			throw new UnauthorizedException('리프레시 토큰이 아닙니다');
		}
		
		return true;
	}
}