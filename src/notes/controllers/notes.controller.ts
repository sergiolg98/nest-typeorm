import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() body: CreateNoteDto) {
    const noteCreated = await this.notesService.create(body);
    return noteCreated;
  }

  @Get()
  async findAll() {
    const notes = await this.notesService.findAll();
    return {
      data: notes
    };
  }

  @Get('/active')
  async findAllActive() {
    const notes = await this.notesService.findAllByFlag(true);
    return {
      data: notes
    };
  }

  @Get('/archived')
  async findAllArchived() {
    const notes = await this.notesService.findAllByFlag(false);
    return {
      data: notes
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.notesService.findOneById(id);
  }

  @Get('/category/:id')
  async findAllByCategory(@Param('id') id) {
    return await this.notesService.findAllByCategory(id);
  }

  @Post('/categories/many/')
  async findByCategories(@Body() body: number[]) {
    const notes = await this.notesService.findByCategories(body);
    return {
      data: notes,
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateNoteDto) {
    return await this.notesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deletedNote = await this.notesService.remove(id);
    return deletedNote;
  }
}
