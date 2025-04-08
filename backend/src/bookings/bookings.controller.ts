import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common'; // Import UseGuards, Req, Query
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'; // Import JwtPayload
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard('jwt') to the entire controller
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  // Inject the request object to access the authenticated user
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    // Assuming JwtStrategy returns the payload with a 'sub' property (Auth0 user ID)
    // Cast req.user to JwtPayload to access 'sub' property safely
    const userId = (req.user as JwtPayload)?.sub;
    if (!userId) {
      // This should technically not happen if AuthGuard is working, but good practice
      throw new Error(
        'User ID not found in request. Authentication might have failed.',
      );
    }
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Get()
  // Allow filtering by clubId, courtId, userId, date via query parameters
  findAll(
    @Query('clubId') clubId?: string,
    @Query('courtId') courtId?: string,
    @Query('userId') userId?: string, // Allow filtering by user
    @Query('date') date?: string,
  ) {
    return this.bookingsService.findAll(clubId, courtId, userId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id); // Pass id as string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    // TODO: Add authorization check - only user who booked or admin should update/delete?
    return this.bookingsService.update(id, updateBookingDto); // Pass id as string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Add authorization check - only user who booked or admin should update/delete?
    return this.bookingsService.remove(id); // Pass id as string
  }
}
