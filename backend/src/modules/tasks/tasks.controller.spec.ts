import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReponseTaskDto } from './dto/response-task.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = { title: 'Scarface', description: 'Watch it', status: 'PENDING' };
      const token = 'Bearer firebase-token';
      const result = { id: '4asd56as', ...createTaskDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createTaskDto, token)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const token = 'Bearer firebase-token';
      const result = [{ id: '4sa6da5s6', title: 'Godfather', description: 'Watch it', status: 'DONE' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(token)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const token = 'Bearer firebase-token';
      const id = '4as65d4as56das56';
      const result = { id, title: 'Dunkirk', description: 'Watch it', status: 'DONE' };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id, token)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a task by id', async () => {
      const token = 'Bearer firebase-token';
      const id = '4AS65D4AS56';
      const updateTaskDto: UpdateTaskDto = { title: 'Dunkirk', description: 'Watch it', status: 'DONE' };
      const result = { id, ...updateTaskDto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateTaskDto, token)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a task by id', async () => {
      const token = 'Bearer firebase-token';
      const id = 'as654dsa5656as';

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(id, token)).toBeUndefined();
    });
  });
});