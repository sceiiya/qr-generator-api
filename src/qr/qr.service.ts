import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { QrCodeDto } from '../dto/qr-code.dto';

@Injectable()
export class QrService {
  async generateQrCode(data: QrCodeDto): Promise<string> {
    try {
      // Convert the DTO to JSON string
      const jsonString = JSON.stringify(data);

      // Generate QR code as data URL (base64 image)
      const qrCodeDataUrl = await QRCode.toDataURL(jsonString, {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      });

      return qrCodeDataUrl;
    } catch (error) {
      throw new Error(
        `Failed to generate QR code: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async generateQrCodeFromUrl(data: QrCodeDto): Promise<string> {
    try {
      // Create a URL with the data as query parameters
      const url = new URL('data:application/json');
      url.searchParams.set('provider', data.provider);
      url.searchParams.set('account_number', data.account_number);
      url.searchParams.set('account_name', data.account_name);

      // Generate QR code from the URL
      const qrCodeDataUrl = await QRCode.toDataURL(url.toString(), {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      });

      return qrCodeDataUrl;
    } catch (error) {
      throw new Error(
        `Failed to generate QR code from URL: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
