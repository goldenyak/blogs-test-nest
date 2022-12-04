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
	UseGuards,
} from '@nestjs/common';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { BlogsService } from './blogs.service';
import { NOT_FOUND_BLOG_ERROR } from './constants/blogs.constants';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreatePostsDto } from '../posts/dto/create-post.dto';
import { Request } from 'express';
import { BlogsQueryParams } from './dto/blogs-query.dto';

@Controller('blogs')
export class BlogsController {
	constructor(private readonly blogsService: BlogsService) {}

	@Post()
	async create(@Body() dto: CreateBlogsDto) {
		return await this.blogsService.create(dto);
	}

	@Post(':blogId/posts')
	async createPostByBlogId(@Param('blogId') blogId: string, @Body() dto: CreatePostsDto) {
		const blogById = await this.blogsService.findBlogById(blogId);
		if (!blogById) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return await this.blogsService.createPostByBlogId(dto, blogById.id);
	}

	@HttpCode(200)
	@Get()
	async getAllBlogs(@Query() queryParams: BlogsQueryParams) {
		return await this.blogsService.getAllBlogs(queryParams);
	}

	@HttpCode(200)
	@Get(':blogId/posts')
	async getAllPostsByBlogId(
		@Param('blogId') blogId: string,
		@Query() queryParams: BlogsQueryParams,
	) {
		const blogById = await this.blogsService.findBlogById(blogId);
		if (!blogById) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return await this.blogsService.getAllPostsByBlogId(queryParams, blogId);
	}

	@Get(':id')
	async findBlogById(@Param('id') id: string) {
		const foundedBlog = await this.blogsService.findBlogById(id);
		if (!foundedBlog) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return foundedBlog;
	}

	@HttpCode(204)
	@Delete(':id')
	async deleteBlogById(@Param('id') id: string) {
		const deletedBlog = await this.blogsService.deleteBlogById(id);
		if (!deletedBlog) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return;
	}

	@HttpCode(204)
	@Put(':id')
	async updateBlogById(@Body() dto: UpdateBlogDto, @Param('id') id: string) {
		const blog = await this.blogsService.updateBlogById(id, dto.name, dto.websiteUrl);
		if (!blog) {
			throw new HttpException(NOT_FOUND_BLOG_ERROR, HttpStatus.NOT_FOUND);
		}
		return;
	}
}
