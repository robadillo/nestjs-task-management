import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from './tasks.model';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn() // Decorator to indicate typeorm that this is a primary key and the id is automatically generated and incremented
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}