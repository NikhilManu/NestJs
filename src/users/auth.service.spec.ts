import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";


describe('Auth Service', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async() => {
        // Create Mock
        const users: User[] = [];

        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },

            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User
                users.push(user);
                return Promise.resolve(user);
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {provide: UsersService, useValue: fakeUsersService}
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with salted and hashed password', async ()=> {
        const user = await service.signup('asd@gmail.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email is in use', async () => {
        await service.signup('asd@asd.com', 'asdf');
        try {
            await service.signup('asd@asd.com', 'asdf');
        } catch  (err) {
            expect(err).toBeDefined();
        } 
    });

    it('throws error signin called with unused email', async () => {
        try {
            await service.signin('random@asdf.com', 'random');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('throws if an invalid password is provided',async () => {
        await service.signup('first@g.com', 'first');
        try {
            await service.signin('first@g.com', 'invalid');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('returs a user if correct password is provided', async () => {   
        await service.signup('rad@rad.com', 'one')
        const user = await service.signin('rad@rad.com', 'one'); 
        expect(user).toBeDefined();

    });
})
