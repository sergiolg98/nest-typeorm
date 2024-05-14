import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { CategoryToNoteDto } from '../dto/add-category-note.dto';

@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() body: CreateNoteDto) {
    const noteCreated = await this.notesService.create(body);
    return noteCreated;
  }

  @Post('add-category')
  async addCategoryToNote(@Body() body: CategoryToNoteDto) {
    return await this.notesService.addCategoryToNote(body);
  }

  @Get()
  async findAll() {
    return await this.notesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.notesService.findOneById(id);
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
