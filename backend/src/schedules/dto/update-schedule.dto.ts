import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsMongoId, IsOptional } from 'class-validator';

// Use PartialType to make all fields optional by default
// We might override specific fields if needed, like making weeklyHours required for update
export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  // Make club optional for update operations
  @IsOptional()
  @IsMongoId()
  club?: string;

  // Note: By default, weeklyHours is now optional due to PartialType.
  // If you always want to replace the entire schedule on update,
  // you might remove PartialType and redefine weeklyHours as required here,
  // or add specific validation in the service layer.
  // For now, we allow partial updates (though updating individual days in the array
  // might require more complex logic in the service).
}
