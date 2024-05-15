import { BaseEntity } from "src/config/base.entity";
import { ICategory } from "src/interfaces/category.interface";
import { NotesCategoriesEntity } from "src/notes/entities/notes_categories.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity implements ICategory {

  @Column()
  name: string;
  @Column()
  description: string;

  @OneToMany(
    () => NotesCategoriesEntity,
    (notesCategories) => notesCategories.category,
  )
  notesIncludes: NotesCategoriesEntity[];
}
