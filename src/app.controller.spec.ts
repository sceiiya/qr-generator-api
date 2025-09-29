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

  describe('root', () => {
    it('should return documentation object', () => {
      const result = appController.getDocumentation();
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('endpoints');
      expect(result.message).toBe('Welcome to QR Code API');
    });
  });
});
