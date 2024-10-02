import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Firebase } from 'src/config/firebase.setup';
import { getDocs, collection, addDoc, serverTimestamp, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import * as admin from 'firebase-admin';

@Injectable()
export class TasksService {

  constructor(private readonly firebaseService: Firebase) {}

  private getCollectionReference(userId: string) {
    const db = this.firebaseService.getDb();
    const colRef = collection(db, `users/${userId}/tasks`);
    return colRef;
  }

  async create(token: string, createTaskDto: CreateTaskDto) {
    try {
      const { title, description, status } = createTaskDto;
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      const task = {
        title,
        description,
        status: status,
        createdAt: serverTimestamp(),
      };

      const colRef = this.getCollectionReference(userId);
      const docRef = await addDoc(colRef, task);
      const getCreatedDoc = await getDoc(docRef);
      const docData = getCreatedDoc.data();
      const docId = getCreatedDoc.id;

      return { id: docId, ...docData };
    } catch (error) {
      throw new HttpException('Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      const colRef = await this.getCollectionReference(userId);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new HttpException('Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;
  
      const colRef = await this.getCollectionReference(userId);
      const docRef = doc(colRef, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
  
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to retrieve task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, token: string, updateTaskDto: UpdateTaskDto) {
    try {
      const { title, description, status } = updateTaskDto;
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      const colRef = await this.getCollectionReference(userId);
      const docRef = doc(colRef, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      const updatedTask = {
        title: title ? title : docSnap.data().title,
        description: description ? description : docSnap.data().description,
        status: status ? status : docSnap.data().status,
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, updatedTask, { merge: true });
      const getUpdatedDoc = await getDoc(docRef);
      const docData = getUpdatedDoc.data();

      return { id: id, ...docData };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;
  
      const colRef = await this.getCollectionReference(userId);
      const docRef = doc(colRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      
      await deleteDoc(docRef);
  
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}