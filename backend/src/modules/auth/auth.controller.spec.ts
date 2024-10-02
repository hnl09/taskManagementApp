import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto, Permissions } from './dto/register-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            loginUser: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const userRegisterRequest: RegisterUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
        firstName: 'Henrique',
        lastName: 'Lopes',
        role: [Permissions.ADMIN],
      };

      const result = { idToken: 'mockIdToken', displayName: 'Henrique Lopes' };
      jest.spyOn(authService, 'createUser').mockResolvedValue(result);

      expect(await authController.signup(userRegisterRequest)).toBe(result);
      expect(authService.createUser).toHaveBeenCalledWith(userRegisterRequest);
    });
  });

  describe('signin', () => {
    it('should log in a user', async () => {
      const userLoginRequest: SigninUserDto = {
        email: 'henriquenl09@gmail.com',
        password: '12345678',
      };

      const result = { userCredential: { user: { uid: '12345', email: 'henriquenl09@gmail.com' } } };
      jest.spyOn(authService, 'loginUser').mockResolvedValue(result);

      expect(await authController.signin(userLoginRequest)).toBe(result);
      expect(authService.loginUser).toHaveBeenCalledWith(userLoginRequest);
    });
  });

  describe('reset', () => {
    it('should reset the password', async () => {
      const resetPasswordRequest: ResetPasswordDto = {
        email: 'henriquenl09@gmail.com',
      };

      const result = { message: 'Password reset email sent successfully to: henriquenl09@gmail.com' };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(result);

      expect(await authController.reset(resetPasswordRequest)).toBe(result);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordRequest);
    });
  });
});