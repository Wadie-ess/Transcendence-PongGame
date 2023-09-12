import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadWRT } from '../types/JwtPaloadWRT.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWRT | undefined, cntx: ExecutionContext) => {
    const request = cntx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user && user[data] : user;
  },
);
