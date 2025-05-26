import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login/email')
  loginEmail(
	@Body('email') email: string,
	@Body('password') password: string,
  ) {
	return this.authService.loginWithEmail({ email, password });
  }
  
  @Post('register/email')
  registerEmail(
	@Body('nickname') nickname: string,
	@Body('email') email: string,
	@Body('password', new MaxLengthPipe(8), new MinLengthPipe(3)) password: string,
  ) {
	return this.authService.registerWithEmail({ nickname, email, password });
  }
  
  @Post('token/access')
  postTokenAccess(
	@Headers('authorization') rowToken: string,
  ) {
	const token = this.authService.extractTokenFromHeader(rowToken, true);
	
	const newToken = this.authService.rotateToken(token, true);
	
	return {
		accessToken: newToken,
	}
  }
  
  @Post('token/refresh')
  postTokenRefresh(
	@Headers('authorization') rowToken: string,
  ) {
	const token = this.authService.extractTokenFromHeader(rowToken, true);
	
	const newToken = this.authService.rotateToken(token, false);
	
	return {
		refreshToken: newToken,
	}
  }
}
