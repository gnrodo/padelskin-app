import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { CourtType } from '../entities/court.entity';

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // e.g., "Cancha 1", "Principal"

  @IsEnum(CourtType)
  @IsNotEmpty()
  type: CourtType;

  @IsMongoId() // Validate that it's a valid MongoDB ObjectId string
  @IsNotEmpty()
  club: string; // Expecting the Club ID string from the request

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Optional on creation, defaults to true in schema
}
