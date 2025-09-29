import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class QrCodeDto {
  @ApiProperty({
    description: 'Payment provider name',
    example: 'gcash',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: 'Account number',
    example: '761253921',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'mohamad mali',
  })
  @IsString()
  @IsNotEmpty()
  account_name: string;
}
