import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { Submission } from '../submission/submission.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    @InjectRepository(Submission) private sessionRepository: Repository<Submission>,
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

  async deleteLocation(id: number): Promise<{ affectedSessions: number }> {
    // Check if any submission is using this location
    const submissions = await this.sessionRepository.find({
      where: {
        location: { id }, // Reference the location's id, not locationId
      },
    });
  
    // If there are active sessions (submissions), return the number of affected sessions
    if (submissions.length > 0) {
      return { affectedSessions: submissions.length };
    }
  
    // Proceed with deletion if no active sessions
    await this.locationRepository.delete(id);
  
    // Return a success response
    return { affectedSessions: 0 }; // No sessions were affected
  }  
  
}
