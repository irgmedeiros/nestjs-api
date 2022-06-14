import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IBankAccount } from './interfaces/bank-account.interface';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { BankAccount } from './schemas/bank-account.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectModel(BankAccount.name)
    private readonly bankAccountModel: Model<BankAccount>,
  ) {}

  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<BankAccount[]> {
    const { limit, offset } = paginationQuery;
    return await this.bankAccountModel
      .find()
      .skip(offset)
      .limit(limit)
      .populate('customer')
      .exec();
  }

  public async findOne(bankAccountId: string): Promise<BankAccount> {
    const bankAccount = await this.bankAccountModel
      .findById({ _id: bankAccountId })
      .populate('customer')
      .exec();

    if (!bankAccount) {
      throw new NotFoundException(`Bank Account #${bankAccountId} not found`);
    }

    return bankAccount;
  }

  public async create(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<IBankAccount> {
    const bankAccount = await this.bankAccountModel.create(
      createBankAccountDto,
    );
    return bankAccount;
  }

  public async update(
    banAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<IBankAccount> {
    const existingBankAccount = await this.bankAccountModel.findByIdAndUpdate(
      { _id: banAccountId },
      updateBankAccountDto,
      { new: true },
    );

    if (!existingBankAccount) {
      throw new NotFoundException(`Bank Account #${banAccountId} not found`);
    }
    return existingBankAccount;
  }

  public async remove(bankAccountId: string): Promise<any> {
    const bankAccount = await this.bankAccountModel.findByIdAndRemove(
      bankAccountId,
    );
    return bankAccount;
  }
}
