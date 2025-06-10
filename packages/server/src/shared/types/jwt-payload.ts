import { Role } from "../enums/role.enum";

export type JwtPayload = {
  sub: number;
  role: Role;
  jti?: number;
};
