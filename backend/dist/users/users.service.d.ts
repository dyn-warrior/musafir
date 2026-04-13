import { FirebaseService } from '../firebase/firebase.service';
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
    lastLoginAt: Date;
}
export declare class UsersService {
    private readonly firebaseService;
    private collectionName;
    constructor(firebaseService: FirebaseService);
    createOrUpdateUser(userData: Partial<User>): Promise<User>;
    getUser(uid: string): Promise<User | null>;
}
