import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
  ) {}

  // Fetch all locations
  async findAllLocations(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  // Fetch a single location by ID
  async findLocationById(id: number): Promise<Location> {
    return this.locationRepository.findOne({ where: { id } });
  }

  // Create a new location
  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const location = this.locationRepository.create(locationData);
    return this.locationRepository.save(location);
  }

  // Delete a location by ID
  async deleteLocation(id: number): Promise<void> {
    const result = await this.locationRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`Location with ID ${id} not found`);
    }
  }
}
