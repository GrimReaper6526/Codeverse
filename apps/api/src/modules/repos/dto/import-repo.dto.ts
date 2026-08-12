import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { GitProvider } from '@codeverse/database';

export class ImportRepoDto {
  @ApiProperty({ example: 'proj-123', description: 'ID of project to link repository to' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({
    example: 'https://github.com/GrimReaper6526/Codeverse.git',
    description: 'Git repository URL to import',
  })
  @IsNotEmpty()
  @IsUrl()
  gitUrl: string;

  @ApiPropertyOptional({ example: 'main', default: 'main', description: 'Branch to track' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ enum: GitProvider, default: GitProvider.GITHUB })
  @IsOptional()
  @IsEnum(GitProvider)
  gitProvider?: GitProvider;
}
