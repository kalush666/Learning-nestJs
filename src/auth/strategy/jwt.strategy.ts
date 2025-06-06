import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    console.log('JWT_SECRET in strategy:', jwtSecret ? 'SET' : 'NOT SET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

    console.log('JwtStrategy initialized successfully');
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('JWT Strategy validate called with payload:', payload);

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log('User found in database:', user ? 'YES' : 'NO');

      if (!user) {
        console.log('User not found for ID:', payload.sub);
        throw new UnauthorizedException('User not found');
      }

      console.log('Returning user:', user);
      return user;
    } catch (error) {
      console.log('Error in JWT validation:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
