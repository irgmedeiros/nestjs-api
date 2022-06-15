import { MaxLength, IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateBankAccountDto {
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  readonly bankName: string

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  readonly account: string

  @IsString()
  @MaxLength(40)
  readonly agency: string

  @IsString()
  @IsOptional()
  readonly customers: string
}
