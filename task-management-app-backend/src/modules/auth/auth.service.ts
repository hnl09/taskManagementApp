import { Injectable, BadRequestException } from "@nestjs/common";
import { Firebase } from "../../config/firebase.setup";
import * as FirebaseAuth from 'firebase/auth';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification, 
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";

import { RegisterUserDto } from "./dto/register-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";


@Injectable()
export class AuthService {
    constructor(private readonly admin: Firebase) {}

    async createUser(userRegisterRequest: RegisterUserDto): Promise<any> {
        const { email, password, firstName, lastName, role } = userRegisterRequest;
        const admin = this.admin.admin();

        try {
            const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
                FirebaseAuth.getAuth(),
                email,
                password,
            );

            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });

            await admin.auth().setCustomUserClaims(userCredential.user.uid, { role });

            let idToken = await userCredential.user.getIdToken();
            let displayName = userCredential.user.displayName;

            return { idToken, displayName };
        }catch (error) {
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
          
              return { idToken };
        } catch (error) {
            throw new BadRequestException("Error loggin in", error.message);
        }
    }
}