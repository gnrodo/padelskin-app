import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'; // Import UseGuards, Query
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedules')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard('jwt') to the entire controller
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  // Allow filtering by clubId via query parameter
  findAll(@Query('clubId') clubId?: string) {
    // Add specific logic if needed, e.g., find by club or find one specific schedule by club
    if (clubId) {
      // Example: Find the specific schedule for a club (assuming one per club)
      return this.schedulesService.findOneByClub(clubId);
    }
    // Otherwise, find all schedules (might need admin role check)
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id); // Pass id as string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(id, updateScheduleDto); // Pass id as string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id); // Pass id as string
  }
}
