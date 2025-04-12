// src/submission/dto/update-submission.dto.ts
import { IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsDateString()
  entryTime?: Date;

  @IsOptional()
  @IsDateString()
  exitTime?: Date;

  @IsOptional()
  @IsNumber()
  locationID?: number;
}
