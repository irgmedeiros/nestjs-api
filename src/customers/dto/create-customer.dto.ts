import {
  MaxLength,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber
} from 'class-validator'

export class CreateCustomerDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly corporateName: string

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly phone: string

  @IsString()
  @IsNotEmpty()
  readonly address: string

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly createdAt: string

  @IsNumber()
  @MaxLength(40)
  @IsNotEmpty()
  readonly revenue: number

  @IsString()
  @IsOptional()
  readonly bankAccounts: string
}
