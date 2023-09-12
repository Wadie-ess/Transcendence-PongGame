import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IntraDto } from '../dto/intra.dto';

export const GetIntraData = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IntraDto;
    return user;
  },
);
