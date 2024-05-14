import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    try {
      return await this.categoryRepository.save(createCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<CategoryEntity[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneById(id: number): Promise<CategoryEntity> {
    try {
      return await this.categoryRepository.createQueryBuilder('categories')
        .where({id})
        .leftJoinAndSelect('categories.notesIncludes', 'notesIncludes')
        .leftJoinAndSelect('notesIncludes.note', 'note')
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult | undefined> {
    try {
      const updated: UpdateResult = await this.categoryRepository.update(id, updateCategoryDto);
      if(updated.affected === 0)
        return undefined;
      return updated;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number):  Promise<DeleteResult | undefined> {
    try {
      const deleted: DeleteResult = await this.categoryRepository.delete(id);
      if(deleted.affected === 0)
        return undefined;
      return deleted;
    } catch (error) {
      throw new Error(error);
    }
  }
}
