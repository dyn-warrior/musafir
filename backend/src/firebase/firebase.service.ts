import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
    onModuleInit() {
        // Check if app is already initialized to avoid errors during hot reload
        if (admin.apps.length === 0) {
            try {
                // Try to load the service account key
                // Note: In production, use environment variables instead of a file
                const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
                console.log('Firebase Admin Initialized successfully');
            } catch (error) {
                console.warn('Failed to initialize Firebase Admin. Make sure serviceAccountKey.json is present in the root directory.');
                console.error(error);
            }
        }
    }

    getAuth() {
        return admin.auth();
    }

    getFirestore() {
        return admin.firestore();
    }
}
