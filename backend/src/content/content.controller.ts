import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':model')
  async findAll(@Param('model') model: string) {
    return this.contentService.findAll(model);
  }

  @Get(':model/:id')
  async findOne(@Param('model') model: string, @Param('id') id: string) {
    return this.contentService.findOne(model, id);
  }

  @Post(':model')
  @UseGuards(JwtAuthGuard)
  async create(@Param('model') model: string, @Body() data: any) {
    return this.contentService.create(model, data);
  }

  @Put(':model/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('model') model: string, @Param('id') id: string, @Body() data: any) {
    return this.contentService.update(model, id, data);
  }

  @Delete(':model/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('model') model: string, @Param('id') id: string) {
    return this.contentService.remove(model, id);
  }
}
