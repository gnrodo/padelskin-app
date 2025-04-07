import {
  IsMongoId,
  IsNotEmpty,
  IsDateString, // Use IsDateString for ISO 8601 date strings
  IsEnum,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { BookingStatus, MatchType, GameType } from '../entities/booking.entity';

export class CreateBookingDto {
  // User ID will likely come from the authenticated user context (req.user), not the body
  // @IsMongoId()
  // @IsNotEmpty()
  // user: string;

  @IsMongoId()
  @IsNotEmpty()
  club: string; // Club ID

  @IsMongoId()
  @IsNotEmpty()
  court: string; // Court ID

  @IsDateString() // Expecting ISO 8601 format string from frontend
  @IsNotEmpty()
  startTime: string;

  // endTime will likely be calculated based on startTime and slot duration

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus; // Status might be set by the service logic

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; // Price in cents/smallest unit

  @IsOptional()
  @IsEnum(MatchType)
  matchType?: MatchType;

  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true }) // Validate each element is a Mongo ID
  @ArrayMinSize(0) // Allow empty array initially
  players?: string[]; // Array of User IDs (booker might be added automatically)

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsBoolean()
  needsPlayers?: boolean;

  // Payment fields are usually handled separately or by backend logic
}
