import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

}
