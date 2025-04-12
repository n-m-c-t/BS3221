import { Controller, Post, Body, Get, Param, Patch, Delete} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { UpdateSubmissionDto } from './dto/update.submission.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guards';
import { UseGuards } from '@nestjs/common';


@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() submissionDto: CreateSubmissionDto) {
    return this.submissionService.create(submissionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.submissionService.findAll(); // Use the service to fetch all submissions
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userID')
  async getByUser(@Param('userID') userID: number) {
    return this.submissionService.findByUser(userID); // Use the service to fetch submissions by user
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateSubmissionDto
  ) {
    return this.submissionService.update(id, updateDto); // Use the service to update a submission
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSubmission(@Param('id') id: string): Promise<void> {
    await this.submissionService.deleteSubmission(Number(id));
  }

}
