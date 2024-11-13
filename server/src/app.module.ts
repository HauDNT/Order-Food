import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { UsersModule } from '@/modules/users/users.module';
import { LikesModule } from '@/modules/likes/likes.module';
import { MenuItemOptionsModule } from '@/modules/menu.item.options/menu.item.options.module';
import { MenuItemsModule } from '@/modules/menu.items/menu.items.module';
import { MenusModule } from '@/modules/menus/menus.module';
import { OrderDetailModule } from '@/modules/order.detail/order.detail.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        LikesModule,
        MenuItemOptionsModule,
        MenuItemsModule,
        MenusModule,
        OrderDetailModule,
        OrdersModule,
        RestaurantsModule,
        ReviewsModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAILDEV_INCOMING_HOST'),
                    port: configService.get<number>('MAILDEV_INCOMING_PORT'),
                    secure: configService.get<boolean>('MAILDEV_INCOMING_IS_SECURE'),
                    // ignoreTLS: true,
                    auth: {
                        user: configService.get<string>('MAILDEV_INCOMING_USER'),
                        pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@localhost>',
                },
                // preview: true,
                // template: {
                //     dir: process.cwd() + '/template/',
                //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                //     options: {
                //         strict: true,
                //     },
                // },
            }),
            inject: [ConfigService],
        }),
        MailModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        }
    ],
})
export class AppModule { }
