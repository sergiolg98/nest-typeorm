import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt'
  })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'updatedAt'
  })
  updatedAt: Date;
}