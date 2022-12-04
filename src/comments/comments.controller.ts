import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { NOT_FOUND_COMMENT_ERROR } from './constants/comments.constants';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
	) {}

	@HttpCode(200)
	@Get(':id')
	async findCommentById(
		@Param('id') id: string,
	) {
		const commentById = await this.commentsService.findCommentById(id);
		if (!commentById) {
			throw new HttpException(NOT_FOUND_COMMENT_ERROR, HttpStatus.NOT_FOUND);
		}
		return commentById;
	}
}
