import { Test, TestingModule } from '@nestjs/testing'
import { BankAccountService } from './bank-account.service'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IBankAccount } from './interfaces/bank-account.interface'

const mockBankAccount: any = {
  _id: 'anyid',
  bankName: 'name #1',
  agency: 'agency #1',
  account: 'account #1',
  customers: 'customer #1'
}

describe('BankAccountService', () => {
  let service: BankAccountService
  let model: Model<IBankAccount>

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1
  }

  const bankAccountsArray = [
    {
      _id: 'anyid',
      bankName: 'name #1',
      agency: 'agency #1',
      account: 'account #1',
      customers: 'customer #1'
    },
    {
      _id: 'anyid',
      bankName: 'name #2',
      agency: 'agency #2',
      account: 'account #2',
      customers: 'customer #2'
    }
  ]

  const updateBankAccountDto = {
    bankName: 'name update',
    agency: 'agency update',
    account: 'account update',
    customers: 'customer update',
    new: true
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountService,
        {
          provide: getModelToken('BankAccount'),
          useValue: {
            find: jest.fn().mockReturnValue(bankAccountsArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockBankAccount),
            constructor: jest.fn().mockResolvedValue(mockBankAccount),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            offset: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<BankAccountService>(BankAccountService)
    model = module.get<Model<IBankAccount>>(getModelToken('BankAccount'))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll()', () => {
    it('should return all bank accounts', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(bankAccountsArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      } as any)
      const bankAccounts = await service.findAll(paginationQueryDto)
      expect(bankAccounts).toEqual(bankAccountsArray)
    })
  })

  describe('findOne()', () => {
    it('should return one bank account', async () => {
      const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockBankAccount),
        populate: jest.fn().mockReturnThis()
      } as any)
      const response = await service.findOne('anyid')
      expect(findSpy).toHaveBeenCalledWith({ _id: 'anyid' })
      expect(response).toEqual(mockBankAccount)
    })

    it('should throw if find one bank account throws', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn(() => null),
        populate: jest.fn().mockReturnThis()
      } as any)
      await expect(service.findOne('anyid')).rejects.toThrow(
        new NotFoundException('Bank Account #anyid not found')
      )
    })
  })

  describe('create()', () => {
    it('should insert a new bank account', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          bankName: 'name #1',
          agency: 'agency #1',
          account: 'account #1',
          customers: 'customer #1'
        })
      )
      const newBankAccount = await service.create({
        bankName: 'name #1',
        agency: 'agency #1',
        account: 'account #1',
        customers: 'customer #1'
      })
      expect(newBankAccount).toEqual({
        _id: 'a id',
        bankName: 'name #1',
        agency: 'agency #1',
        account: 'account #1',
        customers: 'customer #1'
      })
    })
  })

  describe('update()', () => {
    it('should call BankAccountSchema update with correct values', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce({
        _id: 'anyid',
        updateBankAccountDto,
        new: true
      } as any)

      const updateBankAccount = await service.update(
        'anyid',
        updateBankAccountDto
      )
      expect(updateBankAccount).toEqual({
        _id: 'anyid',
        updateBankAccountDto,
        new: true
      })
    })

    it('should throw if BankAccountSchema throws', async () => {
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockRejectedValueOnce(
          new NotFoundException('Bank Account #anyid not found')
        )
      await expect(
        service.update('anyid', updateBankAccountDto)
      ).rejects.toThrow(new NotFoundException('Bank Account #anyid not found'))
    })
  })

  describe('remove()', () => {
    it('should call BankAccountSchema remove with correct value', async () => {
      const removeSpy = jest.spyOn(model, 'findByIdAndRemove')
      const retVal = await service.remove('any id')
      expect(removeSpy).toBeCalledWith('any id')
      expect(retVal).toBeUndefined()
    })

    it('should throw if BankAccountSchema remove throws', async () => {
      jest
        .spyOn(model, 'findByIdAndRemove')
        .mockRejectedValueOnce(new NotFoundException())
      await expect(service.remove('anyid')).rejects.toThrow(
        new NotFoundException()
      )
    })
  })
})
