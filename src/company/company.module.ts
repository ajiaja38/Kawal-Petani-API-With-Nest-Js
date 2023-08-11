import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema/company.schema';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { Lahan, LahanSchema } from 'src/lahan/schema/data-lahan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Lahan.name, schema: LahanSchema }]),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
