import { Module, forwardRef } from '@nestjs/common';
import { PetaniController } from './petani.controller';
import { PetaniService } from './petani.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Petani, PetaniSchema } from './schema/data-petani.schema';
import { LahanModule } from 'src/lahan/lahan.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Petani.name, schema: PetaniSchema }]),
    forwardRef(() => LahanModule),
  ],
  controllers: [PetaniController],
  providers: [PetaniService],
  exports: [PetaniService],
})
export class PetaniModule {}
