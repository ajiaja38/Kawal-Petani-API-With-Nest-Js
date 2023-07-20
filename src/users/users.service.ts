import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UpdateUserPasswordDto } from './dto/update-userPassword.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<void> {
    const { email, nama, password, telpon, role = 'surveyor' } = payload;

    await this.validateDuplicatedData(email, nama, telpon);

    let roleName: string;

    role === 'superAdmin' ? (roleName = 'superAdmin') : (roleName = 'Surveyor');

    const guid = `${roleName}-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const hashedPassword = await bcrypt.hash(password, 10);

    const schema = {
      guid,
      email,
      nama,
      password: hashedPassword,
      telpon,
      role,
      createdAt,
      updatedAt,
    };

    const createUser = new this.userModel(schema);

    await createUser.save();
  }

  async createAdmin(payload: CreateAdminDto): Promise<void> {
    const {
      email,
      nama,
      password,
      telpon,
      provinsi,
      kabupaten,
      kecamatan,
      kelurahan,
      role = 'admin',
    } = payload;

    await this.validateDuplicatedData(email, nama, telpon);

    const guid = `Admin-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const hashedPassword = await bcrypt.hash(password, 10);

    const schema = {
      guid,
      email,
      nama,
      password: hashedPassword,
      telpon,
      provinsi,
      kabupaten,
      kecamatan,
      kelurahan,
      role,
      createdAt,
      updatedAt,
    };

    const createUser = new this.userModel(schema);

    await createUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel
      .find()
      .select('guid email nama telpon role createdAt updatedAt');

    if (!users.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return users;
  }

  async getAllAdmins(): Promise<User[]> {
    const admin = await this.userModel
      .find({ role: 'admin' })
      .select(
        'guid email nama telpon provinsi kabupaten kecamatan kelurahan role createdAt updatedAt',
      );

    if (!admin.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return admin;
  }

  async getAllSurveyors(): Promise<User[]> {
    const surveyors = await this.userModel
      .find({ role: 'surveyor' })
      .select('guid email nama telpon role createdAt updatedAt');

    if (!surveyors.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return surveyors;
  }

  async getPaginateAllDataUsers(
    search: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const regexQuery = new RegExp(search, 'i');
    const query = {
      $or: [
        { email: regexQuery },
        { nama: regexQuery },
        { telpon: regexQuery },
      ],
    };

    const totalUsers = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('guid email nama telpon role createdAt updatedAt');

    if (!users.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return {
      totalPages,
      page,
      totalUsers,
      users,
    };
  }

  async getPaginateAllDataAdmin(
    search: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const regexQuery = new RegExp(search, 'i');
    const query = {
      $and: [
        { role: 'admin' },
        {
          $or: [
            { email: regexQuery },
            { nama: regexQuery },
            { telpon: regexQuery },
          ],
        },
      ],
    };

    const totalUsers = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        'guid email nama telpon provinsi kabupaten kecamatan kelurahan role createdAt updatedAt',
      );

    if (!users.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return {
      totalPages,
      page,
      totalUsers,
      users,
    };
  }

  async getPaginateAllDataSurveyor(
    search: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const regexQuery = new RegExp(search, 'i');
    const query = {
      $and: [
        { role: 'surveyor' },
        {
          $or: [
            { email: regexQuery },
            { nama: regexQuery },
            { telpon: regexQuery },
          ],
        },
      ],
    };

    const totalUsers = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('guid email nama telpon role createdAt updatedAt');

    if (!users.length) {
      throw new NotFoundException('User belum ada yang mendaftar');
    }

    return {
      totalPages,
      page,
      totalUsers,
      users,
    };
  }

  async getUseById(guid: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ guid })
      .select('guid email nama telpon role createdAt updatedAt');

    if (!user) {
      throw new NotFoundException('Maaf Guid User tidak ditemukan!');
    }

    return user;
  }

  async updateUserById(guid: string, payload: UpdateUserDto): Promise<void> {
    const { email, nama, telpon, role = 'surveyor' } = payload;

    await this.validateDuplicatedData(email, nama, telpon, guid);

    const updatedAt = new Date().toISOString();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { guid },
      {
        email,
        nama,
        telpon,
        role,
        updatedAt,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Gagal update user, Guid tidak ditemukan!');
    }
  }

  async updateAdminById(guid: string, payload: UpdateAdminDto): Promise<void> {
    const { email, nama, telpon } = payload;

    await this.validateDuplicatedData(email, nama, telpon, guid);

    const updatedAt = new Date().toISOString();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { guid },
      {
        ...payload,
        updatedAt,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Gagal update Admin, Guid tidak ditemukan!');
    }
  }

  async updatePasswordByGuid(
    guid: string,
    payload: UpdateUserPasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword, confirmPassword } = payload;
    const user = await this.userModel.findOne({ guid });

    if (!user) {
      throw new NotFoundException(
        'Gagal update password, guid user tidak ditemukan!',
      );
    }

    const validateOldPassword = await bcrypt.compare(
      oldPassword,
      user.password,
    );

    if (!validateOldPassword) {
      throw new BadRequestException('Password Lama anda salah!');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Password Baru dan Confirm Password tidak cocok!',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.save();
  }

  async deleteUserById(guid: string): Promise<void> {
    const deleteUser = await this.userModel.findOneAndDelete({ guid });

    if (!deleteUser) {
      throw new NotFoundException('Gagal Hapus user, Guid tidak ditemukan!');
    }
  }

  async validateDuplicatedData(
    email: string,
    nama: string,
    telpon: string,
    guid: string = null,
  ): Promise<void> {
    const sameEmail = await this.userModel.findOne({ email });
    const sameUsername = await this.userModel.findOne({ nama });
    const sameTelephone = await this.userModel.findOne({ telpon });

    if (sameEmail && sameEmail.guid !== guid) {
      throw new BadRequestException(
        'Email Telah digunakan, mohon ganti Email anda!',
      );
    }

    if (sameUsername && sameUsername.guid !== guid) {
      throw new BadRequestException(
        'Nama Telah digunakan, mohon ganti nama anda!',
      );
    }

    if (sameTelephone && sameTelephone.guid !== guid) {
      throw new BadRequestException(
        'Nomor Telepon Telah digunakan, mohon ganti Nomor Telepon anda!',
      );
    }
  }

  async verifyUsersCredentials(payload: LoginDto): Promise<string> {
    const { email, password } = payload;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Email Tidak Valid');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Password Tidak Valid');
    }

    return user.id;
  }
}
