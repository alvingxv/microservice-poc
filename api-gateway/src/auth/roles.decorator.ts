import { Role } from './role.enum';
import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);
