import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { Court, CourtSchema } from './entities/court.entity'; // Import Court and CourtSchema

@Module({
  imports: [
    // Add imports array
    MongooseModule.forFeature([{ name: Court.name, schema: CourtSchema }]), // Register Court schema
  ],
  controllers: [CourtsController],
  providers: [CourtsService],
  exports: [CourtsService], // Export CourtsService
})
export class CourtsModule {}
