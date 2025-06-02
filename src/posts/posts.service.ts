import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { API_URL } from 'src/common/const/env.const';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
    ){}
    
    async getAllPosts() {
        return await this.postsRepository.find({
			relations: ['author'],
		});
    }
    
    async paginatePosts(dto: PaginatePostDto) {
        const posts = await this.postsRepository.find({
            where: {
                id: MoreThan(dto.where__id_more_than ?? 0)
            },
            order: {
                createdAt: dto.order__createdAt,
            },
            take: dto.take,
        });
        
        const lastItem = (posts.length > 0 && posts.length === dto.take) ? posts[posts.length - 1] : null;
        
        const nextUrl = lastItem && new URL(`${API_URL}/posts`);
        if (nextUrl) {
            for(const key of Object.keys(dto)) {
                if(dto[key]) {
                    if(key !== 'where__id_more_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }
            
            nextUrl.searchParams.append("where__id_more_than", lastItem.id.toString());
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
    
    async createPost(authorId: number, postDto: CreatePostDto,) {
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
