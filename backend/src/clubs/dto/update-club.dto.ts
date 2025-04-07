import { PartialType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';
import { IsMongoId, IsOptional } from 'class-validator';

// Inherit properties and validations from CreateClubDto, making them optional
export class UpdateClubDto extends PartialType(CreateClubDto) {
  // Override admin validation to make it optional during update
  // (assuming admin cannot be changed or is handled separately)
  @IsOptional()
  @IsMongoId()
  admin?: string; // Make admin optional for update operations
}
