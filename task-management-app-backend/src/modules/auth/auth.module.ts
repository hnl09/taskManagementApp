import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Firebase } from 'src/config/firebase.setup';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy'; 

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, Firebase, FirebaseAuthStrategy]
})
export class AuthModule {}
