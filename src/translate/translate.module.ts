import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { translateSchema } from './translate.schema';
import { ProjectModule } from 'src/projects/project.module';
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
