// src/submission/dto/create-submission.dto.ts
import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateSubmissionDto {
  @IsDateString()
  @IsNotEmpty()
  entryTime: Date;

  @IsDateString()
  @IsNotEmpty()
  exitTime: Date;

  @IsNumber()
  @IsNotEmpty()
  userID: number;

  @IsNumber()
  @IsNotEmpty()
  locationID: number;
}
