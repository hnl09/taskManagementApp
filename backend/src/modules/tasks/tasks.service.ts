import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Firebase } from 'src/config/firebase.setup';
import { getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';


@Injectable()
export class TasksService {

  constructor(private readonly firebaseService: Firebase) {}

  private getCollection(userId: string) {
    return this.firebaseService.getDb().collection(`users/${userId}/tasks`);
  }

  async create(token: string, createTaskDto: CreateTaskDto) {
    const {title, description, status} = createTaskDto
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const task = {
      title,
      description,
      status: status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await this.getCollection(userId).add(task);
    return { id: docRef.id, ...task };
  }

  async findAll(token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const snapshot = await this.getCollection(userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string, token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const doc = await this.getCollection(userId).doc(id).get();
    if (!doc.exists) {
      throw new Error('Task not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(id: string, token: string, updateTaskDto) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    await this.getCollection(userId).doc(id).update(updateTaskDto);
    return { id, ...updateTaskDto };
  }

  async remove(id: string, token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    await this.getCollection(userId).doc(id).delete();
    return { id };
  }
}
