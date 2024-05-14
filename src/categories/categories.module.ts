import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { NotesCategoriesEntity } from 'src/notes/entities/notes_categories.entity';



@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, NotesCategoriesEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}





