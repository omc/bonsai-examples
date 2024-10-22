import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';
import { MoviesSearchService } from '../../../../movies/movies-search.service';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import Groq from 'groq-sdk';

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
      // Fetch movie titles from our relational database
      const insertedMovies = await this.repository.find({});
      // Add Groq Embeddings
      //
      // Note: In a production app, this should probably be done in the background,
      // along with an update of the document in Elasticsearch/OpenSearch.
      const client = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
      const embeddingRequests: Array<Promise<any>> = [];
      const moviesLen = insertedMovies.length;
      const rateLimiter = new RateLimiterMemory({
        points: 6, // 6 points
        duration: 1, // Per second
      });

      for (const movie of insertedMovies) {
        const index: number = insertedMovies.indexOf(movie);
        let shouldRetry = true;
        // There probably is a better rate-limiting library this, which blocks
        // until the required tokens are available. We're making the
        // node-rate-limiter-flexible fit our use case.
        while (shouldRetry) {
          await rateLimiter
            .consume('aiembedding', 3)
            .then(() => {
              shouldRetry = false;
              Logger.log(
                'Groq Embedding: processing ' +
                  movie.title +
                  ' (' +
                  (index + 1).toString() +
                  ' of ' +
                  moviesLen +
                  ')',
              );

              embeddingRequests.push(
                this.generateScriptEmbeddings(client, movie),
              );
            })
            .catch(async (rlres: RateLimiterRes) => {
              // Not enough points, wait for the specified duration
              await new Promise((resolve) =>
                setTimeout(resolve, rlres.msBeforeNext),
              );
            });
        }
      }

      Promise.all(embeddingRequests)
        .then(async () => {
          // Index the movies discovered
          await this.moviesSearchService.indexMovies(insertedMovies);
          Logger.log(
            'Completed indexing of movies (' +
              insertedMovies.length.toString() +
              ' total)',
          );
        })
        .catch((err) => {
          Logger.log('Encountered fatal error during Groq embedding: ', err);
        });
      Logger.log('Search seeding complete!');
    }
  }

  async generateScriptEmbeddings(
    client: Groq,
    movie: MovieEntity,
    numCharsAllowed: number = 15000,
  ) {
    const script_embedding = await client.embeddings.create({
      model: 'llama-3.2-90b-text-preview',
      input: movie.script.slice(0, numCharsAllowed),
      encoding_format: 'float',
    });

    // We're only requesting one embedding; so there should only be one entry!
    if (script_embedding !== undefined && script_embedding.data.length === 1) {
      movie.script_embedding_vector = script_embedding.data[0]
        .embedding as number[];
    }
  }

  async revert() {
    // If index doesn't exist, create it and seed the database
    const exists = await this.moviesSearchService.existsIndex();
    if (exists.body) {
      await this.moviesSearchService.deleteIndex();
    }
  }
}
