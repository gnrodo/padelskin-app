import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity'; // Import User and UserSchema

@Module({
  imports: [
    // Add imports array
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
