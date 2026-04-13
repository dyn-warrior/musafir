import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
    lastLoginAt: Date;
}

@Injectable()
export class UsersService {
    private collectionName = 'users';

    constructor(private readonly firebaseService: FirebaseService) { }

    async createOrUpdateUser(userData: Partial<User>) {
        const { uid, email } = userData;
        if (!uid) throw new Error('User UID is required');

        const userRef = this.firebaseService.getFirestore().collection(this.collectionName).doc(uid);
        const snapshot = await userRef.get();

        if (!snapshot.exists) {
            // Create new user
            const newUser: User = {
                uid,
                email: email || '',
                displayName: userData.displayName || '',
                photoURL: userData.photoURL || '',
                createdAt: new Date(),
                lastLoginAt: new Date(),
            };
            await userRef.set(newUser);
            return newUser;
        } else {
            // Update existing user
            await userRef.update({
                lastLoginAt: new Date(),
                ...(userData.displayName && { displayName: userData.displayName }),
                ...(userData.photoURL && { photoURL: userData.photoURL }),
            });
            return snapshot.data() as User;
        }
    }

    async getUser(uid: string): Promise<User | null> {
        const doc = await this.firebaseService.getFirestore().collection(this.collectionName).doc(uid).get();
        return doc.exists ? (doc.data() as User) : null;
    }
}
