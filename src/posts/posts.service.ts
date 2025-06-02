import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

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
        
        return {
            data: posts,
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
