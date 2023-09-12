import { JwtPayload } from '.';
export type JwtPayloadWRT = JwtPayload & { refreshToken: string };
