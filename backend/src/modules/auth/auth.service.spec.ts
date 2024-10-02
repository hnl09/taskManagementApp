import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Firebase } from '../../config/firebase.setup';
import { RegisterUserDto, Permissions } from './dto/register-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BadRequestException } from '@nestjs/common';
import * as FirebaseAuth from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  getAuth: jest.fn().mockReturnValue({}),
}));

const mockFirebaseAdmin = {
  auth: jest.fn().mockReturnValue({
    setCustomUserClaims: jest.fn().mockResolvedValue(null),
    getUserByEmail: jest.fn()
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let firebase: Firebase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: Firebase,
          useValue: { admin: () => mockFirebaseAdmin },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    firebase = module.get<Firebase>(Firebase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userRegisterRequest: RegisterUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
        firstName: 'Henrique',
        lastName: 'Lopes',
        role: [Permissions.ADMIN],
      };

      const mockUserCredential = {
        user: {
          uid: '12345',
          email: 'henriquenl09@gmail.com',
          getIdToken: jest.fn().mockResolvedValue('mockIdToken'),
          displayName: 'Henrique Lopes',
        },
      };

      (FirebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (FirebaseAuth.sendEmailVerification as jest.Mock).mockResolvedValue(null);
      (FirebaseAuth.updateProfile as jest.Mock).mockResolvedValue(null);

      const result = await service.createUser(userRegisterRequest);

      expect(result).toEqual({
        idToken: 'mockIdToken',
        displayName: 'Henrique Lopes',
      });
      expect(FirebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        FirebaseAuth.getAuth(),
        userRegisterRequest.email,
        userRegisterRequest.password
      );
      expect(FirebaseAuth.sendEmailVerification).toHaveBeenCalledWith(mockUserCredential.user);
      expect(FirebaseAuth.updateProfile).toHaveBeenCalledWith(mockUserCredential.user, {
        displayName: `${userRegisterRequest.firstName} ${userRegisterRequest.lastName}`,
      });
      expect(mockFirebaseAdmin.auth().setCustomUserClaims).toHaveBeenCalledWith(mockUserCredential.user.uid, {
        role: userRegisterRequest.role,
      });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const userRegisterRequest: RegisterUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
        firstName: 'Henrique',
        lastName: 'Lopes',
        role: [Permissions.ADMIN],
      };

      (FirebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Firebase error'));

      await expect(service.createUser(userRegisterRequest)).rejects.toThrow(BadRequestException);
    });
  });

  describe('loginUser', () => {
    it('should log in a user', async () => {
      const userLoginRequest: SigninUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
      };

      const mockUserCredential = {
        user: {
          uid: '12345',
          email: 'henriquenl09@gmail.com',
        },
      };

      (FirebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await service.loginUser(userLoginRequest);

      expect(result).toEqual({ userCredential: mockUserCredential });
      expect(FirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        FirebaseAuth.getAuth(),
        userLoginRequest.email,
        userLoginRequest.password
      );
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const userLoginRequest: SigninUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
      };

      (FirebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Firebase error'));

      await expect(service.loginUser(userLoginRequest)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password', async () => {
      const resetPasswordRequest: ResetPasswordDto = {
        email: 'henriquenl09@gmail.com',
      };

      const mockUser = {
        email: 'henriquenl09@gmail.com',
      };

      (mockFirebaseAdmin.auth().getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (FirebaseAuth.sendPasswordResetEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.resetPassword(resetPasswordRequest);

      expect(result).toEqual({ message: `Password reset email sent successfully to: ${mockUser.email}` });
      expect(mockFirebaseAdmin.auth().getUserByEmail).toHaveBeenCalledWith(resetPasswordRequest.email);
      expect(FirebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(FirebaseAuth.getAuth(), mockUser.email);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const resetPasswordRequest: ResetPasswordDto = {
        email: 'henriquenl09@gmail.com',
      };

      (mockFirebaseAdmin.auth().getUserByEmail as jest.Mock).mockRejectedValue(new Error('Firebase error'));

      await expect(service.resetPassword(resetPasswordRequest)).rejects.toThrow(BadRequestException);
    });
  });
});