import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  Matches,
  IsMongoId,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  province?: string;

  @IsOptional()
  @IsPhoneNumber(undefined) // Generic phone validation
  @MaxLength(20)
  phoneNumber?: string;

  @IsMongoId() // Validate that it's a valid MongoDB ObjectId string
  @IsNotEmpty()
  admin: string; // Expecting the User ID string from the request

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7) // e.g., #RRGGBB
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  secondaryColor?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Optional on creation, defaults to true in schema
}
