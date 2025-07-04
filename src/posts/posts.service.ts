import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { FindOptionsWhere, LessThan, MoreThan, QueryRunner, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { ENV_HOST_KEY, ENV_PORT_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';
import { basename, join } from 'path';
import { POSTS_IMAGE_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'fs';
import { CreatePostImageDto } from './image/dto/create-image.dto';
import { ImageModel } from 'src/common/entities/image.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
        @InjectRepository(ImageModel)
		private readonly imageRepository: Repository<ImageModel>,
		private readonly commonService: CommonService,
    ){}
    
    async getAllPosts() {
        return await this.postsRepository.find({
			...DEFAULT_POST_FIND_OPTIONS,
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
                relations: DEFAULT_POST_FIND_OPTIONS.relations,
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
    
    async getPostById(id: number, qr?: QueryRunner) {
        const repository = this.getRepository(qr);
        const post = await repository.findOne({
            ...DEFAULT_POST_FIND_OPTIONS,
            where: {
                id,
            },
        })
        
        if (!post) {
            throw new NotFoundException();
        }
        
        return post;
    }
	
	getRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
	}
    
    async incrementCommentCount(postId: number, qr?: QueryRunner){
		const postsRepository = this.getRepository(qr);
		await postsRepository.increment({
			id: postId,
		}, 'commentCount', 1);
	}
	
	async decrementCommentCount(postId: number, qr?: QueryRunner){
		const postsRepository = this.getRepository(qr);
		await postsRepository.increment({
			id: postId,
		}, 'commentCount', -1);
	}
    
    async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
		
		const repository = this.getRepository(qr);
        const post = repository.create({
            author: {
                id: authorId,
            },
            ...postDto,
            images: [],
            likeCount: 0,
            commentCount: 0,
        });
        
        const newPost = await repository.save(post);
        
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
    
    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            },
        })
        
        if (!post) {
            throw new NotFoundException();
        }
        
        await this.postsRepository.delete(postId);
        
        return postId;
    }
    
    async checkPostExistsById(postId: number) {
        return this.postsRepository.exists({
            where: {
                id: postId,
            },
        })
    }
    
    async isPostMine(userId: number, postId: number) {
        return this.postsRepository.exists({
            where: {
                id: postId,
                author: {
                    id: userId,
                },
            },
            relations: {
                author: true,
            },
        });
    }
}
