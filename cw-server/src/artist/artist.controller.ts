import {
  Body,
  Query,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/user/schemas/user.schema';
import { Role } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('/artists')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  // @Role(Roles.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  create(@UploadedFile() file, @Body() dto: CreateArtistDto) {
    return this.artistService.create(dto, file);
  }

  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Get('/search')
  search(@Query('query') query: string) {
    console.log(query);
    return this.artistService.search(query);
  }

  @Get('/get/:id')
  getArtistWithAlbumsAndTracks(@Param('id') id: ObjectId) {
    return this.artistService.getArtistWithAlbumsAndTracks(id);
  }

  @Get(':id')
  getById(@Param('id') id: ObjectId) {
    return this.artistService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.artistService.deleteById(id);
  }
}
