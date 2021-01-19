import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task-dto';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  public createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO; // Sugar Syntax from ES6 that extracts only the keys of the object that we care for

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN
    }

    this.tasks.push(task);
    
    return task;
  }

  public deleteTaskById(id: string): Task[] | boolean{
    if (this.tasks.find(task => task.id === id)) {
      this.tasks = this.tasks.filter(el => el.id !== id);
      return this.tasks;
    }

    return false;
  }

  public updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }
}
