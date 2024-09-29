import { Injectable, BadRequestException } from "@nestjs/common";
import { Firebase } from "../../config/firebase.setup";
import * as FirebaseAuth from 'firebase/auth';
import { updateProfile, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
    constructor(private readonly firebase: Firebase) {}

    async createUser(userRegisterRequest: RegisterUserDto): Promise<any> {
        const { email, password, firstName, lastName, role } = userRegisterRequest;
        const admin = this.firebase.admin();

        try {
            const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
                FirebaseAuth.getAuth(),
                email,
                password,
            );

            await FirebaseAuth.sendEmailVerification(userCredential.user);

            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });

            await admin.auth().setCustomUserClaims(userCredential.user.uid, { role });

            let idToken = await userCredential.user.getIdToken();
            let displayName = userCredential.user.displayName;

            return { idToken, displayName };
        } catch (error) {
            throw new BadRequestException("Error creating user: ", error.message);
        }
    }

    async loginUser(userLoginRequest: SigninUserDto): Promise<any> {
        const { email, password } = userLoginRequest;
        try {
            const userCredential = await FirebaseAuth.signInWithEmailAndPassword(
                FirebaseAuth.getAuth(),
                email,
                password,
              );
              let idToken = await userCredential.user.getIdToken();
          
              return { idToken, userCredential };
        } catch (error) {
            throw new BadRequestException("Error loggin in", error.message);
        }
    }

    async resetPassword(resetPasswordRequest: ResetPasswordDto): Promise<any> {
        const { email } = resetPasswordRequest;
        const admin = this.firebase.admin();
        const auth = getAuth();

        try {
            const user = await admin.auth().getUserByEmail(email);

            await sendPasswordResetEmail(auth, user.email);
            return { message: `Password reset email sent successfully to: ${user.email}` };
        } catch (error) {
            throw new BadRequestException("Error reseting password: ", error.message);
        }
    }
}