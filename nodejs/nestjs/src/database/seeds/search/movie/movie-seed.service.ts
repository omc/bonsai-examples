import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';
import { MoviesSearchService } from '../../../../movies/movies-search.service';
import OpenAI from 'openai';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

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
      // Add OpenAI Embeddings
      //
      // Note: In a production app, this should probably be done in the background,
      // along with an update of the document in Elasticsearch/OpenSearch.
      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
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
            .consume('openAIEmbedding', 3)
            .then(() => {
              shouldRetry = false;
              Logger.log(
                'OpenAI Embedding: processing ' +
                  movie.title +
                  ' (' +
                  (index + 1).toString() +
                  ' of ' +
                  moviesLen +
                  ')',
              );

              embeddingRequests.push(
                this.generateScriptEmbeddings(openaiClient, movie),
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
          const res =
            await this.moviesSearchService.indexMovies(insertedMovies);
        })
        .catch((err) => {
          Logger.log('Encountered fatal error during OpenAI embedding: ', err);
        });
    }
  }

  async generateScriptEmbeddings(
    openaiClient: OpenAI,
    movie: MovieEntity,
    numCharsAllowed: number = 15000,
  ) {
    const script_embedding = await openaiClient.embeddings.create({
      model: 'text-embedding-ada-002',
      input: movie.script.slice(0, numCharsAllowed),
      encoding_format: 'float',
    });

    // We're only requesting one embedding; so there should only be one entry!
    if (script_embedding !== undefined && script_embedding.data.length === 1) {
      movie.script_embedding_vector = script_embedding.data[0].embedding;
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
