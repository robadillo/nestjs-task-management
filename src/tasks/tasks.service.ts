import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './tasks.model'; -- remove comment if you want to use the non database version of the app
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
// import { TaskStatus } from './tasks.model';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }

  public async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Task with <<${id}>> not found`);
    }

    return foundTask;
  }

  public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    // NOTE: This code commented is the implementation of the method using the ENTITY directly here
    // const { title, description } = createTaskDTO;
    // const task = new Task();
    // task.title = title;
    // task.description = description;
    // task.status = TaskStatus.OPEN;

    // await task.save();
    // return task;

    return this.taskRepository.createTask(createTaskDTO);
  }

  public async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id); //Here is not necessary to call logic in the repository because we can call the delete right here

    if (result.affected === 0) {
      throw new NotFoundException(`Task with <<${id}>> not found`);
    }

    return;
  }

  public async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const taskFound = await this.getTaskById(id);
    taskFound.status = status;
    await taskFound.save();

    return taskFound;
  }

  public async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDTO);
  }

  /* NOTE: REMOVE THE COMMENT IN THIS SECTION IN ORDER TO RUN THE APPLICATION WITHOUT DATABASE AND ENTITIES NOR TYPEORM
  private tasks: Array<Task> = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(el => el.status === status);
    }

    if (search) {
      tasks = tasks.filter(el => el.title.includes(search) || el.description.includes(search))
    }

    return tasks;
  }

  public getTaskById(id: string): Task {
    const taskFound = this.tasks.find(task => task.id === id);

    if (!taskFound) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return taskFound;
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

  public deleteTaskById(id: string): void{
    const taskFound = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== taskFound.id);
  }

  public updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }
*/
}
