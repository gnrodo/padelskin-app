import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

const SALT_ROUNDS = 10; // Standard salt rounds for bcrypt

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required.');
    }

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email.toLowerCase() }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);

    const createdUser = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(), // Ensure email is lowercase
      passwordHash, // Store the hashed password
    });

    const savedUser = await createdUser.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = savedUser.toObject(); // Exclude passwordHash from result
    return result;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    // Exclude passwordHash from the results
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Helper method to find user by email (useful for authentication later)
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const updatePayload: Partial<User> = {};

    // Hash password if provided
    if (updateUserDto.password) {
      updatePayload.passwordHash = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }

    // Add other updatable fields from DTO to payload if they exist
    if (updateUserDto.name !== undefined) {
      updatePayload.name = updateUserDto.name;
    }
    if (updateUserDto.email !== undefined) {
      // Optional: Add check here if email change requires re-verification or uniqueness check
      updatePayload.email = updateUserDto.email.toLowerCase();
    }
    if (updateUserDto.role !== undefined) {
      updatePayload.role = updateUserDto.role;
    }
    if (updateUserDto.phoneNumber !== undefined) {
      updatePayload.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.padelCategory !== undefined) {
      updatePayload.padelCategory = updateUserDto.padelCategory;
    }
    // Add other fields like reliabilityScore if they become updatable via DTO

    if (Object.keys(updatePayload).length === 0) {
       // Avoid unnecessary database call if no fields are being updated
       // Find the existing user to return it, excluding the hash
       const existingUser = await this.findOne(id);
       return existingUser;
       // Or throw BadRequestException('No update fields provided.');
    }

    // Perform the update with the constructed payload
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updatePayload, { new: true }) // Use the safe updatePayload
      .select('-passwordHash') // Exclude passwordHash from the result
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }
}
