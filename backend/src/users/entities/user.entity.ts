import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// Enum for User Roles
export enum UserRole {
  ADMIN = 'admin', // Club Administrator
  PLAYER = 'player', // Regular Player
}

// Enum for Padel Categories
export enum PadelCategory {
  EIGHTH = '8va',
  SEVENTH = '7ma',
  SIXTH = '6ta',
  FIFTH = '5ta',
  FOURTH = '4ta',
  THIRD = '3ra',
  SECOND = '2da',
  FIRST = '1ra',
  // BEGINNER = 'principiante', // Optional: Consider adding a beginner category
}

@Schema({ timestamps: true }) // Enable automatic createdAt and updatedAt fields
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true }) // Password will be hashed before saving
  passwordHash: string; // Store hash, not plain password

  @Prop({ required: true, enum: UserRole, default: UserRole.PLAYER })
  role: UserRole;

  @Prop({ trim: true }) // Optional phone number
  phoneNumber?: string;

  @Prop({ enum: PadelCategory }) // Optional category
  padelCategory?: PadelCategory;

  @Prop({ type: Number, default: 100 }) // Start with a default reliability score
  reliabilityScore: number;

  // Future fields (placeholders):
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Club' })
  // clubId?: string; // If a user belongs to one specific club initially

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }])
  // associatedClubIds?: string[]; // If a user can be associated with multiple clubs
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add index for email for faster lookups
UserSchema.index({ email: 1 });
