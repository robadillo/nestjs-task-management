import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task-dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService
  ) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Task[] | boolean {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
    return this.tasksService.updateStatus(id, status);
  }


}
