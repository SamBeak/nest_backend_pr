import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModel } from './users/entities/users.entity';

@Module({
  imports: [
		UsersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: '127.0.0.1',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'postgres',
			entities: [
				UsersModel,
			],
			synchronize: true,
		}),
		AuthModule,
		CommonModule,
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
