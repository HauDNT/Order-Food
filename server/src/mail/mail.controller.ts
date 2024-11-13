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
}
