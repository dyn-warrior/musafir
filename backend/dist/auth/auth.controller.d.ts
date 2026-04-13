import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(req: any): Promise<{
        message: string;
        user: import("../users/users.service").User;
    }>;
}
