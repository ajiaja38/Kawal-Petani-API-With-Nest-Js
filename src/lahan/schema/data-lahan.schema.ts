/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface Trajectories {
  lat: number,
  long: number
}

@Schema()
export class Lahan {
  @Prop({
    unique: true,
    required: true
  })
  guid: string
  
  @Prop({ required: true })
  nama: string

  @Prop({ required: true })
  jenis: string

  @Prop({ required: true })
  periodePanen: string

  @Prop({ required: true })
  jumlahTanaman: number

  @Prop({ required: true })
  hasilPanen: number

  @Prop({ required: true })
  hasilLab: string

  @Prop({ required: true })
  luas: number

  @Prop({ default: null })
  foto: string

  @Prop({ type: [{ lat: Number, long: Number }], default: [] })
  trajectories: Trajectories[]

  @Prop({ type: String, ref: 'Petani', required: true })
  owner: string

  @Prop({ default: null })
  COMPANY_GUID: string

  @Prop({ default: null })
  jenisTanah: string

  @Prop({ default: null })
  ketinggian: string

  @Prop({ default: null })
  curahHujan: string

  @Prop({ default: null })
  suhuRataRata: string

  @Prop({ default: null })
  jenisVegetasi: string

  @Prop({ default: null })
  jumlahVegetasi: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const LahanSchema = SchemaFactory.createForClass(Lahan);
