import { Module } from '@nestjs/common';
import { TranslateService } from './dictionary.service';
import { TranslateController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { translateSchema } from './dictionary.schema';
import { ProjectModule } from 'src/project/project.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'translate', schema: translateSchema }]),
    ProjectModule,
    JwtModule,
  ],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
