import { BaseEntity } from "src/config/base.entity";
import { Entity, ManyToOne } from "typeorm";
import { NoteEntity } from "./note.entity";
import { CategoryEntity } from "src/categories/entities/category.entity";

@Entity({name: 'notes_categories'})
export class NotesCategoriesEntity extends BaseEntity {

  @ManyToOne(() => NoteEntity, (note) => note.categoriesIncludes)
  note: NoteEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.notesIncludes)
  category: CategoryEntity;

}