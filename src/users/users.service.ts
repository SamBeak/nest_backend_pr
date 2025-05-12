import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: Repository<UsersModel>,
	){}
}
