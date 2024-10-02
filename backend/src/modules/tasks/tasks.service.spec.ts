import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Firebase } from 'src/config/firebase.setup';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getDocs, collection, addDoc, serverTimestamp, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
}));
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnThis(),
  verifyIdToken: jest.fn(),
}));

describe('TasksService', () => {
  let service: TasksService;
  let firebaseService: Firebase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: Firebase,
          useValue: {
            getDb: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    firebaseService = module.get<Firebase>(Firebase);
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const token = 'firebase-token';
      const userId = 'as654d5as64d56sa';
      const createTaskDto: CreateTaskDto = { title: 'Dunkirk', description: 'Do a Revie', status: 'PENDING' };
      const task = {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        createdAt: serverTimestamp(),
      };
      const docId = 'as4d56as4d56as';
      const docData = { ...task };
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (addDoc as jest.Mock).mockResolvedValue({ id: docId });
      (getDoc as jest.Mock).mockResolvedValue({ id: docId, data: () => docData });
  
      const result = await service.create(token, createTaskDto);
  
      expect(result).toEqual({ id: docId, ...docData });
    });
  
    it('should throw an error if task creation fails', async () => {
      const token = 'firebase-token';
      const createTaskDto: CreateTaskDto = { title: 'Scarface', description: 'Do a review', status: 'PENDING' };
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: '65as4d56as456' });
      (addDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
  
      await expect(service.create(token, createTaskDto)).rejects.toThrow(HttpException);
      await expect(service.create(token, createTaskDto)).rejects.toThrow('Failed to create task');
    });
  });

  describe('findAll', () => {
    it('should retrieve all tasks successfully', async () => {
      const token = 'firebase-token';
      const userId = '6sa54d56sa456';
      const tasks = [
        { id: 'asd654as65d4as56', title: 'Dunkirk', description: 'Watch it', status: 'PENDING' },
        { id: '6s5a4d56as456ds', title: 'Dunkirk', description: 'Watch it', status: 'DONE' },
      ];
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDocs as jest.Mock).mockResolvedValue({
        docs: tasks.map(task => ({
          id: task.id,
          data: () => task,
        })),
      });
  
      const result = await service.findAll(token);
  
      expect(result).toEqual(tasks);
    });
  
    it('should throw an error if fails to retrieve tasks', async () => {
      const token = 'firebase-token';
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: 'as654d56sa4d56as' });
      (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));
  
      await expect(service.findAll(token)).rejects.toThrow(HttpException);
      await expect(service.findAll(token)).rejects.toThrow('Failed to retrieve tasks');
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const token = 'test-token';
      const userId = 'sa4d6sad56as45d6sa';
      const task = { id: '4asd564sad56as456', title: 'Dunkirk' };

      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, id: task.id, data: () => task });

      const result = await service.findOne(task.id, token);

      expect(result).toEqual(task);
    });

    it('should throw an error if fails to retrieve task', async () => {
      const token = 'firebase-token';
      const userId = '456as4d65sa6';
      const taskId = 'as64dsa64d5sa6';
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
  
      await expect(service.findOne(taskId, token)).rejects.toThrow(HttpException);
      await expect(service.findOne(taskId, token)).rejects.toThrow('Failed to retrieve task');
    });

    it('should throw an error if task not found', async () => {
      const token = 'firebase-token';
      const userId = 'as654ds56ad56sa';
      const taskId = '65sa4d65sa4d65sa';

      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });

      await expect(service.findOne(taskId, token)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const token = 'firebase-token';
      const userId = '5645656';
      const taskId = '456SFG5D84Fasd';
      const updateTaskDto: UpdateTaskDto = { title: 'Kill Bill' };
      const existingTask = { id: taskId, title: 'Scarface', description: 'Watch Movie', status: 'PENDING' };
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => existingTask });
      (setDoc as jest.Mock).mockResolvedValue({}); // Ensure this resolves successfully
      (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => true, data: () => existingTask });
      (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => true, data: () => ({ ...existingTask, ...updateTaskDto }) });
  
      const result = await service.update(taskId, token, updateTaskDto);
  
      expect(result).toEqual({ id: taskId, ...existingTask, ...updateTaskDto });
    });

    it('should throw an error if task not found', async () => {
      const token = 'firebase-token';
      const userId = '4a5s6das56d56sa';
      const nonExistenttaskId = '546asdas5d465sa';
      const updateTaskDto: UpdateTaskDto = { title: 'New Title' };
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });
  
      await expect(service.update(nonExistenttaskId, token, updateTaskDto)).rejects.toThrow(HttpException);
      await expect(service.update(nonExistenttaskId, token, updateTaskDto)).rejects.toThrow('Task not found');
    });
  
    it('should throw an error if update fails', async () => {
      const token = 'firebase-token';
      const taskId = '4as65d4as56';
      const updateTaskDto: UpdateTaskDto = { title: 'Godfather' };
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: '465sad5as6' });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => ({ title: 'Pushups', description: 'Do some', status: 'PENDING' }) });
      (setDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
  
      await expect(service.update(taskId, token, updateTaskDto)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const token = 'firebase-token';
      const userId = '6as4d56as4d56sa';
      const taskId = '6a5s4d56sa4d56s';

      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => true });
      (deleteDoc as jest.Mock).mockResolvedValue({});

      await expect(service.remove(taskId, token)).rejects.toThrow(HttpException);
    });

    it('should throw an error if task not found', async () => {
      const token = 'firebase-token';
      const userId = '5645656';
      const nonExistenttaskId = '645asdsa4d65as';
  
      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: userId });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });
  
      await expect(service.remove(nonExistenttaskId, token)).rejects.toThrow(HttpException);
      await expect(service.remove(nonExistenttaskId, token)).rejects.toThrow('Task not found');
    });

    it('should throw an error if removal fails', async () => {
      const token = 'firebase-token';
      const taskId = '4asd5s6ad4as56';

      admin.auth().verifyIdToken = jest.fn().mockResolvedValue({ uid: '65sa4d64as56' });
      (getDoc as jest.Mock).mockResolvedValue({ exists: () => true });
      (deleteDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

      await expect(service.remove(taskId, token)).rejects.toThrow(HttpException);
    });
  });
});