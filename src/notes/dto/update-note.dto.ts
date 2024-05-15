import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

}
