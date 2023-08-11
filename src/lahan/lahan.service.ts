import {
  Inject,
  Injectable,
  forwardRef,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lahan } from './schema/data-lahan.schema';
import mongoose from 'mongoose';
import { CreateLahanDto } from './dto/create-lahan.dto';
import { TrajectoriesDto } from './dto/add-trajectories.dto';
import { PetaniService } from 'src/petani/petani.service';
import { unlinkSync } from 'fs';
import { resolve } from 'path';
import { UpdateDataAlamDto } from './dto/update-dataAlam.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateLahanDto } from './dto/update-lahan.dto';

@Injectable()
export class LahanService {
  constructor(
    @InjectModel(Lahan.name)
    private readonly lahanModel: mongoose.Model<Lahan>,

    @Inject(forwardRef(() => PetaniService))
    private readonly petaniService: PetaniService,
  ) {}

  async createLahan(payload: CreateLahanDto, foto: string): Promise<string> {
    try {
      const { owner } = payload;
      await this.petaniService.getPetaniById(owner);

      const guid = `Lahan-${uuidv4()}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const schema = {
        guid,
        ...payload,
        foto,
        createdAt,
        updatedAt,
      };

      const createLahan = new this.lahanModel(schema);

      createLahan.save();

      return createLahan.guid;
    } catch (error) {
      throw new InternalServerErrorException('Gagal Menambahkan data Lahan!');
    }
  }

  async getAllLahan(): Promise<Lahan[]> {
    const lahan = await this.lahanModel
      .find()
      .select(
        'guid nama jenis periodePanen jumlahTanaman hasilPanen hasilLab foto owner COMPANY_GUID trajectories',
      );

    if (!lahan.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    return lahan;
  }

  async getAllLahanByCompanyGuid(COMPANY_GUID: string): Promise<Lahan[]> {
    const lahan = await this.lahanModel
      .find({ COMPANY_GUID })
      .select(
        'guid nama jenis periodePanen jumlahTanaman hasilPanen hasilLab foto owner COMPANY_GUID trajectories',
      );

    if (!lahan.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    return lahan;
  }

  async getAllLahanWithPaginate(
    search: string,
    page: number,
    limit: number,
  ): Promise<object> {
    const regexQuery = new RegExp(search, 'i');
    const query = {
      $or: [
        { nama: regexQuery },
        { jenis: regexQuery },
        { periodePanen: regexQuery },
        { hasilLab: regexQuery },
      ],
    };

    const totalLahan = await this.lahanModel.countDocuments(query);
    const totalPages = Math.ceil(totalLahan / limit);
    const lahan = await this.lahanModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        'guid nama jenis periodePanen jumlahTanaman hasilPanen hasilLab luas foto owner COMPANY_GUID jenisTanah ketinggian curahHujan suhuRataRata jenisVegetasi jumlahVegetasi',
      );

    if (!lahan.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    const ownerGuid = lahan.map((item) => item.owner);

    if (!ownerGuid.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    const petani = await this.petaniService.getAllPetaniByGuid(ownerGuid);
    const lahanWithPetani = lahan.map((lahanItem) => {
      const matchedPetani = petani.find(
        (petaniItem) => petaniItem.guid === lahanItem.owner,
      );

      return {
        ...lahanItem.toObject(),
        petani: matchedPetani || null,
      };
    });

    lahanWithPetani.sort((a, b) =>
      a.petani?.nama.localeCompare(b.petani?.nama),
    );

    let totalLuasLahan = 0;
    let totalHasilPanen = 0;
    let totalJumlahTanaman = 0;
    let totalJumlahVegetasi = 0;

    lahanWithPetani.forEach((lahanItem) => {
      totalLuasLahan += lahanItem.luas;
      totalHasilPanen += lahanItem.hasilPanen;
      totalJumlahTanaman += lahanItem.jumlahTanaman;
      totalJumlahVegetasi += lahanItem.jumlahVegetasi;
    });

    return {
      totalPages,
      page,
      totalLahan,
      totalLuasLahan: `${totalLuasLahan} Hektar`,
      totalHasilPanen,
      totalJumlahTanaman,
      totalJumlahVegetasi,
      lahan: lahanWithPetani,
    };
  }

  async getAllLahanWithPaginateByCompanyGuid(
    COMPANY_GUID: string,
    search: string,
    page: number,
    limit: number,
  ): Promise<object> {
    const regexQuery = new RegExp(search, 'i');
    const query = {
      COMPANY_GUID,
      $or: [
        { nama: regexQuery },
        { jenis: regexQuery },
        { periodePanen: regexQuery },
        { hasilLab: regexQuery },
      ],
    };

    const totalLahan = await this.lahanModel.countDocuments(query);
    const totalPages = Math.ceil(totalLahan / limit);
    const lahan = await this.lahanModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        'guid nama jenis periodePanen jumlahTanaman hasilPanen hasilLab luas foto owner COMPANY_GUID jenisTanah ketinggian curahHujan suhuRataRata jenisVegetasi jumlahVegetasi',
      );

    if (!lahan.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    const ownerGuid = lahan.map((item) => item.owner);

    if (!ownerGuid.length) {
      throw new NotFoundException('Belum ada lahan yang diinputkan!');
    }

    const petani = await this.petaniService.getAllPetaniByGuid(ownerGuid);
    const lahanWithPetani = lahan.map((lahanItem) => {
      const matchedPetani = petani.find(
        (petaniItem) => petaniItem.guid === lahanItem.owner,
      );

      return {
        ...lahanItem.toObject(),
        petani: matchedPetani || null,
      };
    });

    lahanWithPetani.sort((a, b) =>
      a.petani?.nama.localeCompare(b.petani?.nama),
    );

    let totalLuasLahan = 0;
    let totalHasilPanen = 0;
    let totalJumlahTanaman = 0;
    let totalJumlahVegetasi = 0;

    lahanWithPetani.forEach((lahanItem) => {
      totalLuasLahan += lahanItem.luas;
      totalHasilPanen += lahanItem.hasilPanen;
      totalJumlahTanaman += lahanItem.jumlahTanaman;
      totalJumlahVegetasi += lahanItem.jumlahVegetasi;
    });

    return {
      totalPages,
      page,
      totalLahan,
      totalLuasLahan: `${totalLuasLahan} Hektar`,
      totalHasilPanen,
      totalJumlahTanaman,
      totalJumlahVegetasi,
      lahan: lahanWithPetani,
    };
  }

  async getLahanById(guid: string): Promise<Lahan> {
    const lahan = await this.lahanModel
      .findOne({ guid })
      .select(
        'guid nama jenis periodePanen jumlahTanaman hasilPanen hasilLab foto owner COMPANY_GUID trajectories jenisTanah ketinggian curahHujan suhuRataRata jenisVegetasi jumlahVegetasi',
      );

    if (!lahan) {
      throw new NotFoundException(
        'Gagal mendapatkan lahan, Id lahan tidak ditemukan!',
      );
    }

    return lahan;
  }

  async updateLahan(guid: string, payload: UpdateLahanDto): Promise<string> {
    try {
      const updatedLahan = await this.lahanModel.findOneAndUpdate(
        { guid },
        { ...payload },
        { new: true },
      );

      return updatedLahan.guid;
    } catch (error) {
      throw new NotFoundException(
        'Gagal update lahan, guid lahan tidak ditemukan!',
      );
    }
  }

  async getLahanByOwner(guid: string): Promise<Lahan[]> {
    const lahan = await this.lahanModel.find({ owner: guid });

    if (!lahan.length) {
      return [];
    }

    return lahan;
  }

  async addTrajectories(
    guid: string,
    payload: TrajectoriesDto[],
  ): Promise<void> {
    try {
      await this.lahanModel.findOneAndUpdate(
        { guid },
        { $push: { trajectories: { $each: payload } } },
      );
    } catch (error) {
      throw new NotFoundException(
        'Gagal Menambahkan Trajectories, Id lahan tidak ditemukan!',
      );
    }
  }

  async addDataAlam(guid: string, payload: UpdateDataAlamDto): Promise<void> {
    try {
      await this.lahanModel.findOneAndUpdate(
        { guid },
        { ...payload },
        { new: true },
      );
    } catch (error) {
      throw new NotFoundException(
        'Gagal Menambahkan Data Lahan, Id lahan tidak ditemukan!',
      );
    }
  }

  async deleteLahanById(guid: string): Promise<string> {
    try {
      const lahan = await this.lahanModel.findOne({ guid });

      if (lahan && lahan.foto) {
        this.deleteFotoLahan(lahan.foto);
      }

      await this.lahanModel.findOneAndDelete({ guid });

      return guid;
    } catch (error) {
      throw new NotFoundException(
        'Gagal Hapus Lahan, Id Lahan Tidak Ditemukan!',
      );
    }
  }

  async updateFotoLahan(guid: string, foto: string): Promise<void> {
    try {
      const lahan = await this.lahanModel.findOne({ guid });

      if (lahan && lahan.foto) {
        await this.deleteFotoLahan(lahan.foto);
      }
      await this.lahanModel.findOneAndUpdate({ guid }, { foto }, { new: true });
    } catch (error) {
      throw new NotFoundException(
        'Gagal Update Foto Lahan, Id Lahan Tidak Ditemukan!',
      );
    }
  }

  async deleteFotoLahan(filename: string) {
    const imagePath = resolve(
      __dirname,
      `../../public/image/lahan/${filename}`,
    );
    unlinkSync(imagePath);
  }
}
