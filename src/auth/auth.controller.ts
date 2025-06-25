import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login/email')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  loginEmail(
	@Body('email') email: string,
	@Body('password') password: string,
  ) {
	return this.authService.loginWithEmail({ email, password });
  }
  
  @Post('register/email')
  @IsPublic()
  registerEmail(
	@Body() body: RegisterUserDto,
  ) {
	return this.authService.registerWithEmail(body);
  }
  
  @Post('token/access')
  @IsPublic()
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
  @UseGuards(RefreshTokenGuard)
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
