import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseAuthStrategy } from '../auth/firebase-auth.strategy';

@Controller('tasks')
@UseGuards(AuthGuard('bearer'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.create(splitToken, createTaskDto);
  }

  @Get()
  findAll(@Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.findAll(splitToken);
  }

  @Get(':id')
  findOne(@Headers('authorization') token: string, @Param('id') id: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.findOne(splitToken, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.update(id, splitToken, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.remove(id, splitToken);
  }
}
