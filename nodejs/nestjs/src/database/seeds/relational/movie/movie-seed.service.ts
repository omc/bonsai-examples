import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';

import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
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
      const parser = createReadStream(
        path.join(__dirname, 'movie_titles_and_script.csv'),
      ).pipe(parse({ delimiter: ',', from_line: 2 }));

      /* In a real application, you might consider using a bulk command, like PostgreSQL's
         COPY (https://www.postgresql.org/docs/current/sql-copy.html)
       */
      for await (const data of parser) {
        await this.saveCsvRow(
          this.repository,
          ...(data as [string, string, string, string, string, string, string]),
        );
      }
    }
  }

  async revert() {
    await this.repository.clear();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async saveCsvRow(
    repository: Repository<MovieEntity>,
    id: string,
    title: string,
    year: string,
    rating: string,
    numVotes: string,
    categoriesUnprocessed: string,
    script,
  ): Promise<void> {
    await repository.save(
      repository.create({
        title: title,
        script: script,
      }),
    );
  }
}
