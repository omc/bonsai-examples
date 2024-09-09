import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';
import { MoviesSearchService } from '../../../../movies/movies-search.service';

@Injectable()
export class MovieSeedService {
  constructor(
    @InjectRepository(MovieEntity)
    private repository: Repository<MovieEntity>,
    private moviesSearchService: MoviesSearchService,
  ) {}

  async run() {
    // If index doesn't exist, create it and seed the database
    const exists = await this.moviesSearchService.existsIndex();
    if (!exists.body) {
      await this.moviesSearchService.createIndex();
      await this.moviesSearchService.statusIndex();
      const insertedMovies = await this.repository.find({});
      await this.moviesSearchService.indexMovies(insertedMovies);
    }
  }
}
