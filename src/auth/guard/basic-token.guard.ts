import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
	) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean>{
		const req = context.switchToHttp().getRequest();
		
		// {authorization : 'Basic asdsadasfasfqwqwrqwr'}
		const rowToken = req.headers['authorization'];
		
		if (!rowToken) {
			throw new UnauthorizedException('토큰이 없습니다');
		}
		
		const token = this.authService.extractTokenFromHeader(rowToken, false);
		
		const {email, password} = this.authService.decodeBasicToken(token);
		
		const userInfo = {
			email,
			password,
		};
		
		const user = await this.authService.authenticateWithEmailAndPassword(userInfo);
		
		req.user = user;
		
		return true;
	}
}