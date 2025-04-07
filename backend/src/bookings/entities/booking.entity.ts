import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Club } from '../../clubs/entities/club.entity';
import { Court } from '../../courts/entities/court.entity';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING_PAYMENT = 'pending_payment',
  CONFIRMED = 'confirmed',
  CANCELLED_BY_USER = 'cancelled_by_user',
  CANCELLED_BY_ADMIN = 'cancelled_by_admin',
  COMPLETED = 'completed', // After the game time has passed
  NO_SHOW = 'no_show',
}

export enum MatchType {
  SINGLE = 'single', // If you support single matches
  DOUBLE = 'double',
}

export enum GameType {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
  OPEN = 'open',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  user: User; // User who made the booking

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Club;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Court', required: true, index: true })
  court: Court;

  @Prop({ required: true, index: true })
  startTime: Date; // Start date and time of the booking

  @Prop({ required: true })
  endTime: Date; // End date and time of the booking

  @Prop({ type: String, enum: BookingStatus, required: true, default: BookingStatus.PENDING_PAYMENT })
  status: BookingStatus;

  @Prop({ type: Number }) // Store price in cents or smallest currency unit
  price?: number;

  // --- Match Specific Fields ---
  @Prop({ type: String, enum: MatchType, default: MatchType.DOUBLE })
  matchType: MatchType;

  @Prop({ type: String, enum: GameType, default: GameType.OPEN })
  gameType: GameType;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  players: Types.ObjectId[]; // Array of User IDs participating (including the booker initially)

  @Prop({ default: false })
  isPrivate: boolean; // If true, match is not open for others to join

  @Prop({ default: false })
  needsPlayers: boolean; // Flag if the match needs more players

  // --- Payment Specific Fields (Placeholders) ---
  @Prop()
  paymentIntentId?: string; // e.g., Mercado Pago Payment Intent ID

  @Prop()
  paymentStatus?: string; // e.g., 'succeeded', 'pending', 'failed'

  @Prop()
  paymentMethod?: string; // e.g., 'credit_card', 'pix'
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Compound index to prevent double booking the same court at the same time
BookingSchema.index({ court: 1, startTime: 1 }, { unique: true });
// Index for querying bookings by user
BookingSchema.index({ user: 1, startTime: 1 });
