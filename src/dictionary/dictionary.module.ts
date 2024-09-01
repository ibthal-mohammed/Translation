import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionarySchema } from './dictionary.schema';
import { JwtModule } from '@nestjs/jwt';
import { ProjectModule } from './../project/project.module';
import { LanguageModule } from './../language/language.module';

@Module({
  imports: [
MongooseModule.forFeature([
      { name: 'dictionary', schema: DictionarySchema },
    ]),
    ProjectModule,
    JwtModule,
    LanguageModule,
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
