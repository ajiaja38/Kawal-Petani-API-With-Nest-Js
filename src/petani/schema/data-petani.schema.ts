/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Petani {
  @Prop({
    unique: true,
    required: true
  })
  guid: string
  
  @Prop({ required: true })
  nama: string

  @Prop({
    unique: true,
    required: true
  })
  nik: string

  @Prop({ required: true })
  provinsi: string

  @Prop({ required: true })
  kabupaten: string

  @Prop({ required: true })
  kecamatan: string
  
  @Prop({ required: true })
  kelurahan: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const PetaniSchema = SchemaFactory.createForClass(Petani)