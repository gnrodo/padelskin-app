import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe, ValidationPipe } from '@nestjs/common'; // Import Query, ParseIntPipe, DefaultValuePipe, ValidationPipe
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard('jwt') to the entire controller
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id); // Pass id as string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto); // Pass id as string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id); // Pass id as string
  }

  // --- Availability Endpoint ---
  @Get(':clubId/availability')
  // Use ValidationPipe specifically for query params if needed, or rely on global pipe
  getAvailability(
    @Param('clubId') clubId: string,
    @Query('date') date: string, // Expecting YYYY-MM-DD format
  ) {
    // TODO: Add validation for the date format if not handled by global pipe/DTO
    if (!date) {
        // Handle missing date query param - perhaps default to today or throw error
        // For now, let the service handle it or throw implicitly
    }
    // Placeholder: Call a new service method to calculate availability
    return this.clubsService.getAvailability(clubId, date);
  }
}
