import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { MovieSeedService } from './movie/movie-seed.service';

const revertSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(MovieSeedService).revert();

  await app.close();
};

void revertSeed();
