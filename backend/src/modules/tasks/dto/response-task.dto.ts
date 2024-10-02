import { ApiProperty } from "@nestjs/swagger";

export class ReponseTaskDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };

    @ApiProperty()
    updatedAt?: {
        seconds: number;
        nanoseconds: number;
    };
}