import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsMongoId, IsOptional } from 'class-validator';

// Inherit properties and validations from CreateBookingDto, making them optional
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  // Make fields that shouldn't be updated via simple PATCH optional or remove them

  @IsOptional()
  @IsMongoId()
  club?: string; // Club likely shouldn't change

  @IsOptional()
  @IsMongoId()
  court?: string; // Court likely shouldn't change

  @IsOptional()
  startTime?: string; // Start time change might need special handling/validation

  // Other fields like status, players, etc., are inherited as optional
}
