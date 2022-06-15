import { Module } from '@nestjs/common'
import { BankAccountController } from './bank-account.controller'
import { BankAccountService } from './bank-account.service'
import { MongooseModule } from '@nestjs/mongoose'
import {
  BankAccountSchema,
  BankAccount
} from './schemas/bank-account.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankAccount.name, schema: BankAccountSchema }
    ])
  ],
  controllers: [BankAccountController],
  providers: [BankAccountService]
})
export class BankAccountModule {}
