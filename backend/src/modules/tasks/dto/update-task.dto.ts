import { IsNotEmpty, IsString, IsUUID, Length, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class UpdateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    title?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(0, 255)
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(TaskStatus)
    status?: string;
}
