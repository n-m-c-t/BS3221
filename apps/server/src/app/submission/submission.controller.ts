// src/submission/submission.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create.submission.dto';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() submissionDto: CreateSubmissionDto) {
    return this.submissionService.create(submissionDto);
  }

  @Get()
  async getAll() {
    return this.submissionService.findAll();
  }

  @Get('user/:userID')
  async getByUser(@Param('userID') userID: number) {
    return this.submissionService.findByUser(userID);
  }
}
