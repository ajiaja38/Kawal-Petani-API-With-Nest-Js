import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PetaniModule } from './petani/petani.module';
import { LahanModule } from './lahan/lahan.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { TanamanModule } from './tanaman/tanaman.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    UsersModule,
    PetaniModule,
    LahanModule,
    AuthModule,
    TanamanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
