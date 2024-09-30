import { IsNotEmpty, IsString, IsUUID, Length, IsOptional, IsEnum, IsDate } from 'class-validator';

enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    title?: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 255)
    description?: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(TaskStatus)
    status?: string;
}
