import {
  Body,
  Get,
  Controller,
  Post,
  Query,
  ParseIntPipe,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PetaniService } from './petani.service';
import { CreatePetaniDto } from './dto/create-petani.dto';
import { UpdatePetaniDto } from './dto/update-petani.dto';

@Controller('petani')
export class PetaniController {
  constructor(private readonly petaniService: PetaniService) {}

  @Post()
  async postPetaniHandler(@Body() payload: CreatePetaniDto): Promise<any> {
    await this.petaniService.createDataPetani(payload);

    return {
      status: 'success',
      message: 'Berhasil menambah data petani',
    };
  }

  @Get()
  async getAllPetaniHandler(): Promise<any> {
    const petani = await this.petaniService.getAllPetani();

    return {
      status: 'success',
      data: petani,
    };
  }

  @Get('/paginate')
  async getAllPetaniWithPaginateHandler(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const petani = await this.petaniService.getAllPetaniPaginate(
      search,
      page,
      limit,
    );

    return {
      status: 'success',
      data: petani,
    };
  }

  @Get('/:id')
  async getUserByIdHandler(@Param('id') guid: string): Promise<object> {
    const petani = await this.petaniService.getPetaniById(guid);

    return {
      status: 'success',
      data: petani,
    };
  }

  @Put('/:id')
  async updatePetaniByIdHandler(
    @Param('id') guid: string,
    @Body() payload: UpdatePetaniDto,
  ): Promise<any> {
    await this.petaniService.updatePetaniById(guid, payload);

    return {
      status: 'success',
      message: 'Berhasil Update Data Petani',
    };
  }

  @Delete('/:id')
  async deletePetaniByIdHandler(@Param('id') guid: string) {
    await this.petaniService.deletePetaniById(guid);

    return {
      status: 'success',
      message: 'Berhasil Hapus Data Petani',
    };
  }
}
