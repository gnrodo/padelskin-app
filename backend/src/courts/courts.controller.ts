import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'; // Import UseGuards, Query
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Controller('courts')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard('jwt') to the entire controller
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  // Allow filtering by clubId via query parameter
  findAll(@Query('clubId') clubId?: string) {
    return this.courtsService.findAll(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id); // Pass id as string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtsService.update(id, updateCourtDto); // Pass id as string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtsService.remove(id); // Pass id as string
  }
}
