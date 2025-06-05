import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
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
          callback(null, TEMP_FOLDER_PATH)
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
    AuthModule,
    UsersModule,
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
