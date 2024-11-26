import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: Role;
  name: string;
  token?: string;
  rol_group: Array<any>;
  permissions: Permissions
}

export class Permissions {
  permission_module: Array<object>;
  permission_object: Array<string>;
}