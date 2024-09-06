import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { MovieSeedService } from './movie/movie-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(MovieSeedService).run();

  await app.close();
};

void runSeed();
