import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  // it('should return 429, when send more than 50 requests per second', async () => {
  //   for (let i = 0; i < 60; i++) {
  //     await appController.handleDataFetching(i);
  //   }
  // }, 40000);
});
