import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('JwtGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');

    if (authHeader) {
      console.log('Auth header value:', authHeader.substring(0, 20) + '...');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    console.log('JwtGuard handleRequest called');
    console.log('Error:', err ? err.message : 'None');
    console.log('User:', user ? 'Present' : 'Missing');
    console.log('Info:', info);

    if (err) {
      console.log('Throwing error from handleRequest:', err.message);
      throw new UnauthorizedException(err.message);
    }

    if (!user) {
      console.log('No user found, throwing unauthorized');
      throw new UnauthorizedException('Token validation failed');
    }

    console.log('Returning user from handleRequest');
    return user;
  }
}
