import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Documentation',
    description: 'Welcome page with links to API documentation and endpoints',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message and documentation links',
  })
  getDocumentation(): object {
    return {
      message: 'Welcome to QR Code API',
      description:
        'A NestJS API service for generating QR codes with embedded data',
      version: '1.0.0',
      endpoints: {
        documentation: '/api',
        qrGeneration: {
          json: 'POST /qr/generate',
          url: 'POST /qr/generate-url',
          directImage:
            'GET /qr/generate-qr?type=json&provider=GCASH&account_number=9873297&account_name=gladmad%20wiver',
        },
      },
      example: {
        provider: 'gcash',
        account_number: '761253921',
        account_name: 'mohamad mali',
      },
      swagger: '/api',
    };
  }
}
