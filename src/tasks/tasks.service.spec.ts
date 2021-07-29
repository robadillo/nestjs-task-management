import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';

const mockTaskRepository = () => ({
  getTasks: jest.fn(), // jest's function that will provide us tools for mocking
  findOne: jest.fn()
});

const mockUser = {
  username: 'Ditto',
  id: 1,
  password: 'somePassword',
  tasks: []
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository } // custom provider
      ]
    }).compile(); // Don't forget to compile it :D

    tasksService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('Calls TaskRepository.getTasks and returns the result', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled(); // at the moment of start, it shouldn't be called... yet  // this is rendundant, but it's a good start to understand testing
      // call tasksService.getTasks, which should then call the repository's getTasks
      taskRepository.getTasks.mockResolvedValue('some value');
      const result = await tasksService.getTasks(null, mockUser.id, mockUser.username);
      expect(taskRepository.getTasks).toHaveBeenCalled(); // this is rendundant, but it's a good start to understand testing so i will leave it
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN
      };

      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser.id);
      expect(result).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne and handles an error', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser.id)).rejects.toThrow(NotFoundException); // we use rejects because the response of the tasks service get task by id is a Promise
    });
  });
});