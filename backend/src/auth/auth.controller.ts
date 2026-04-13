import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) { }

    @Post('login')
    @UseGuards(FirebaseAuthGuard)
    async login(@Req() req) {
        // The user object is attached by the FirebaseAuthGuard
        const firebaseUser = req.user;

        // Sync user to Firestore
        const user = await this.usersService.createOrUpdateUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.name,
            photoURL: firebaseUser.picture,
        });

        return {
            message: 'Login successful',
            user,
        };
    }
}
