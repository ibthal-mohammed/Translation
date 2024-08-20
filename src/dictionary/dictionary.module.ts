import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionarySchema } from './dictionary.schema';
import { ProjectModule } from 'src/project/project.module';
import { JwtModule } from '@nestjs/jwt';
import { LanguageService } from 'src/language/language.service';
import { LanguageModule } from 'src/language/language.module';

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
