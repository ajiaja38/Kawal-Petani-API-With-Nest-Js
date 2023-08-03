import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Petani } from './schema/data-petani.schema';
import { CreatePetaniDto } from './dto/create-petani.dto';
import { UpdatePetaniDto } from './dto/update-petani.dto';
import { LahanService } from 'src/lahan/lahan.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PetaniService {
  constructor(
    @InjectModel('Petani')
    private readonly petaniModel: mongoose.Model<Petani>,

    @Inject(forwardRef(() => LahanService))
    private readonly lahanService: LahanService,
  ) {}

  async createDataPetani(payload: CreatePetaniDto): Promise<void> {
    const { nik } = payload;
    await this.validateDuplicateValue(nik);

    const guid = `Petani-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const schema = {
      guid,
      ...payload,
      createdAt,
      updatedAt,
    };

    const createPetani = new this.petaniModel(schema);
    const result = await createPetani.save();

    if (!result) {
      throw new InternalServerErrorException('Gagal Menambahkan data petani');
    }
  }

  async getAllPetani(): Promise<Petani[]> {
    const petani = await this.petaniModel
      .find()
      .select(
        ' guid nama nik provinsi kabupaten kecamatan kelurahan latitude longitude dataLahan createdAt updatedAt ',
      );

    if (!petani.length) {
      throw new NotFoundException('Belum ada petani yang didaftarkan');
    }

    return petani;
  }

  async getAllPetaniPaginate(
    search: string,
    provinsi: string,
    kabupaten: string,
    kecamatan: string,
    kelurahan: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const regexQuery = new RegExp(search, 'i');
    const query: any = {
      $or: [
        { nama: regexQuery },
        { nik: regexQuery },
        { provinsi: regexQuery },
        { kabupaten: regexQuery },
        { kecamatan: regexQuery },
        { kelurahan: regexQuery },
      ],
    };

    if (provinsi) {
      query.provinsi = { $regex: new RegExp(provinsi, 'i') };
    }

    if (kabupaten) {
      query.kabupaten = { $regex: new RegExp(kabupaten, 'i') };
    }

    if (kecamatan) {
      query.kecamatan = { $regex: new RegExp(kecamatan, 'i') };
    }

    if (kelurahan) {
      query.kelurahan = { $regex: new RegExp(kelurahan, 'i') };
    }

    const totalPetani = await this.petaniModel.countDocuments(query);
    const totalPages = Math.ceil(totalPetani / limit);
    const petani = await this.petaniModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        'guid nama nik provinsi kabupaten kecamatan kelurahan latitude longitude dataLahan createdAt updatedAt',
      );

    if (!petani.length) {
      throw new NotFoundException('Belum ada petani yang didaftarkan');
    }

    return {
      totalPages,
      page,
      totalPetani,
      petani,
    };
  }

  async getPetaniById(guid: string): Promise<any> {
    const petani = await this.petaniModel
      .findOne({ guid })
      .select(
        'guid nama nik provinsi kabupaten kecamatan kelurahan latitude longitude',
      );

    if (!petani) {
      throw new NotFoundException(
        'Gagal mendapatkan petani, Id tidak ditemukan!',
      );
    }

    const lahan = await this.lahanService.getLahanByOwner(guid);

    const dataLahan = lahan.map((lahanItem) => ({
      nama: lahanItem.nama,
      jenis: lahanItem.jenis,
      periodePanen: lahanItem.periodePanen,
      jumlahTanaman: lahanItem.periodePanen,
      hasilPanen: lahanItem.hasilPanen,
      hasilLab: lahanItem.hasilLab,
      foto: lahanItem.foto,
      trajectories: lahanItem.trajectories,
      dataAlam: {
        jenisTanah: lahanItem.jenisTanah,
        ketinggian: lahanItem.ketinggian,
        curahHujan: lahanItem.curahHujan,
        suhuRataRata: lahanItem.suhuRataRata,
        jenisVegetasi: lahanItem.jenisVegetasi,
        jumlahVegetasi: lahanItem.jumlahVegetasi,
      },
    }));

    return {
      ...petani.toJSON(),
      jumlahLahan: lahan.length,
      dataLahan,
    };
  }

  async getAllPetaniByGuid(ownerGuid: string[]): Promise<any> {
    const petani = await this.petaniModel
      .find({ guid: { $in: ownerGuid } })
      .select(' guid nama nik kelurahan ');

    return petani;
  }

  async updatePetaniById(
    guid: string,
    payload: UpdatePetaniDto,
  ): Promise<void> {
    const { nik } = payload;

    await this.validateDuplicateValue(nik, guid);

    const updatedAt = new Date().toISOString();

    const updatedPetani = await this.petaniModel.findOneAndUpdate(
      { guid },
      {
        ...payload,
        updatedAt,
      },
      { new: true },
    );

    if (!updatedPetani) {
      throw new NotFoundException(
        'Gagal Update data petani, Id petani tidak ditemukan!',
      );
    }
  }

  async deletePetaniById(guid: string): Promise<void> {
    const deletedPetani = await this.petaniModel.findOneAndDelete({ guid });

    if (!deletedPetani) {
      throw new NotFoundException(
        'Gagal Hapus data petani, Id petani tidak ditemukan!',
      );
    }
  }

  async validateDuplicateValue(
    nik: string,
    guid: string = null,
  ): Promise<void> {
    const sameNIK = await this.petaniModel.findOne({ nik });

    if (sameNIK && sameNIK.guid !== guid) {
      throw new BadRequestException('NIK telah terdaftar, ganti NIK anda!');
    }
  }
}
