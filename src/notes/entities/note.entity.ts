import { BaseEntity } from "src/config/base.entity";
import { Column, Entity,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";
import { INote } from 'src/interfaces/note.interface';
import { NotesCategoriesEntity } from "./notes_categories.entity";

@Entity({name: 'notes'})
export class NoteEntity extends BaseEntity implements INote{

  @Column()
  //@todo cambiar campo de varchar a TEXT para que jale mas espacio
  content: string;
  @Column({ default: true })
  active: boolean;

  @OneToMany(() => NotesCategoriesEntity, (notesCategories) => notesCategories.note)
  categoriesIncludes: NotesCategoriesEntity[];


}
