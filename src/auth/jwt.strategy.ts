import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

// import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //this configuration retrieves the jwt token from the header of the request
      // secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret') // this is the secret that passport is going to use to verify the signatureof the token. Is the same that the one in auth.module.ts
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    // This method is implemented by nest and is accesed every time that the secret is valid
    const { username } = payload;
    const user = await this.userRepository.findOne({ username }); // we retrieve the user based on the username of the token

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}