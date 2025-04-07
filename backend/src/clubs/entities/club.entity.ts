import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity'; // Import User entity

export type ClubDocument = HydratedDocument<Club>;

@Schema({ timestamps: true })
export class Club {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string; // Unique identifier for URLs/skins (e.g., 'club-los-amigos')

  @Prop({ trim: true })
  address?: string; // Optional address

  @Prop({ trim: true })
  city?: string; // Optional city

  @Prop({ trim: true })
  province?: string; // Optional province

  @Prop({ type: String, trim: true }) // Store phone number as string
  phoneNumber?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  admin: User; // Reference to the User who administers this club

  // TODO: Add reference to Courts later
  // @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Court' }])
  // courts: Court[];

  // TODO: Add reference to Schedule later
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Schedule' })
  // schedule: Schedule;

  // Fields for multi-skin customization (placeholders)
  @Prop({ trim: true })
  logoUrl?: string;

  @Prop({ trim: true })
  primaryColor?: string;

  @Prop({ trim: true })
  secondaryColor?: string;

  @Prop({ default: true })
  isActive: boolean; // To enable/disable a club
}

export const ClubSchema = SchemaFactory.createForClass(Club);

// Add index for slug for faster lookups
// ClubSchema.index({ slug: 1 }); // Index is created by @Prop({ unique: true })
// Add index for admin for potential lookups by admin
// ClubSchema.index({ admin: 1 }); // Index can be added via @Prop({ index: true }) if needed
