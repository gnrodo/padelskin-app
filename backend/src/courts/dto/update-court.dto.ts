import { PartialType } from '@nestjs/mapped-types';
import { CreateCourtDto } from './create-court.dto';
import { IsMongoId, IsOptional } from 'class-validator';

// Inherit properties and validations from CreateCourtDto, making them optional
export class UpdateCourtDto extends PartialType(CreateCourtDto) {
  // Override club validation to make it optional during update
  // (assuming a court cannot be moved to another club easily)
  @IsOptional()
  @IsMongoId()
  club?: string; // Make club optional for update operations
}
