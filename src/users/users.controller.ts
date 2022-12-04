import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	UseGuards
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { BasicAuthGuard } from "../guards/basic-auth.guard";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(201)
	@Post()
	async create(@Body() dto: CreateUserDto, @Req() req: Request) {
		const currentUser = await this.usersService.findUserByLogin(dto.login);
		if (currentUser) {
			throw new BadRequestException();
		} else {
			return await this.usersService.create(dto);
		}
	}

	@HttpCode(200)
	@Get()
	async getAllUsers(
		@Query('searchLoginTerm') searchLoginTerm: string,
		@Query('searchEmailTerm') searchEmailTerm: string,
		@Query('pageNumber') pageNumber: number,
		@Query('pageSize') pageSize: number,
		@Query('sortBy') sortBy: string,
		@Query('sortDirection') sortDirection: string,
	) {
		return this.usersService.getAllUsers(
			searchLoginTerm,
			searchEmailTerm,
			pageNumber,
			pageSize,
			sortBy,
			sortDirection,
		);
	}

	@Get(':id')
	async findUserById(@Param('id') id: string) {
		const foundedUser = await this.usersService.findUserById(id);
		if (!foundedUser) {
			throw new NotFoundException();
		}
		return foundedUser;
	}

	@HttpCode(204)
	@Delete('/:id')
	async deleteUserById(@Param('id') id: string) {
		const deletedUser = await this.usersService.deleteUserById(id);
		if (!deletedUser) {
			throw new NotFoundException();
		}
	}

	@Delete()
	async deleteAllUsers() {
		return this.usersService.deleteAll();
	}
}