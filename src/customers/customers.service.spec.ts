import { Test, TestingModule } from '@nestjs/testing'
import { CustomersService } from './customers.service'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { CreateCustomerDto, UpdateCustomerDto } from './dto'
import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { ICustomer } from './interfaces/customer.interface'
import { Model } from 'mongoose'

const mockCustomer: any = {
  corporateName: 'corporateName #1',
  phone: '1234567890 #1',
  address: 'address #1',
  createdAt: '15/06/2022 #1',
  revenue: 1_000_000,
  bankAccounts: 'bank account #1'
}

const customersArray = [
  {
    _id: 'any_id1',
    corporateName: 'corporateName #2',
    phone: '1234567890 #2',
    account: 'address #2',
    createdAt: '15/06/2022 #2',
    revenue: 1_000_000,
    bankAccounts: 'bank account #2'
  },
  {
    _id: 'any_id2',
    corporateName: 'corporateName #2',
    phone: '1234567890 #2',
    account: 'address #2',
    createdAt: '15/06/2022 #2',
    revenue: 1_000_000,
    bankAccounts: 'bank account #2'
  }
]

const createCustomerDto: CreateCustomerDto = {
  corporateName: 'corporateName#1',
  phone: '1234567890',
  address: 'address#1',
  createdAt: '15/06/2022',
  revenue: 1_000_000,
  bankAccounts: 'bank account #1'
}

const updateCustomerDto: UpdateCustomerDto = {
  corporateName: 'corporateName update',
  phone: '1234567890',
  address: 'address update',
  createdAt: '15/06/2022',
  revenue: 1_000_000,
  bankAccounts: 'bank account update'
}

describe('CustomersService', () => {
  let service: CustomersService
  let model: Model<ICustomer>

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken('Customer'),
          useValue: {
            find: jest.fn().mockReturnValue(customersArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockCustomer),
            constructor: jest.fn().mockResolvedValue(mockCustomer),
            create: jest.fn().mockResolvedValue(createCustomerDto),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<CustomersService>(CustomersService)
    model = module.get<Model<ICustomer>>(getModelToken('Customer'))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll()', () => {
    it('should return all customers', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(customersArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      } as any)
      const customers = await service.findAll(paginationQueryDto)
      expect(customers).toEqual(customersArray)
    })
  })

  describe('findOne()', () => {
    it('should return one customer', async () => {
      const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockCustomer),
        populate: jest.fn().mockReturnThis()
      } as any)
      const response = await service.findOne('any_id1')
      expect(findSpy).toHaveBeenCalledWith({ _id: 'any_id1' })
      expect(response).toEqual(mockCustomer)
    })

    it('should throw if find one customer throws', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn(() => null),
        populate: jest.fn().mockReturnThis()
      } as any)
      await expect(service.findOne('any_id')).rejects.toThrow(
        new NotFoundException('Customer #any_id not found')
      )
    })
  })

  describe('create()', () => {
    it('should insert a new customer', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          corporateName: 'corporateName#1',
          phone: '1234567890',
          account: 'address#1',
          createdAt: '15/06/2022',
          revenue: 1_000_000,
          bankAccounts: 'bank account #1'
        })
      )
      const newCustomer = await service.create({
        corporateName: 'corporateName#1',
        phone: '1234567890',
        address: 'address#1',
        createdAt: '15/06/2022',
        revenue: 1_000_000,
        bankAccounts: 'bank account #1'
      })
      expect(newCustomer).toEqual({
        _id: 'a id',
        corporateName: 'corporateName#1',
        phone: '1234567890',
        account: 'address#1',
        createdAt: '15/06/2022',
        revenue: 1_000_000,
        bankAccounts: 'bank account #1'
      })
    })
  })

  describe('update()', () => {
    it('should call CustomerSchema update with correct values', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce({
        _id: 'anyid',
        updateCustomerDto,
        new: true
      } as any)

      const updateCustomer = await service.update('anyid', updateCustomerDto)
      expect(updateCustomer).toEqual({
        _id: 'anyid',
        updateCustomerDto,
        new: true
      })
    })

    it('should throw if CustomerSchema throws', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new NotFoundException('Customer #anyid not found')
        )
      await expect(service.update('anyid', updateCustomerDto)).rejects.toThrow(
        new NotFoundException('Customer #anyid not found')
      )
    })
  })

  describe('remove()', () => {
    it('should call CustomerSchema remove with correct value', async () => {
      const removeSpy = jest.spyOn(model, 'findByIdAndRemove')
      const retVal = await service.remove('any id')
      expect(removeSpy).toBeCalledWith('any id')
      expect(retVal).toBeUndefined()
    })

    it('should throw if CustomerSchema remove throws', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException())
      await expect(service.remove('anyid')).rejects.toThrow(
        new NotFoundException()
      )
    })
  })
})
