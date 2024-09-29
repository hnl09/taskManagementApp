import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { readFile } from "fs/promises";
import * as admin from "firebase-admin";
import * as path from "path";

let app: admin.app.App = null;

@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
    async onApplicationBootstrap() {
        if (!app) {
            const configPath = path.resolve(process.cwd(), "firebaseServiceAccountKey.json");
            const firebaseServiceAccountFile = await readFile(configPath, "utf8");
            const serviceAccount = JSON.parse(firebaseServiceAccountFile);
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
    }

    setup() {
        return app;
    }
}