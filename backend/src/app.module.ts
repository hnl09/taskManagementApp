import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { Firebase } from './config/firebase.setup';
import { PassportModule } from '@nestjs/passport';
import { TasksModule } from './modules/tasks/tasks.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TasksModule
  ],
  controllers: [],
  providers: [Firebase],
})
export class AppModule {}
