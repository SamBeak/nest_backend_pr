import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { ENV_HOST_KEY, ENV_PORT_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';
import { basename, join } from 'path';
import { POSTS_IMAGE_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
		private readonly commonService: CommonService,
    ){}
    
    async getAllPosts() {
        return await this.postsRepository.find({
			relations: ['author'],
		});
    }
    async paginatePosts(dto: PaginatePostDto) {
		// if (dto.page) {
		// 	return this.pagePaginate(dto);
		// }
		// else {
		// 	return this.cursorPaginatePosts(dto);
		// }
		return await this.commonService.paginate(
            dto,
            this.postsRepository,
            {
                relations: ['author'],
            },
            'posts',
        );
	}
	
	async pagePaginate(dto: PaginatePostDto) {
		const [posts, count] = await this.postsRepository.findAndCount({
			skip: dto.take * (dto.page - 1),
			take: dto.take,
			order: {
				createdAt: dto.order__createdAt,
			}
		});
		
		return {
			data: posts,
			total: count,
		}
	}
	
    async cursorPaginatePosts(dto: PaginatePostDto) {
		const where : FindOptionsWhere<PostsModel> = {};
		
		if (dto.where__id__less_than) {
			where.id = LessThan(dto.where__id__less_than);
		}
		else if (dto.where__id__more_than) {
			where.id = MoreThan(dto.where__id__more_than);
		}
		
        const posts = await this.postsRepository.find({
            where,
            order: {
                createdAt: dto.order__createdAt,
            },
            take: dto.take,
        });
        
        const lastItem = (posts.length > 0 && posts.length === dto.take) ? posts[posts.length - 1] : null;
        
        const nextUrl = lastItem && new URL(`${ENV_PROTOCOL_KEY}://${ENV_HOST_KEY}:${ENV_PORT_KEY}/posts`);
        if (nextUrl) {
            for(const key of Object.keys(dto)) {
                if(dto[key]) {
                    if(key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }
            
			let key = null;
			
			if (dto.order__createdAt === 'ASC') {
				key = 'where__id__more_than';
			}
			else {
				key = 'where__id__less_than';
			}
			
            nextUrl.searchParams.append(key, lastItem.id.toString());
        }
        
        return {
            data: posts,
            count: posts.length,
            cursor: {
                after: lastItem?.id ?? null,
            },
            next: nextUrl?.toString() ?? null,
        }
    }
    
    async generatePosts(userId: number) {
        for(let i=0; i< 100; i++) {
            await this.createPost(userId, {
                title: `임의로 생성된 포스트 제목 ${i}`,
                content: `임의로 생성된 포스트 내용 ${i}`,
            });
        }
    }
    
    async getPostById(id: number,) {
        const post = await this.postsRepository.findOne({
            where: {
                id,
            },
			relations: ['author'],
        })
        
        if (!post) {
            throw new NotFoundException();
        }
        
        return post;
    }
    
    async createPostImage(dto: CreatePostDto) {
        
        // 파일 임시 저장 경로
		const tempFilePath = join(
            TEMP_FOLDER_PATH,
            dto.image,
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
        
        // 파일 이동
        await promises.rename(tempFilePath, newPath);
        
        return true;
	}
    
    async createPost(authorId: number, postDto: CreatePostDto) {
        const post = this.postsRepository.create({
            author: {
                id: authorId,
            },
            ...postDto,
            likeCount: 0,
            commentCount: 0,
        });
        
        const newPost = await this.postsRepository.save(post);
        
        return newPost;
    }
    
    async updatePost(postId: number, postDto: UpdatePostDto) {
        const {title, content} = postDto;
        
        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            },
        })
        
        if (!post) {
            throw new NotFoundException();
        }
        
        if (title) {
            post.title = title;
        }
        
        if (content) {
            post.content = content;
        }
        
        const newPost = await this.postsRepository.save(post);
        
        return newPost;
    }
}
