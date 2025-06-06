import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context) {
    console.log('JwtGuard is being called');
    return super.canActivate(context);
  }
}
