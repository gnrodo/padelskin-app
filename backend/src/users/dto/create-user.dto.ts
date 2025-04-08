import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber, // Consider using a more specific validator if needed
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole, PadelCategory } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  }) // Transform email to lowercase
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // Optional, defaults to PLAYER in service

  @IsOptional()
  @IsPhoneNumber(undefined) // Use undefined for generic phone number validation
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(PadelCategory)
  padelCategory?: PadelCategory;
}
