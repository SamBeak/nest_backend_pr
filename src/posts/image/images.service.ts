import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageModel } from "src/common/entities/image.entity";
import { CreatePostImageDto } from "./dto/create-image.dto";
import { POSTS_IMAGE_PATH, TEMP_FOLDER_PATH } from "src/common/const/path.const";
import { basename, join } from "path";
import { promises } from "fs";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class PostsImagesService {
	constructor(
		@InjectRepository(ImageModel)
		private readonly imageRepository: Repository<ImageModel>,
	){}
	
	getRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<ImageModel>(ImageModel) : this.imageRepository;
	}
	
	async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
		const repository = this.getRepository(qr);
		
		// 파일 임시 저장 경로
		const tempFilePath = join(
            TEMP_FOLDER_PATH,
            dto.path,
        );
        
        // 파일 존재 확인
        try {
            await promises.access(tempFilePath);
        }
        catch(e) {
            throw new BadRequestException('존재하지 않는 파일입니다.');
        }
        
        // 파일 이름 가져오기
        const fileName = basename(tempFilePath);
        
        // 새로 이동할 폴더 경로 + 파일 이름
        const newPath = join(
            POSTS_IMAGE_PATH,
            fileName,
        );
        
        // 파일 DB 저장
        const result = await repository.save({
            ...dto,
        });
        
        // 파일 이동
        await promises.rename(tempFilePath, newPath);
        
        return result;
	}
}