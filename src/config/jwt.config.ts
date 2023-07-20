/* eslint-disable prettier/prettier */
import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY,
  signOptions: {
    expiresIn: 200000
  },
};
