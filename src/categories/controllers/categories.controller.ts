import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() body: CreateCategoryDto) {
    const created = await this.categoriesService.create(body);
    return created;
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.categoriesService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
    return await this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deleted = await this.categoriesService.remove(id);
    return deleted;
  }
}
