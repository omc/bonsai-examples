import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';

@Injectable()
export class MovieSeedService {
  constructor(
    @InjectRepository(MovieEntity)
    private repository: Repository<MovieEntity>,
  ) {}

  async run() {
    const countMovies = await this.repository.count({});

    if (!countMovies) {
      const rlIface = createInterface({
        input: createReadStream(
          path.join(__dirname, 'movie_titles_metadata.tsv'),
        ),
      });

      /* In a real application, you might consider using a bulk command, like PostgreSQL's
         COPY (https://www.postgresql.org/docs/current/sql-copy.html)
       */
      for await (const data of rlIface) {
        const items = data.split('\t') as [
          string,
          string,
          string,
          string,
          string,
          string,
        ];
        await this.saveTsvRow(this.repository, ...items);
      }
    }
  }

  async revert() {
    await this.repository.clear();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async saveTsvRow(
    repository: Repository<MovieEntity>,
    id: string,
    title: string,
    year: string,
    rating: string,
    numVotes: string,
    categoriesUnprocessed: string,
  ): Promise<void> {
    await repository.save(
      repository.create({
        title: title,
      }),
    );
  }
}
