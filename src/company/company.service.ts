import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schema/company.schema';
import mongoose from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/users/schema/users.schema';
import { Lahan } from 'src/lahan/schema/data-lahan.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: mongoose.Model<Company>,

    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,

    @InjectModel(Lahan.name)
    private readonly lahanModel: mongoose.Model<Lahan>,
  ) {}

  async createCompany(payload: CreateCompanyDto): Promise<string> {
    try {
      const COMPANY_GUID = `Company-${uuidv4()}`;
      const { COMPANY_NAME } = payload;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const schema = {
        COMPANY_GUID,
        COMPANY_NAME,
        createdAt,
        updatedAt,
      };

      const createCompany = new this.companyModel(schema);
      createCompany.save();

      return createCompany.COMPANY_GUID;
    } catch (error) {
      throw new InternalServerErrorException('Gagal Menambahkan Company');
    }
  }

  async getAllCompany(): Promise<Company[]> {
    const companies = await this.companyModel
      .find()
      .select('COMPANY_GUID COMPANY_NAME createdAt updatedAt');

    if (!companies.length) {
      throw new NotFoundException('Belum ada company yang diinputkan!');
    }

    return companies;
  }

  async getCompanyByGuid(COMPANY_GUID: string): Promise<Company> {
    const company = await this.companyModel
      .findOne({ COMPANY_GUID })
      .select('COMPANY_GUID COMPANY_NAME createdAt updatedAt');

    if (!company) {
      throw new NotFoundException(
        'Gagal Mendapatkan company, GUID tidak ditemukan!',
      );
    }

    return company;
  }

  async updateCompanyByGuid(
    COMPANY_GUID: string,
    payload: UpdateCompanyDto,
  ): Promise<string> {
    try {
      const updatedCompany = await this.companyModel.findOneAndUpdate(
        { COMPANY_GUID },
        { ...payload },
        { new: true },
      );

      return updatedCompany.COMPANY_GUID;
    } catch (error) {
      throw new NotFoundException(
        'Gagal update company, GUID tidak ditemukan!',
      );
    }
  }

  async deleteCompanyByGuid(COMPANY_GUID: string): Promise<void> {
    try {
      await this.companyModel.findOneAndDelete({
        COMPANY_GUID,
      });

      await this.userModel.updateMany(
        { COMPANY_GUID },
        { $set: { COMPANY_GUID: null } },
      );

      await this.lahanModel.updateMany(
        { COMPANY_GUID },
        { $set: { COMPANY_GUID: null } },
      );
    } catch (error) {
      throw new NotFoundException(
        'Gagal delete company, GUID tidak ditemukan!',
      );
    }
  }
}
