import { Module, forwardRef } from '@nestjs/common';
import { TanamanController } from './tanaman.controller';
import { TanamanService } from './tanaman.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tanaman, TanamanSchema } from './schema/tanaman.schema';
import { PetaniModule } from 'src/petani/petani.module';
import { LahanModule } from 'src/lahan/lahan.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tanaman.name, schema: TanamanSchema }]),
    forwardRef(() => PetaniModule),
    forwardRef(() => LahanModule),
  ],
  controllers: [TanamanController],
  providers: [TanamanService],
})
export class TanamanModule {}
