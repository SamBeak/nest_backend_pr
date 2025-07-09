import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModel } from './users/entities/users.entity';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entities/posts.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_DB_HOST_KEY, ENV_DB_NAME_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entities/image.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/messages/entity/messages.entity';
import { CommentsModule } from './posts/comments/comments.module';
import { CommentsModel } from './posts/comments/entities/comments.entity';
import { RolesGuard } from './users/guard/roles.guard';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { UserFollowersModel } from './users/entities/user-followers.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		ServeStaticModule.forRoot({
			rootPath: PUBLIC_FOLDER_PATH,
			serveRoot: "/public",
		}),
		CacheModule.register({
			store: redisStore,
			host: 'redis', // redis docker container의 이름
			port: 6379,
			ttl: 60 * 60 * 24,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configSerivce: ConfigService) => ({
				type: 'postgres',
				host: configSerivce.get<string>(ENV_DB_HOST_KEY),
				port: parseInt(configSerivce.get<string>(ENV_DB_PORT_KEY)),
				username: configSerivce.get<string>(ENV_DB_USERNAME_KEY),
				password: configSerivce.get<string>(ENV_DB_PASSWORD_KEY),
				database: configSerivce.get<string>(ENV_DB_NAME_KEY),
				synchronize: true,
				entities: [
					PostsModel,
					UsersModel,
					ImageModel,
					ChatsModel,
					MessagesModel,
					CommentsModel,
					UserFollowersModel,
				],
			}),
		}),
		UsersModule,
		AuthModule,
		CommonModule,
		PostsModule,
		ChatsModule,
		CommentsModule,
	],
  controllers: [AppController],
  providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: AccessTokenGuard, // accessTokenGuard를 global guard로 등록, 예외는 @PublicApi로 설정
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				LogMiddleware
			).forRoutes({
				path: '*',
				method: RequestMethod.ALL,
			});
	}
}