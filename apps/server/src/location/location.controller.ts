import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  // Get all locations
  @Get()
  async getAllLocations(): Promise<Location[]> {
    return this.locationService.findAllLocations();
  }

  // Get a location by ID
  @Get(':id')
  async getLocation(@Param('id') id: number): Promise<Location> {
    return this.locationService.findLocationById(id);
  }

  // Create a new location
  @Post()
  async createLocation(@Body() locationData: Partial<Location>): Promise<Location> {
    return this.locationService.createLocation(locationData);
  }

  // Delete a location by ID
  @Delete(':id')
  async deleteLocation(@Param('id') id: number): Promise<void> {
    await this.locationService.deleteLocation(id);
  }
}
