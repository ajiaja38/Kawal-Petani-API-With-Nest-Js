/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  ADMIN = 'admin',
  SURVEYOR = 'surveyor',
  SUPER_ADMIN = 'superAdmin'
}

@Schema()
export class User {
  @Prop({
    unique: true,
    required: true
  })
  guid: string
  
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  nama: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  telpon: string

  @Prop({ default: null })
  provinsi: string

  @Prop({ default: null })
  kabupaten: string

  @Prop({ default: null })
  kecamatan: string
  
  @Prop({ default: null })
  kelurahan: string

  @Prop({ type: String, enum: Role, default: Role.SURVEYOR })
  role: Role

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)