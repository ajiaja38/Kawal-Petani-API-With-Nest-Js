import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UpdateUserPasswordDto } from './dto/update-userPassword.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerUsersHandler(@Body() payload: CreateUserDto): Promise<object> {
    await this.usersService.createUser(payload);
    return {
      status: 'Success',
      message: 'Berhasil Registrasi User',
    };
  }

  @Post('/addAdmin')
  async registerAdminHandler(@Body() payload: CreateAdminDto): Promise<object> {
    await this.usersService.createAdmin(payload);
    return {
      status: 'success',
      message: 'Berhasil Registrasi Admin',
    };
  }

  @Get()
  async getAllUsersHandler(): Promise<object> {
    const users = await this.usersService.getAllUsers();

    return {
      status: 'success',
      data: users,
    };
  }

  @Get('/admin')
  async getAllAdminHandler(): Promise<object> {
    const admins = await this.usersService.getAllAdmins();

    return {
      status: 'success',
      data: admins,
    };
  }

  @Get('/surveyor')
  async getAllSurveyorHandler(): Promise<object> {
    const surveyors = await this.usersService.getAllSurveyors();

    return {
      status: 'success',
      data: surveyors,
    };
  }

  @Get('/paginate')
  async getAllUsersWithPaginationHandler(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    const users = await this.usersService.getPaginateAllDataUsers(
      search,
      page,
      limit,
    );
    return {
      status: 'success',
      data: users,
    };
  }

  @Get('/paginate/admin')
  async getAllAdminWithPaginationHandler(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    const admins = await this.usersService.getPaginateAllDataAdmin(
      search,
      page,
      limit,
    );
    return {
      status: 'success',
      data: admins,
    };
  }

  @Get('/paginate/surveyor')
  async getAllSurveyorsWithPaginationHandler(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    const admins = await this.usersService.getPaginateAllDataSurveyor(
      search,
      page,
      limit,
    );
    return {
      status: 'success',
      data: admins,
    };
  }

  @Get('/:guid')
  async getUserByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const user = await this.usersService.getUseById(guid);

    return {
      status: 'success',
      data: user,
    };
  }

  @Put('/:guid')
  async updateUserByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateUserDto,
  ) {
    await this.usersService.updateUserById(guid, payload);
    return {
      status: 'success',
      message: 'Berhasil Update User',
    };
  }

  @Put('/admin/:guid')
  async updateAdminByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateAdminDto,
  ) {
    await this.usersService.updateAdminById(guid, payload);
    return {
      status: 'success',
      message: 'Berhasil Update User',
    };
  }

  @Put('change-password/:guid')
  async updatePasswordByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateUserPasswordDto,
  ): Promise<object> {
    await this.usersService.updatePasswordByGuid(guid, payload);

    return {
      status: 'success',
      message: 'Berhasil ubah password',
    };
  }

  @Delete('/:guid')
  async deleteUserByGuidHandler(@Param('guid') guid: string) {
    await this.usersService.deleteUserById(guid);

    return {
      status: 'success',
      message: 'Berhasil Hapus data user',
    };
  }
}
