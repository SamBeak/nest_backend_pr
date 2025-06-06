import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from 'src/users/decorator/users.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { ImageModelType } from 'src/common/const/image-model.const';
import { DataSource } from 'typeorm';
import { PostsImagesService } from './image/images.service';

@Controller('posts')
export class PostsController {
  constructor(
	private readonly postsService: PostsService,
	private readonly dataSource: DataSource,
	private readonly postsImagesService: PostsImagesService,
) {}
  
  @Get()
  getPosts(
    @Query() query: PaginatePostDto,
  ) {
    return this.postsService.paginatePosts(query);
  }
  
  @Get(':id')
  getPost(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.getPostById(id);
  }
  
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "게시글 생성",
    description: "게시글을 생성합니다.",
  })
  @UseGuards(AccessTokenGuard)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
  ) {
	const qr = this.dataSource.createQueryRunner();
	qr.connect();
	await qr.startTransaction();
    
	try {
		const post = await this.postsService.createPost(userId, body, qr);
		
		for (let i = 0; i < body.images.length; i++) {
		  await this.postsImagesService.createPostImage({
			post,
			order: i,
			path: body.images[i],
			type: ImageModelType.POST_IMAGE,
		  }, qr);
		}
		
		await qr.commitTransaction();
		
		return this.postsService.getPostById(post.id);
	}
	catch (e) {
		await qr.rollbackTransaction();
		throw new InternalServerErrorException('게시글 생성 중 오류가 발생했습니다.');
	}
	finally {
		await qr.release();
	}
  }
  
  @Patch(":postId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "게시글 수정",
    description: "게시글을 수정합니다.",
  })
  @UseGuards(AccessTokenGuard)
  async patchPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, body);
  }
  
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    
    return true;
  }
}
