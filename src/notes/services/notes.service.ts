import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '../entities/note.entity';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { NotesCategoriesEntity } from '../entities/notes_categories.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Injectable()
export class NotesService {

  constructor(
    @InjectRepository(NoteEntity)
    private readonly notesRepository: Repository<NoteEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(NotesCategoriesEntity)
    private readonly notesCategoriesRepository: Repository<NotesCategoriesEntity>,
  ) { }

  async create(createNoteDto: CreateNoteDto): Promise<NoteEntity> {
    try {
      const { content, categoryIds } = createNoteDto;

      const note: NoteEntity = new NoteEntity();
      note.content = content;
      note.active = true;

      const noteCreated = await this.notesRepository.save(note);
      await this.createRelationsForNote(noteCreated.id!, categoryIds);

      return noteCreated;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<NoteEntity[]> {
    try {
      return await this.notesRepository.find({
        relations: ['categoriesIncludes', 'categoriesIncludes.category'],
      });

    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByActive(flag: boolean = true): Promise<NoteEntity[]> {
    try {
      return await this.notesRepository.find({
        where: { active: flag },
        relations: ['categoriesIncludes', 'categoriesIncludes.category'],
      });

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

  async findAllByCategory(categoryId: number): Promise<NoteEntity[]> {
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
      const note: NoteEntity = await this.notesRepository.findOne({
        where: { id },
      });
      if (!note)
        throw new BadRequestException(`Note with id ${id} not found.`);

      const { content, active } = updateNoteDto;
      note.id = id;
      note.content = content;
      note.active = active;

      const noteUpdated: UpdateResult = await this.notesRepository.update(id, note);
      if (noteUpdated.affected === 0)
        return undefined;

      //Update relations
      await this.updateRelations(id, updateNoteDto);

      return noteUpdated;
    } catch (error) {
      throw new (error);
    }
  }

  async remove(noteId: number): Promise<DeleteResult | undefined> {
    try {
      // delete relations
      await this.removeRelations(noteId);

      // delete note
      const noteDeleted: DeleteResult = await this.notesRepository.delete(noteId);
      if (noteDeleted.affected === 0)
        return undefined;
      return noteDeleted;
    } catch (error) {
      throw new Error(error);
    }
  }

  // PRIVATE FUNCTIONS FOR RELATIONS
  private async createRelationsForNote(
    noteId: number,
    categoryIds: number[]
  ) {
    if (categoryIds.length > 0) {
      categoryIds.forEach(async (categoryId) => {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        const body: any = {
          category: category.id,
          note: noteId,
        }
        await this.notesCategoriesRepository.save(body);
      });
    }
  }

  private async updateRelations(
    noteId: number,
    updateNoteDto: UpdateNoteDto
  ): Promise<void> {
    try {
      // Get the note 
      const { categoryIds } = updateNoteDto;
      // Get rid of all relations
      const deleted: DeleteResult = await this.removeRelations(noteId);
      // Create again relations based on categoryIds array
      await this.createRelationsForNote(noteId, categoryIds);

    } catch (error) {
      throw new Error(error);
    }
  }

  private async removeRelations(
    noteId: number,
  ): Promise<DeleteResult | undefined> {
    try {
      const relationDeleted: DeleteResult = await this.notesCategoriesRepository
        .createQueryBuilder('notes_categories')
        .delete()
        .where('note.id = :noteId', { noteId })
        .execute();
      return relationDeleted;

    } catch (error) {
      throw new Error(error);
    }
  }
}
