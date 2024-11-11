import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/utils/bcryptPassword.util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) { }

    async isEmailExist(email: string) {
        const userIsExist = await this.userModel.exists({ email });
        return userIsExist ? true : false;
    }

    async create(createUserDto: CreateUserDto) {
        const { name, email, password, phone, address, image } = createUserDto;

        // Check user exist?
        const isUserExist = await this.isEmailExist(email);

        if (!isUserExist) {
            // Hash password
            const passwordHashed = await hashPassword(password);

            const newUser = await this.userModel.create({
                name, email, password: passwordHashed, phone, address, image
            });

            return {
                _id: newUser._id
            };
        }
        else {
            throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác!`);
        }
    }

    async findAll(queryString: string, current: number, pageSize: number) {
        const { filter, sort } = aqp(queryString);

        if (filter.current) delete filter.current;
        if (filter.pageSize) delete filter.pageSize;

        if (!current) current = 1;
        if (!pageSize) pageSize = 10;

        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const offset = (current - 1) * (pageSize);

        const results = await this.userModel
            .find(filter)
            .limit(pageSize)
            .skip(offset)
            .select("-password")
            .sort(sort as any);

        return { results, totalPages };
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async update(updateUserDto: UpdateUserDto) {
        return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
    }

    async remove(_id: string) {
        // Check _id:
        if (mongoose.isValidObjectId(_id)) {
            // Delete item:
            return await this.userModel.deleteOne({ _id });
        }
        else {
            throw new BadRequestException("_id không đúng định dạng");
        }
    }
}
