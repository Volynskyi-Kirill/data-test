import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async delay(item: number, ms: number) {
    return new Promise((resolve) => setTimeout(() => resolve(item), ms));
  }

  @Get('/api/:requestIndex')
  async handleDataFetching(@Param('requestIndex') requestIndex: number) {
    const randomDelay = Math.random() * 1000;
    return this.delay(requestIndex, randomDelay);
  }
}
