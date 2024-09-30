import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Firebase } from 'src/config/firebase.setup';

@Module({
  controllers: [TasksController],
  providers: [TasksService, Firebase],
})
export class TasksModule {}
