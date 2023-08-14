import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Tanaman } from './schema/tanaman.schema';
import { CreateTanamanDto } from './dto/create-tanaman.dto';
import { v4 as uuidv4 } from 'uuid';
import { PetaniService } from 'src/petani/petani.service';
import { LahanService } from 'src/lahan/lahan.service';
import { UpdateTanamanDto } from './dto/update-tanaman.dto';
import { resolve } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class TanamanService {
  constructor(
    @InjectModel('Tanaman')
    private readonly tanamanModel: mongoose.Model<Tanaman>,

    @Inject(forwardRef(() => PetaniService))
    private readonly petaniService: PetaniService,

    @Inject(forwardRef(() => LahanService))
    private readonly lahanService: LahanService,
  ) {}

  async createDataTanaman(
    payload: CreateTanamanDto,
    foto: string,
  ): Promise<string> {
    const { guidPetani, guidLahan } = payload;
    await this.petaniService.getPetaniById(guidPetani);
    await this.lahanService.getLahanById(guidLahan);

    const guid = `Tanaman-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const schema = {
      guid,
      ...payload,
      foto,
      createdAt,
      updatedAt,
    };

    const createTanaman = new this.tanamanModel(schema);
    createTanaman.save();

    return createTanaman.guid;
  }

  async getAllTanamanByPetani(guidLahan: string): Promise<Tanaman[]> {
    const tanamans = await this.tanamanModel
      .find({ guidLahan })
      .select(
        ' guid guidPetani guidLahan nama latitude longitude foto createdAt updatedAt',
      );

    if (!tanamans.length) {
      throw new NotFoundException('Data Tanaman tidak ada pada Lahan ini');
    }

    return tanamans;
  }

  async getTanamanByGuid(guid: string): Promise<Tanaman> {
    const tanaman = await this.tanamanModel
      .findOne({ guid })
      .select(
        ' guid guidPetani guidLahan nama latitude longitude foto createdAt updatedAt',
      );

    if (!tanaman) {
      throw new NotFoundException(
        'Gagal mendapatkan data tanaman, guid tanaman tidak ditemukan!',
      );
    }

    return tanaman;
  }

  async updateTanamanByGuid(
    guid: string,
    payload: UpdateTanamanDto,
  ): Promise<string> {
    try {
      const updatedAt = new Date().toISOString();
      const updatedaTanaman = await this.tanamanModel.findOneAndUpdate(
        { guid },
        {
          ...payload,
          updatedAt,
        },
        { new: true },
      );

      return updatedaTanaman.guid;
    } catch (error) {
      throw new NotFoundException(
        'Gagal update data tanaman, guid tidak ditemukan!',
      );
    }
  }

  async updateTanaman(
    guid: string,
    payload: UpdateTanamanDto,
  ): Promise<string> {
    try {
      const createdAt = new Date().toISOString();
      const updatedTanaman = await this.tanamanModel.findOneAndUpdate(
        { guid },
        {
          ...payload,
          createdAt,
        },
        { new: true },
      );

      return updatedTanaman.guid;
    } catch (error) {
      throw new NotFoundException(
        'Gagal update Tanaman, GUID tanaman tidak ditemukan!',
      );
    }
  }

  async updateFotoTanaman(guid: string, foto: string): Promise<void> {
    try {
      await this.tanamanModel.findOneAndUpdate(
        { guid },
        { foto },
        { new: true },
      );
    } catch (error) {
      throw new NotFoundException(
        'Gagal Update Foto Lahan, Id Tanaman Tidak Ditemukan!',
      );
    }
  }

  async deleteTanaman(guid: string): Promise<void> {
    const tanaman = await this.tanamanModel.findOne({ guid });

    if (!tanaman) {
      throw new NotFoundException(
        'Gagal Hapus Data Tanaman, Guid tidak ditemukan!',
      );
    }

    if (tanaman && tanaman.foto) {
      this.deleteFotoTanaman(tanaman.foto);
    }

    await this.tanamanModel.findOneAndDelete({ guid });
  }

  async deleteFotoTanaman(filename: string) {
    const imagePath = resolve(
      __dirname,
      `../../public/image/tanaman/${filename}`,
    );

    unlinkSync(imagePath);
  }
}
