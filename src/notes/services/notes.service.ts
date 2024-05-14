import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '../entities/note.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { NotesCategoriesEntity } from '../entities/notes_categories.entity';

@Injectable()
export class NotesService {

  constructor(
    @InjectRepository(NoteEntity)
    private readonly notesRepository: Repository<NoteEntity>,

    @InjectRepository(NotesCategoriesEntity)
    private readonly notesCategoriesRepository: Repository<NotesCategoriesEntity>,
  ) { }

  async create(createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    try {
      return await this.notesRepository.save(createNoteDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async addCategoryToNote(body: any) {
    try {
      const {category, note} = body;
      const exists = await this.notesCategoriesRepository.findOne({
        where: {
          category: { id: category },
          note: { id: note },
        }
      });
      if(exists)
        throw new BadRequestException('La relación ya existe previamente.');

      return await this.notesCategoriesRepository.save(body);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<NoteEntity[]> {
    try {
      return await this.notesRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneById(id: number): Promise<NoteEntity> {
    try {
      return await this.notesRepository.createQueryBuilder('notes')
        .where({ id })
        .leftJoinAndSelect('notes.categoriesIncludes', 'categoriesIncludes')
        .leftJoinAndSelect('categoriesIncludes.category', 'category')
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByCategory(categoryId: number): Promise<NoteEntity[]> {
    try {
      const notes = await this.notesRepository
        .createQueryBuilder('note')
        .innerJoin('note.categoriesIncludes', 'notesCategories')
        .innerJoin('notesCategories.category', 'category')
        .where('category.id = :categoryId', { categoryId })
        .getMany();
      return notes;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<UpdateResult | undefined> {
    try {
      const noteUpdated: UpdateResult = await this.notesRepository.update(id, updateNoteDto);
      if (noteUpdated.affected === 0)
        return undefined;
      return noteUpdated;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<DeleteResult | undefined> {
    try {
      const noteDeleted: DeleteResult = await this.notesRepository.delete(id);
      if (noteDeleted.affected === 0)
        return undefined;
      return noteDeleted;
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeNoteCategory(noteId: number, categoryId: number): Promise<DeleteResult | undefined> {
    try {
      const relationDeleted: DeleteResult = await this.notesCategoriesRepository
        .createQueryBuilder('notes_categories')
        .delete()
        .where('note.id = :noteId', { noteId })
        .andWhere('category.id = :categoryId', { categoryId })
        .execute();
      return relationDeleted;

    } catch (error) {
      throw new Error(error);
    }
  }
}
