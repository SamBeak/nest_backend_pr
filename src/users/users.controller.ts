import { ClassSerializerInterceptor, Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  @IsPublic()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
