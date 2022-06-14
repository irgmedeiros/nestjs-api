import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get()
  public async getAllBankAccounts(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const bankAccounts = await this.bankAccountService.findAll(
      paginationQuery,
    );
    return res.status(HttpStatus.OK).json(bankAccounts);
  }

  @Get('/:id')
  public async getBankAccount(
    @Res() res,
    @Param('id') bankAccountId: string,
  ) {
    if (!bankAccountId) {
      throw new NotFoundException('bank account does not exist!');
    }

    const bankAccount = await this.bankAccountService.findOne(
      bankAccountId,
    );
    return res.status(HttpStatus.OK).json(bankAccount);
  }

  @Post()
  public async addBankAccount(
    @Res() res,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    try {
      const bankAccount = await this.bankAccountService.create(
        createBankAccountDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'bank account has been created successfully',
        bankAccount,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Bank Account not created!',
        status: 400,
      });
    }
  }

  @Put('/:id')
  public async updateBankAccount(
    @Res() res,
    @Param('id') bankAccountId: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    try {
      const bankAccount = await this.bankAccountService.update(
        bankAccountId,
        updateBankAccountDto,
      );
      if (!bankAccount) {
        throw new NotFoundException('bank account does not exist!');
      }
      return res.status(HttpStatus.OK).json({
        message: 'bank account has been successfully updated',
        bankAccount,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Bank Account not updated!',
        status: 400,
      });
    }
  }

  @Delete('/:id')
  public async deleteBankAccount(
    @Res() res,
    @Param('id') bankAccountId: string,
  ) {
    if (!bankAccountId) {
      throw new NotFoundException('bank account ID does not exist');
    }

    const bankAccount = await this.bankAccountService.remove(bankAccountId);

    return res.status(HttpStatus.OK).json({
      message: 'bank account has been deleted',
      bankAccount,
    });
  }
}
