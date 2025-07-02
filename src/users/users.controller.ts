import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './decorator/users.decorator';
import { UsersModel } from './entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
  
  @Get('follow/me')
  async getFollow(
    @User() user: UsersModel,
  ) {
    return this.usersService.getFollowers(user.id);
  }
  
  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followUser(user.id, followeeId);
    
    return true;
  }
}
