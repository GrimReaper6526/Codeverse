import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { Visibility } from '@codeverse/database';

export class CreateProjectDto {
  @ApiProperty({ example: 'CodeVerse Engine', description: 'Name of the project' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '3D Codebase Visualization Universe Platform',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Visibility, default: Visibility.PRIVATE })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiPropertyOptional({
    example: 'https://github.com/GrimReaper6526/Codeverse',
    description: 'Initial repository URL to link or import',
  })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;
}
