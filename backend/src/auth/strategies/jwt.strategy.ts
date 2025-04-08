import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Import the payload interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('AUTH0_ISSUER_URL')}.well-known/jwks.json`, // Construct JWKS URI
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from 'Authorization: Bearer <token>' header
      audience: configService.get<string>('AUTH0_AUDIENCE'), // Validate the audience claim
      issuer: configService.get<string>('AUTH0_ISSUER_URL'), // Validate the issuer claim
      algorithms: ['RS256'], // Auth0 uses RS256 algorithm
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // The token signature and claims (aud, iss, exp) are already verified by passport-jwt.
    // We receive the validated payload here.
    // We simply return it to be attached to req.user.
    // Ensure the payload has the expected structure (at least 'sub').
    if (!payload || !payload.sub) {
      throw new UnauthorizedException(
        'Invalid token payload: missing sub claim',
      );
    }
    // console.log('Validated JWT Payload:', payload); // For debugging
    return payload; // Attach the validated payload to req.user
  }
}
