import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.userService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in User');
        }

        // Hash the user password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and password together
        const hash = await scrypt(password, salt, 32) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.userService.create(email, result);
        return user;
    }   
    
    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException('User not Found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new ForbiddenException('Wrong Password')
        }
        return user;
    }
}