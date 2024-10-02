import { IsNotEmpty, IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class CreateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    title: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(0, 255)
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(TaskStatus)
    status: string;
}
