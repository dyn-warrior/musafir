"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let UsersService = class UsersService {
    firebaseService;
    collectionName = 'users';
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async createOrUpdateUser(userData) {
        const { uid, email } = userData;
        if (!uid)
            throw new Error('User UID is required');
        const userRef = this.firebaseService.getFirestore().collection(this.collectionName).doc(uid);
        const snapshot = await userRef.get();
        if (!snapshot.exists) {
            const newUser = {
                uid,
                email: email || '',
                displayName: userData.displayName || '',
                photoURL: userData.photoURL || '',
                createdAt: new Date(),
                lastLoginAt: new Date(),
            };
            await userRef.set(newUser);
            return newUser;
        }
        else {
            await userRef.update({
                lastLoginAt: new Date(),
                ...(userData.displayName && { displayName: userData.displayName }),
                ...(userData.photoURL && { photoURL: userData.photoURL }),
            });
            return snapshot.data();
        }
    }
    async getUser(uid) {
        const doc = await this.firebaseService.getFirestore().collection(this.collectionName).doc(uid).get();
        return doc.exists ? doc.data() : null;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map