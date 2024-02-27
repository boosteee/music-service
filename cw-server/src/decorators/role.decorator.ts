import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/user/schemas/user.schema';

export const ROLES_KEY = 'role';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
