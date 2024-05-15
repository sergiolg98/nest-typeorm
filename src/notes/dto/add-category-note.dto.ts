import { IsNotEmpty, IsNumber } from "class-validator";
import { CategoryEntity } from "src/categories/entities/category.entity";
import { NoteEntity } from "../entities/note.entity";

export class CategoryToNoteDto {

  @IsNotEmpty()
  @IsNumber()
  category: CategoryEntity;

  @IsNotEmpty()
  @IsNumber()
  note: NoteEntity;

}
