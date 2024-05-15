import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNoteDto {

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

}
