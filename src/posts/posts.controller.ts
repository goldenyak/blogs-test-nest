import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostsDto } from './dto/create-post.dto';
import { NOT_FOUND_BLOG_ERROR } from '../blogs/constants/blogs.constants';
import { NOT_FOUND_POST_ERROR } from './constants/posts.constants';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentsService } from '../comments/comments.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { PostsQueryParams } from './dto/posts-query.dto';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
	) {}

	@Post()
	async create(@Body() dto: CreatePostsDto) {
		return await this.postsService.create(dto);
	}

	@HttpCode(200)
	@Get()
	async getAllPosts(@Query() queryParams: PostsQueryParams) {
		return this.postsService.getAllPosts(queryParams);
	}

	@HttpCode(200)
	@Get(':id/comments')
	async getAllCommentsByPostId(
		@Param('id') id: string,
		@Query('pageNumber') pageNumber: number,
		@Query('pageSize') pageSize: number,
		@Query('sortBy') sortBy: string,
		@Query('sortDirection') sortDirection: string,
	) {
		const postById = await this.postsService.findPostById(id);
		if (!postById) {
			throw new HttpException(NOT_FOUND_POST_ERROR, HttpStatus.NOT_FOUND);
		}
		return await this.postsService.getAllCommentsByPostId(
			pageNumber,
			pageSize,
			sortBy,
			sortDirection,
			id,
		);
	}

	@Get(':id')
	async findPostById(@Param('id') id: string) {
		// let currentUserId;
		// if (req.headers.authorization) {
		// 	const token = req.headers.authorization.split(' ')[1];
		// 	const result = await this.authService.checkRefreshToken(token);
		// 	if (result) {
		// 		currentUserId = result.id;
		// 	}
		// }
		const foundedPost = await this.postsService.findPostById(id);
		if (!foundedPost) {
			throw new HttpException(NOT_FOUND_POST_ERROR, HttpStatus.NOT_FOUND);
		}
		return foundedPost;
	}

	@HttpCode(204)
	@Delete(':id')
	async deletePostById(@Param('id') id: string) {
		const deletedPost = await this.postsService.deletePostById(id);
		if (!deletedPost) {
			throw new HttpException(NOT_FOUND_POST_ERROR, HttpStatus.NOT_FOUND);
		}
		return;
	}

	@HttpCode(204)
	@Put(':id')
	async updatePostById(@Body() dto: UpdatePostDto, @Param('id') id: string) {
		const post = await this.postsService.updatePostById(
			id,
			dto.title,
			dto.shortDescription,
			dto.content,
		);
		if (!post) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return;
	}
	//
	// @UseGuards(JwtAuthGuard)
	// @HttpCode(204)
	// @Put(':id/like-status')
	// async addLikePostById(@Body() dto: LikePostDto, @Param('id') id: string, @Req() req: Request) {
	// 	const postById = await this.postsService.findPostById(id);
	// 	const user = await this.usersService.findUserById(req.user.id);
	// 	if (!postById) {
	// 		throw new HttpException(NOT_FOUND_POST_ERROR, HttpStatus.NOT_FOUND);
	// 	}
	// 	if (!user) {
	// 		throw new ForbiddenException();
	// 	}
	// 	return await this.postsService.addLikePostById(postById.id, user.id, dto.likeStatus);
	// }
}
