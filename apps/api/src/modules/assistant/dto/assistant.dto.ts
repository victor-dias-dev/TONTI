import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AssistantInsightDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  icon!: string;

  @ApiProperty({ enum: ['income', 'danger', 'primary'] })
  tone!: 'income' | 'danger' | 'primary';

  @ApiProperty()
  text!: string;

  @ApiPropertyOptional({ example: '65000' })
  amountCents?: string;
}

export class AssistantMessageDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['assistant', 'user'] })
  role!: 'assistant' | 'user';

  @ApiProperty()
  text!: string;

  @ApiPropertyOptional({ type: [AssistantInsightDto] })
  insights?: AssistantInsightDto[];
}

export class AssistantConversationDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  subtitle!: string;

  @ApiProperty({ type: [String] })
  suggestions!: string[];

  @ApiProperty({ type: [AssistantMessageDto] })
  messages!: AssistantMessageDto[];
}

export class SendAssistantMessageDto {
  @ApiProperty({ example: 'Como estão minhas finanças?' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text!: string;
}
