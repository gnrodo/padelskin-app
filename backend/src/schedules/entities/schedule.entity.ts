import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Club } from '../../clubs/entities/club.entity'; // Import Club entity

export type ScheduleDocument = HydratedDocument<Schedule>;

// Interface for daily operating hours
export interface DailyHours {
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  isOpen: boolean;
  openTime?: string; // Format "HH:MM" e.g., "14:00"
  closeTime?: string; // Format "HH:MM" e.g., "23:00"
  slotDurationMinutes?: number; // e.g., 90
}

// Helper function to generate default weekly hours (e.g., Mon-Sun 14:00-23:00, 90min slots)
const defaultWeeklyHours = (): DailyHours[] => {
  const hours: DailyHours[] = [];
  for (let i = 0; i < 7; i++) {
    hours.push({
      dayOfWeek: i,
      isOpen: true, // Default to open
      openTime: '14:00',
      closeTime: '23:00',
      slotDurationMinutes: 90,
    });
  }
  return hours;
};

@Schema({ timestamps: true })
export class Schedule {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Club',
    required: true,
    unique: true, // Assuming one schedule per club for now
    index: true,
  })
  club: Club; // Reference to the Club this schedule belongs to

  @Prop({
    type: [
      // Define structure for the array elements
      raw({
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        isOpen: { type: Boolean, required: true, default: true },
        openTime: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // HH:MM format validation
        closeTime: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // HH:MM format validation
        slotDurationMinutes: { type: Number, min: 15 }, // Min 15 min slots
      }),
    ],
    required: true,
    default: defaultWeeklyHours, // Use helper for default value
    _id: false, // Don't generate _id for subdocuments in the array
  })
  weeklyHours: DailyHours[];

  // TODO: Add fields for specific date overrides (holidays, special events)
  // TODO: Add fields for pricing variations if needed
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
