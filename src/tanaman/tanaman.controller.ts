import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TanamanService } from './tanaman.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { resolve } from 'path';
import { CreateTanamanDto } from './dto/create-tanaman.dto';
import { UpdateTanamanDto } from './dto/update-tanaman.dto';

@Controller('tanaman')
export class TanamanController {
  constructor(private readonly tanamanService: TanamanService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor(
      'foto',
      multerOptions(resolve(__dirname, '../../public/image/tanaman')),
    ),
  )
  async createDataTanamanHandler(
    @UploadedFile() foto: Express.Multer.File,
    @Body() payload: CreateTanamanDto,
  ): Promise<object> {
    const guidTanaman = await this.tanamanService.createDataTanaman(
      payload,
      foto.filename,
    );
    return {
      status: 'success',
      message: 'Berhasil menambahkan data Tanaman',
      guid: guidTanaman,
    };
  }

  @Get('/bylahan/:guid')
  async getAllTanamanByLahanHandler(
    @Param('guid') guid: string,
  ): Promise<object> {
    const tanamans = await this.tanamanService.getAllTanamanByPetani(guid);
    return {
      status: 'success',
      data: tanamans,
    };
  }

  @Get('/:guid')
  async getTanamanByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const tanaman = await this.tanamanService.getTanamanByGuid(guid);

    return {
      status: 'success',
      data: tanaman,
    };
  }

  @Put('/:guid')
  async updateTanamanByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateTanamanDto,
  ): Promise<object> {
    const guidTanaman = await this.tanamanService.updateTanaman(guid, payload);

    return {
      status: 'success',
      message: 'berhasil update tanaman',
      guidTanaman,
    };
  }

  @Put('/:guid/updateFoto')
  @UseInterceptors(
    FileInterceptor(
      'foto',
      multerOptions(resolve(__dirname, '../../public/image/tanaman')),
    ),
  )
  async updateFotoTanamanHandler(
    @Param('id') guid: string,
    @UploadedFile() foto: Express.Multer.File,
  ): Promise<object> {
    await this.tanamanService.updateFotoTanaman(guid, foto.filename);

    return {
      status: 'success',
      message: 'Berhasil update foto tanaman',
    };
  }

  @Delete('/:guid')
  async deteleTanamanByGuidHandler(
    @Param('guid') guid: string,
  ): Promise<object> {
    await this.tanamanService.deleteTanaman(guid);

    return {
      status: 'success',
      message: 'Berhasil menghapus data tanaman',
    };
  }
}
