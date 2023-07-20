import { Module, forwardRef } from '@nestjs/common';
import { LahanController } from './lahan.controller';
import { LahanService } from './lahan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lahan, LahanSchema } from './schema/data-lahan.schema';
import { PetaniModule } from 'src/petani/petani.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lahan.name, schema: LahanSchema }]),
    forwardRef(() => PetaniModule),
  ],
  controllers: [LahanController],
  providers: [LahanService],
  exports: [LahanService],
})
export class LahanModule {}
