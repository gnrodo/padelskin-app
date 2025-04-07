import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'; // Import UseGuards
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
// @UseGuards(AuthGuard('jwt')) // Removed from controller level
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Protect findAll
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // Protect findOne
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id); // Pass id as string
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // Protect update
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto); // Pass id as string
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Protect remove
  remove(@Param('id') id: string) {
    return this.usersService.remove(id); // Pass id as string
  }
}
