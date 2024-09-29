import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { Firebase } from './config/firebase.setup';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule
  ],
  controllers: [],
  providers: [Firebase],
})
export class AppModule {}
