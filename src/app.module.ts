import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModel } from './users/entities/users.entity';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entities/posts.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_DB_HOST_KEY, ENV_DB_NAME_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';

@Module({
  imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configSerivce: ConfigService) => ({
				type: 'postgres',
				host: configSerivce.get<string>(ENV_DB_HOST_KEY),
				port: configSerivce.get<number>(ENV_DB_PORT_KEY),
				username: configSerivce.get<string>(ENV_DB_USERNAME_KEY),
				password: configSerivce.get<string>(ENV_DB_PASSWORD_KEY),
				database: configSerivce.get<string>(ENV_DB_NAME_KEY),
				synchronize: true,
				entities: [
					PostsModel,
					UsersModel,
				],
			}),
		}),
		UsersModule,
		AuthModule,
		CommonModule,
		PostsModule,
	],
  controllers: [AppController],
  providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}