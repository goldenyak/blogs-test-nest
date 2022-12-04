import { Module } from '@nestjs/common';
import { DeleteAllController } from './delete-all.controller';
import { UsersModule } from "../users/users.module";
import { BlogsModule } from "../blogs/blogs.module";
import { CommentsModule } from "../comments/comments.module";
import { PostsModule } from "../posts/posts.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [UsersModule, BlogsModule, CommentsModule, PostsModule, SessionsModule, ],
  controllers: [DeleteAllController],
})
export class DeleteAllModule {}
