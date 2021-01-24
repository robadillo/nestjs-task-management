import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaslRepository');
  
  public async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;  // Sugar Syntax from ES6 that extracts only the keys of the object that we care for
    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;
    
    try {
      await task.save();
    } catch (error) {
      this.logger.error(`Failed to create task for user <${user.username}>. Data: ${JSON.stringify(createTaskDTO)}`, error.stack);
      throw new InternalServerErrorException();
    }
    

    delete task.user; // we delete the property user from the object that we are going to return because is 
                      // sensitive information and we don't need it in the response. This is NOT deleting it from the database

    return task;
  }

  public async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id})

    if (status) {
      query.andWhere('task.status = :status', { status }); // We use this andWhere instead of only where because we want to add multiple where closures.
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user <${user.username}>, DTO: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
    
  }

}
