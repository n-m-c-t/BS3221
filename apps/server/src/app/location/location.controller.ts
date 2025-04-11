import { Controller, Get, Param, Post, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { JwtAuthGuard } from '../guards/jwt-auth-guards';
import { UseGuards } from '@nestjs/common';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Get all locations
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllLocations(): Promise<Location[]> {
    return this.locationService.findAllLocations();
  }

  // Get a location by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLocation(@Param('id') id: number): Promise<Location> {
    return this.locationService.findLocationById(id);
  }

  // Create a new location
  @UseGuards(JwtAuthGuard)
  @Post()
  async createLocation(@Body() locationData: Partial<Location>): Promise<Location> {
    return this.locationService.createLocation(locationData);
  }

  // Delete a location by ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteLocation(@Param('id') id: number): Promise<{ message: string }> {
    await this.locationService.deleteLocation(id);
    return { message: `Location ${id} deleted.` };
  }

}
