import { SetMetadata } from '@nestjs/common';

export enum RoleEnum {
	ADMIN = 'admin',
	AUTHOR = 'author'
}

export const ROLES_KEY = 'roles';

export const UseRole = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
