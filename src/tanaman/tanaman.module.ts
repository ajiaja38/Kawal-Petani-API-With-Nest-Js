import { Module } from '@nestjs/common';
import { TanamanController } from './tanaman.controller';
import { TanamanService } from './tanaman.service';

@Module({
  controllers: [TanamanController],
  providers: [TanamanService]
})
export class TanamanModule {}
