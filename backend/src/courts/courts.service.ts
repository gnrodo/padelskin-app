import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Court, CourtDocument } from './entities/court.entity';
// TODO: Import ClubsService if validation for club existence is needed on create/update

@Injectable()
export class CourtsService {
  constructor(
    @InjectModel(Court.name) private courtModel: Model<CourtDocument>,
  ) {}
  // TODO: Inject ClubsService if needed

  async create(createCourtDto: CreateCourtDto): Promise<Court> {
    // TODO: Validate that the provided club ID exists using ClubsService
    // const clubExists = await this.clubsService.findOne(createCourtDto.club);
    // if (!clubExists) {
    //   throw new BadRequestException(`Club with ID "${createCourtDto.club}" not found.`);
    // }

    // Optional: Check if court name already exists within the same club
    // const existingCourt = await this.courtModel.findOne({
    //   club: createCourtDto.club,
    //   name: createCourtDto.name
    // }).exec();
    // if (existingCourt) {
    //   throw new BadRequestException(`Court with name "${createCourtDto.name}" already exists in this club.`);
    // }

    const createdCourt = new this.courtModel(createCourtDto);
    return createdCourt.save();
  }

  async findAll(clubId?: string): Promise<CourtDocument[]> {
    // Return CourtDocument
    const filter = clubId ? { club: clubId } : {};
    return this.courtModel.find(filter).populate('club', 'name slug').exec(); // Populate basic club info
  }

  async findOne(id: string): Promise<Court> {
    const court = await this.courtModel
      .findById(id)
      .populate('club', 'name slug')
      .exec();
    if (!court) {
      throw new NotFoundException(`Court with ID "${id}" not found`);
    }
    return court;
  }

  async update(id: string, updateCourtDto: UpdateCourtDto): Promise<Court> {
    // Optional: Add validation if name/club combination needs to remain unique

    // Prevent changing the club via this method for simplicity
    if (updateCourtDto.club) {
      throw new BadRequestException(
        'Changing the club of a court is not allowed via update.',
      );
    }

    const updatedCourt = await this.courtModel
      .findByIdAndUpdate(id, updateCourtDto, { new: true })
      .populate('club', 'name slug')
      .exec();

    if (!updatedCourt) {
      throw new NotFoundException(`Court with ID "${id}" not found`);
    }
    return updatedCourt;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.courtModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Court with ID "${id}" not found`);
    }
    return { deleted: true, id };
  }
}
