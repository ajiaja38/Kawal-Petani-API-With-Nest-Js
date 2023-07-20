import {
  Body,
  Get,
  Controller,
  Delete,
  Param,
  Query,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { LahanService } from './lahan.service';
import { CreateLahanDto } from './dto/create-lahan.dto';
import { TrajectoriesDto } from './dto/add-trajectories.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { resolve } from 'path';
import { UpdateDataAlamDto } from './dto/update-dataAlam.dto';

@Controller('lahan')
export class LahanController {
  constructor(private readonly lahanService: LahanService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor(
      'foto',
      multerOptions(resolve(__dirname, '../../public/image/lahan')),
    ),
  )
  async createDataLahanHandler(
    @UploadedFile() foto: Express.Multer.File,
    @Body() payload: CreateLahanDto,
  ): Promise<any> {
    await this.lahanService.createLahan(payload, foto.filename);
    return {
      status: 'success',
      message: 'Berhasil Menambahkan Data Lahan Baru',
    };
  }

  @Get()
  async getAllLahanHandler(): Promise<object> {
    const lahan = await this.lahanService.getAllLahan();

    return {
      status: 'success',
      data: lahan,
    };
  }

  @Get('/paginate')
  async getAllLahanWithPaginateHandler(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<object> {
    const lahan = await this.lahanService.getAllLahanWithPaginate(
      search,
      page,
      limit,
    );

    return {
      status: 'success',
      data: lahan,
    };
  }

  @Get('/:id')
  async getLahanByIdHandler(@Param('id') guid: string): Promise<object> {
    const lahan = await this.lahanService.getLahanById(guid);

    return {
      status: 'success',
      data: lahan,
    };
  }

  @Put('/:id/trajectories')
  async pushTrajectoriesHandler(
    @Param('id') guid: string,
    @Body() payload: TrajectoriesDto,
  ): Promise<object> {
    await this.lahanService.addTrajectories(guid, payload);

    return {
      status: 'success',
      message: 'Berhasil Menambahkan Trajectories',
    };
  }

  @Put('/:id/dataAlam')
  async updateDataAlamHandler(
    @Param('id') guid: string,
    @Body() payload: UpdateDataAlamDto,
  ): Promise<object> {
    await this.lahanService.addDataAlam(guid, payload);

    return {
      status: 'success',
      message: 'Berhasil menambahkan Data Alam',
    };
  }

  @Put('/:id/updateFoto')
  @UseInterceptors(
    FileInterceptor(
      'foto',
      multerOptions(resolve(__dirname, '../../public/image/lahan')),
    ),
  )
  async updateFotoLahanHandler(
    @Param('id') guid: string,
    @UploadedFile() foto: Express.Multer.File,
  ): Promise<object> {
    await this.lahanService.updateFotoLahan(guid, foto.filename);

    return {
      status: 'success',
      message: 'Berhasil update foto lahan',
    };
  }

  @Delete('/:id')
  async deleteLahanHandler(@Param('id') guid: string) {
    await this.lahanService.deleteLahanById(guid);

    return {
      status: 'success',
      message: 'Berhasil Menghapus Lahan',
    };
  }
}
