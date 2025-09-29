import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { QrService } from './qr.service';
import { QrCodeDto } from '../dto/qr-code.dto';

@ApiTags('QR Code Generation')
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate QR Code from JSON data',
    description: 'Generates a QR code image containing the provided JSON data',
  })
  @ApiBody({
    type: QrCodeDto,
    description: 'Payment information to encode in QR code',
  })
  @ApiResponse({
    status: 200,
    description: 'QR code generated successfully',
    schema: {
      type: 'object',
      properties: {
        qrCode: {
          type: 'string',
          description: 'Base64 encoded QR code image (data URL)',
          example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        },
        data: {
          type: 'object',
          description: 'Original data that was encoded',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async generateQrCode(@Body() qrCodeDto: QrCodeDto) {
    const qrCode = await this.qrService.generateQrCode(qrCodeDto);
    return {
      qrCode,
      data: qrCodeDto,
    };
  }

  @Post('generate-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate QR Code from URL with embedded data',
    description:
      'Generates a QR code image containing a URL with the data as query parameters',
  })
  @ApiBody({
    type: QrCodeDto,
    description: 'Payment information to encode in QR code URL',
  })
  @ApiResponse({
    status: 200,
    description: 'QR code generated successfully',
    schema: {
      type: 'object',
      properties: {
        qrCode: {
          type: 'string',
          description: 'Base64 encoded QR code image (data URL)',
          example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        },
        url: {
          type: 'string',
          description: 'URL with embedded data',
          example:
            'data:application/json?provider=gcash&account_number=761253921&account_name=mohamad%20mali',
        },
        data: {
          type: 'object',
          description: 'Original data that was encoded',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async generateQrCodeFromUrl(@Body() qrCodeDto: QrCodeDto) {
    const qrCode = await this.qrService.generateQrCodeFromUrl(qrCodeDto);
    const url = new URL('data:application/json');
    url.searchParams.set('provider', qrCodeDto.provider);
    url.searchParams.set('account_number', qrCodeDto.account_number);
    url.searchParams.set('account_name', qrCodeDto.account_name);

    return {
      qrCode,
      url: url.toString(),
      data: qrCodeDto,
    };
  }

  @Get('generate-qr')
  @ApiOperation({
    summary: 'Generate QR Code from URL parameters',
    description:
      'Generates a QR code image directly from URL query parameters and returns the image',
  })
  @ApiQuery({
    name: 'type',
    description: 'Type of QR code generation (json or url)',
    required: true,
    enum: ['json', 'url'],
  })
  @ApiQuery({
    name: 'provider',
    description: 'Payment provider name',
    required: true,
    example: 'GCASH',
  })
  @ApiQuery({
    name: 'account_number',
    description: 'Account number',
    required: true,
    example: '9873297',
  })
  @ApiQuery({
    name: 'account_name',
    description: 'Account holder name',
    required: true,
    example: 'gladmad wiver',
  })
  @ApiResponse({
    status: 200,
    description: 'QR code image generated successfully',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  async generateQrFromUrl(
    @Query('type') type: string,
    @Query('provider') provider: string,
    @Query('account_number') account_number: string,
    @Query('account_name') account_name: string,
    @Res() res: Response,
  ) {
    // Validate required parameters
    if (!type || !provider || !account_number || !account_name) {
      return res.status(400).json({
        error:
          'Missing required parameters: type, provider, account_number, account_name',
      });
    }

    // Validate type parameter
    if (!['json', 'url'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid type parameter. Must be either "json" or "url"',
      });
    }

    try {
      const qrCodeDto: QrCodeDto = {
        provider,
        account_number,
        account_name,
      };

      let qrCodeDataUrl: string;
      if (type === 'json') {
        qrCodeDataUrl = await this.qrService.generateQrCode(qrCodeDto);
      } else {
        qrCodeDataUrl = await this.qrService.generateQrCodeFromUrl(qrCodeDto);
      }

      // Extract base64 data from data URL
      const base64Data = qrCodeDataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      // Set response headers for image
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      });

      // Send the image buffer
      res.send(buffer);
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to generate QR code',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
