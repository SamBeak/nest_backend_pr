import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
    ){}
}
