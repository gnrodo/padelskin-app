import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Club } from '../../clubs/entities/club.entity'; // Import Club entity

export type CourtDocument = HydratedDocument<Court>;

export enum CourtType {
  INDOOR_GLASS = 'indoor_glass',
  INDOOR_WALL = 'indoor_wall',
  OUTDOOR_GLASS = 'outdoor_glass',
  OUTDOOR_WALL = 'outdoor_wall',
  SINGLE_INDOOR = 'single_indoor', // Optional: For single courts
  SINGLE_OUTDOOR = 'single_outdoor', // Optional: For single courts
}

@Schema({ timestamps: true })
export class Court {
  @Prop({ required: true, trim: true })
  name: string; // e.g., "Cancha 1", "Principal", "Cancha A"

  @Prop({ type: String, enum: CourtType, required: true })
  type: CourtType; // Type of court (indoor/outdoor, glass/wall)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Club; // Reference to the Club this court belongs to

  @Prop({ default: true })
  isActive: boolean; // To enable/disable a court for bookings

  // Optional fields
  @Prop({ trim: true })
  description?: string;

  @Prop()
  photoUrl?: string;
}

export const CourtSchema = SchemaFactory.createForClass(Court);

// Optional: Compound index if needed, e.g., ensure court name is unique within a club
// CourtSchema.index({ club: 1, name: 1 }, { unique: true });
