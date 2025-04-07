import {
  IsMongoId,
  IsNotEmpty,
  IsArray,
  ValidateNested, // Needed to validate nested objects in array
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsString,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer'; // Needed for nested validation

// DTO for a single day's hours within the weekly schedule
class DailyHoursDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsBoolean()
  isOpen: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'openTime must be in HH:MM format' })
  openTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'closeTime must be in HH:MM format' })
  closeTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  slotDurationMinutes?: number;
}

export class CreateScheduleDto {
  @IsMongoId()
  @IsNotEmpty()
  club: string; // Expecting the Club ID string

  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => DailyHoursDto) // Specify the type of the nested objects
  @IsNotEmpty()
  weeklyHours: DailyHoursDto[];
}
