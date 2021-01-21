import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  
  public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;  // Sugar Syntax from ES6 that extracts only the keys of the object that we care for
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();

    return task;
  }

  public async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status }); // We use this andWhere instead of only where because we want to add multiple where closures.
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    const tasks = await query.getMany();

    return tasks;
  }

}
