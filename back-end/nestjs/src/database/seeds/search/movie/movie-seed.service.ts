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
    // Select all movies along with their IDs
    const insertedMovies = await this.repository.find({});

    /*
      In a real application, you might consider using a bulk command.
      We'll cover that in another post!
     */
    for (const movie of insertedMovies) {
      await this.moviesSearchService.indexMovie(movie);
    }
  }
}
