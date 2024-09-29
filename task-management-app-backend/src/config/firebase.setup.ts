import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { readFile } from "fs/promises";
import * as admin from "firebase-admin";
import * as path from "path";

let clientApp: FirebaseApp = null;
let adminApp: admin.app.App = null;

@Injectable()
export class Firebase implements OnApplicationBootstrap {
    async onApplicationBootstrap() {

        if (!adminApp) {
            const configPath = path.resolve(process.cwd(), "firebaseServiceAccountKey.json");
            const firebaseServiceAccountFile = await readFile(configPath, "utf8");
            const serviceAccount = JSON.parse(firebaseServiceAccountFile);
            adminApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }

        if (!clientApp) {
            const clientConfig = {
                apiKey: process.env.API_KEY,
                authDomain: process.env.AUTH_DOMAIN,
                projectId: process.env.PROJECT_ID,
                storageBucket: process.env.STORAGE_BUCKET,
                messagingSenderId: process.env.MESSAGING_SENDER_ID,
                appId: process.env.APP_ID
            };
            clientApp = initializeApp(clientConfig);
        }
    }

    client() {
        return clientApp;
    }

    clientAuth() {
        return getAuth(clientApp);
    }

    admin() {
        return adminApp;
    }
}