/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/schema/users.schema';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);