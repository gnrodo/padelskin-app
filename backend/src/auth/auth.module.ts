import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // Re-import PassportModule
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy'; // Import JwtStrategy
// JwtModule is likely already global, but could be imported explicitly if needed
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // Make UsersService available for injection
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule with JWT as default
    // JwtModule is global, no need to import again here if registered globally in AppModule
  ],
  providers: [AuthService, JwtStrategy], // Add JwtStrategy to providers
  controllers: [AuthController],
})
export class AuthModule {}
