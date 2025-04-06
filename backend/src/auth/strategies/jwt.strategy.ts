import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa'; // Library to fetch JWKS keys

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

  // This method is called after the token is successfully validated (signature, expiration, audience, issuer)
  // The 'payload' argument contains the decoded token claims.
  validate(payload: unknown): unknown {
    // Here, the token is already verified by passport-jwt using JWKS.
    // The payload contains the decoded token information (like sub, email, permissions, etc.).
    // We can simply return the payload, which will be attached to the request object as request.user.
    // Optionally, you could fetch user details from your DB based on payload.sub (Auth0 user ID)
    // if you need to attach your internal user object to the request.
    // For now, returning the raw payload is sufficient for authorization checks based on token claims.

    if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
    }
    // console.log('JWT Payload:', payload); // For debugging
    return payload; // The payload will be attached to req.user
  }
}