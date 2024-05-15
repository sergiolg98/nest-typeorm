import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { NotesCategoriesEntity } from './entities/notes_categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, CategoryEntity, NotesCategoriesEntity])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
