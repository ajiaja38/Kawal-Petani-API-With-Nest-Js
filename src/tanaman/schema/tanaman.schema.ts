/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'tanamans' })
export class Tanaman {
  @Prop({
    unique: true,
    required: true
  })
  guid: string
  
  @Prop({ required: true })
  guidPetani: string

  @Prop({ required: true })
  guidLahan: string

  @Prop({ required: true })
  nama: string

  @Prop({ required: true })
  latitude: number

  @Prop({ required: true })
  longitude: number

  @Prop({ required: true })
  foto: string
}

export const TanamanSchema = SchemaFactory.createForClass(Tanaman);
