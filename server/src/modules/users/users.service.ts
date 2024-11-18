import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/utils/bcryptPassword.util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { CheckCodeDto } from '@/auth/dto/check-code-auth.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private readonly mailerService: MailerService,
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
                name,
                email,
                password: passwordHashed,
                phone,
                address,
                image
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

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
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

    async handleRegister(registerDto: RegisterAuthDto) {
        const { name, email, password } = registerDto;

        // Check user exist?
        const isUserExist = await this.isEmailExist(email);

        if (!isUserExist) {
            // Hash password
            const passwordHashed = await hashPassword(password);
            const codeIdGenerated = uuidv4();

            const newUser = await this.userModel.create({
                name,
                email,
                password: passwordHashed,
                isActive: false,
                codeId: codeIdGenerated,
                codeExpired: dayjs().add(5, 'minutes'),
                // codeExpired: dayjs().add(5, 'minutes'),
            });

            // Send email
            this.mailerService.sendMail({
                to: newUser.email,
                subject: 'Activate your account at OrderFood',
                from: 'noreply@gmail.com',
                template: "mailer.template.hbs",
                context: {
                    name: newUser?.name ?? newUser.email,
                    activationCode: codeIdGenerated,
                }
            });

            return {
                _id: newUser._id
            };
        }
        else {
            throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác!`);
        }
    }

    async handleActive(checkCodeDto: CheckCodeDto) {
        const user = await this.userModel.findOne({
            _id: checkCodeDto._id,
            codeId: checkCodeDto.code,
        });

        if (!user) throw new BadRequestException("Mã code không hợp lệ!");

        // Check expire
        const isBeforeCheck = dayjs().isBefore(user.codeExpired);

        if (isBeforeCheck) {
            // Valid -> update isActive = true
            await this.userModel.updateOne({ _id: checkCodeDto._id }, { isActive: true });

            return true;
        }
        else {
            throw new BadRequestException("Mã code đã hết hạn!");
        }
    }

    async handleRetryActive(email: string) {
        // Check user
        const user = await this.userModel.findOne({ email });

        if (!user) throw new BadRequestException("Tài khoản không tồn tại!");
        if (user.isActive) throw new BadRequestException("Tài khoản đã được kích hoạt!");

        // Generate new code and update
        const codeIdGenerated = uuidv4();
        await user.updateOne({
            codeId: codeIdGenerated,
            codeExpired: dayjs().add(5, "minutes"),
        });

        // Send email
        this.mailerService.sendMail({
            to: user.email,
            subject: 'Re-activate your account at OrderFood',
            from: 'noreply@gmail.com',
            template: "mailer.template.hbs",
            context: {
                name: user?.name ?? user.email,
                activationCode: codeIdGenerated,
            }
        });

        return {
            _id: user._id,
        }
    }
}
