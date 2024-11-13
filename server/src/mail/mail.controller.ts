import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public } from '@/decorators/publicEndpoint';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly mailService: MailService,
    ) { }

    @Get('test')
    @Public()
    testMail() {
        this.mailerService.sendMail({
            to: 'haudnta1nhs@gmail.com',
            from: 'noreply@gmail.com',
            subject: 'Testing Nest Mailer',
            text: 'Hello Wolrd',
            html: '<b>Hello World</b>'
        });

        return "Test OK!";
    }
}
