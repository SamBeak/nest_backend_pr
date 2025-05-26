import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
    ){}
    
    async getAllPosts() {
        return await this.postsRepository.find();
    }
    
    async getPostById(id: number,) {
        const post = await this.postsRepository.findOne({
            where: {
                id,
            }
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
}
