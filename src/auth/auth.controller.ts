import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { RegisterUserDto } from './dto/register-user.dto';

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
	@Body() body: RegisterUserDto,
  ) {
	return this.authService.registerWithEmail(body);
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
