import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'a@a.com', password: 'asdf'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'asdf'} as User])
      },
      // remove: () => {},
      // update: () => {}
    };

    fakeAuthService = {
      // signup: () => {},
      // signin: () => {}
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService},
        {provide: AuthService, useValue: fakeAuthService}
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find All users returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('a@a.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toBe('a@a.com');
  });

  it('find User returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if id is not found', async () => {
    fakeUsersService.findOne = () => null
    try {
      await controller.findUser('1');
    }
    catch (err) {
      expect(err).toBeDefined();
    }
  });
});
