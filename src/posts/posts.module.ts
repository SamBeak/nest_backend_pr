import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POSTS_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
    ]),
    MulterModule.register({
      limits: {
        fileSize: 10000000,
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(arg1, arg2)
         * arg1 : 에러가 있을 경우, 에러 정보를 넣어준다.
         * arg2 : 파일을 받을지 말지 boolean 값으로 넣어준다.
         */
        const ext = extname(file.originalname); // extname은 확장자만 가져오는 함수
        
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif' && ext !== '.webp') {
          return callback(new BadRequestException('이미지 파일만 업로드 가능합니다.'), false);
        }
        
        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: (req, res, callback) => {
          /**
           * callback(arg1, arg2)
           * arg1 : 에러가 있을 경우, 에러 정보를 넣어준다.
           * arg2 : 파일을 저장할 경로
           */
          callback(null, POSTS_IMAGE_PATH)
        },
        filename: (req, file, callback) => {
          /**
           * callback(arg1, arg2)
           * arg1 : 에러가 있을 경우, 에러 정보를 넣어준다.
           * arg2 : 파일을 저장할 파일명
           */
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
    UsersModule,
    AuthModule,
	CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
