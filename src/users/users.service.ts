import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>
    ) {}

    create(email: string, password: string) {
        const user = this.repo.create( {email, password} ); // only creates instance of type user 
        return this.repo.save(user); // saves it to the db
    }

    findOne(id: number) {
        // if we pass null in id, it would return the first data in table
        if (!id) {
            return null;
        }
        return this.repo.findOne({where: {id: id}});
    }

    find(email: string) {
        return this.repo.find({where: {email: email} })
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user){
            throw new NotFoundException('User not Found');
        } 
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not Found');
        }
        return this.repo.remove(user);
    }
}
