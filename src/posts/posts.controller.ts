import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from 'src/users/decorator/users.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { ImageModelType } from 'src/common/const/image-model.const';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';

@Controller('posts')
export class PostsController {
  constructor(
	private readonly postsService: PostsService,
	private readonly dataSource: DataSource,
	private readonly postsImagesService: PostsImagesService,
) {}
  
  @Get()
  @UseInterceptors(LogInterceptor)
  @UseFilters(HttpExceptionFilter)
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
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
	@QueryRunner() qr: QR,
  ) {
	const post = await this.postsService.createPost(userId, body, qr);
	
	for (let i = 0; i < body.images.length; i++) {
		await this.postsImagesService.createPostImage({
		post,
		order: i,
		path: body.images[i],
		type: ImageModelType.POST_IMAGE,
		}, qr);
	}
	
	return this.postsService.getPostById(post.id, qr);
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
