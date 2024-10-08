import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryMovieDto } from './dto/query-movie.dto';
import { Movie } from './domain/movie';
import { MoviesService } from './movies.service';
import { infinityPagination } from '../utils/infinity-pagination';
import { SearchResponseDto } from '../utils/dto/search-response.dto';

@ApiTags('Movies')
@Controller({
  path: 'movies',
  version: '1',
})
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiCreatedResponse({
    type: Movie,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Movie),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('search') search: string,
    @Query() query: QueryMovieDto,
  ): Promise<InfinityPaginationResponseDto<Movie> | SearchResponseDto<Movie>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    if (search) {
      return await this.moviesService.search(
        search,
        query?.offset,
        query?.limit,
        query?.startId,
      );
    }
    return infinityPagination(
      await this.moviesService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Movie,
  })
  @Get(':title')
  @ApiParam({
    name: 'title',
    type: String,
    required: true,
  })
  async findOne(
    @Param('title') title: Movie['title'],
  ): Promise<NullableType<Movie>> {
    const movie = await this.moviesService.findByTitle(title);
    if (!movie) throw new NotFoundException('movie not found');
    return movie;
  }

  @ApiOkResponse({
    type: Movie,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Movie['id'],
    @Body() updateProfileDto: UpdateMovieDto,
  ): Promise<Movie | null> {
    return this.moviesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Movie['id']): Promise<void> {
    return this.moviesService.remove(id);
  }
}
