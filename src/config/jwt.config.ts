/* eslint-disable prettier/prettier */
import { JwtModuleOptions } from '@nestjs/jwt'
import { jwtConstant } from 'src/auth/constant/constant';

export const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: jwtConstant.secret,
  signOptions: {
    expiresIn: 5000000
  },
};
