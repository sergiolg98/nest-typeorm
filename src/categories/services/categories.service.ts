import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<CategoryEntity[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneById(id: number): Promise<CategoryEntity> {

    return await this.categoryRepository.createQueryBuilder('categories')
      .where({ id })
      .leftJoinAndSelect('categories.notesIncludes', 'notesIncludes')
      .leftJoinAndSelect('notesIncludes.note', 'note')
      .getOne();

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult | undefined> {

    const updated: UpdateResult = await this.categoryRepository.update(id, updateCategoryDto);
    if (updated.affected === 0)
      return undefined;
    return updated;

  }

  async remove(categoryId: any): Promise<DeleteResult | undefined> {

    const relations: number = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.notesIncludes', 'notesCategory')
      .where('category.id = :id', { id: categoryId })
      .getCount();

    if (relations > 0)
      throw new BadRequestException('Cannot delete Category. There are Notes associated to it.');

    const deleted: DeleteResult = await this.categoryRepository.delete(categoryId);
    if (deleted.affected === 0)
      return undefined;

    return deleted;

  }
}
