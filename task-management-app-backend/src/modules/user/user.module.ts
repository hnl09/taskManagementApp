import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Firebase } from 'src/config/firebase.setup';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy'; 

@Module({
  imports: [PassportModule],
  controllers: [UserController],
  providers: [UserService, Firebase, FirebaseAuthStrategy]
})
export class UserModule {}
