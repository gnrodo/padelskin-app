import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

// Inherit properties and validations from CreateUserDto, making them optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Override password validation to make it optional but still enforce min length if provided
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;
}
