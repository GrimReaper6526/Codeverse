import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '@codeverse/database';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Updated name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Updated avatar URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ enum: Role, description: 'Updated role of the user' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
