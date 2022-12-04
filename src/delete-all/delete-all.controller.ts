import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BlogsService } from '../blogs/blogs.service';
import { CommentsService } from '../comments/comments.service';
import { PostsService } from '../posts/posts.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('testing')
export class DeleteAllController {
	constructor(
		private readonly usersService: UsersService,
		private readonly blogsService: BlogsService,
		private readonly commentsService: CommentsService,
		private readonly postsService: PostsService,
		private readonly sessionsService: SessionsService,
	) {}

	@HttpCode(204)
	@Delete('all-data')
	async deleteAll() {
		await this.usersService.deleteAll();
		await this.blogsService.deleteAll()
		// await this.commentsService.deleteAll();
		await this.postsService.deleteAll();
		// await this.sessionsService.deleteAll();
		return true;
	}
}
