import { IsNumber, IsPositive, IsInt, Min, IsIn } from 'class-validator';

export class AmortizationDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsInt()
    @Min(1)
    term: number;

    @IsNumber()
    @Min(0)
    interest: number;

    @IsIn(['fija', 'variable'])
    type: 'fija' | 'variable';
}
