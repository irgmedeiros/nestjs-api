import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateBankAccountDto } from './dto';
import { UpdateBankAccountDto } from './dto';
import { NotFoundException } from '@nestjs/common';

class MockResponse {
  res: any;
  constructor() {
    this.res = {};
  }
  status = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((code) => {
      this.res.code = code;
      return this;
    });
  send = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((message) => {
      this.res.message = message;
      return this;
    });
  json = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((json) => {
      this.res.json = json;
      return this;
    });
}

const createBankAccountDto: CreateBankAccountDto = {
  bankName: 'name #1',
  agency: 'agency #1',
  account: 'account #1',
  customers: 'customer #1',
};

const updateBankAccountDto: UpdateBankAccountDto = {
  bankName: 'name update',
  agency: 'agency update',
  account: 'account update',
  customers: 'customer update',
};

describe('Bank Accounts Controller', () => {
  let bankAccountsController: BankAccountController;
  let bankAccountsService: BankAccountService;
  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountController],
      providers: [
        {
          provide: BankAccountService,
          useValue: {
            create: jest.fn(() => []),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => {}),
            update: jest.fn(() => {}),
            remove: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    bankAccountsController = module.get<BankAccountController>(
      BankAccountController,
    );
    bankAccountsService =
      module.get<BankAccountService>(BankAccountService);
  });

  it('should be defined', () => {
    expect(bankAccountsController).toBeDefined();
  });

  describe('getAllBankAccounts()', () => {
    it('should call method findAll in BankAccountsService', async () => {
      await bankAccountsController.getAllBankAccounts(
        response,
        paginationQueryDto,
      );
      expect(bankAccountsService.findAll).toHaveBeenCalled();
    });

    it('should throw if BankAccountsService findAll throws', async () => {
      jest
        .spyOn(bankAccountsService, 'findAll')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        bankAccountsController.getAllBankAccounts(
          response,
          paginationQueryDto,
        ),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return bank account on success', async () => {
      await bankAccountsController.getAllBankAccounts(
        response,
        paginationQueryDto,
      );
      expect(bankAccountsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getBankAccount()', () => {
    it('should call method findOne in BankAccountsService id with correct value', async () => {
      await bankAccountsController.getBankAccount(response, 'anyid');
      expect(bankAccountsService.findOne).toHaveBeenCalled();
    });

    it('should throw if BankAccountsService findOne throws', async () => {
      jest
        .spyOn(bankAccountsService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        bankAccountsController.getBankAccount(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return a bank account on success', async () => {
      await bankAccountsController.getBankAccount(response, 'anyid');
      expect(bankAccountsService.findOne).toHaveBeenCalled();
    });
  });

  describe('addBankAccount()', () => {
    it('should call method create in BankAccountsService with correct values', async () => {
      const createSpy = jest.spyOn(bankAccountsService, 'create');
      await bankAccountsController.addBankAccount(
        response,
        createBankAccountDto,
      );
      expect(createSpy).toHaveBeenCalledWith(createBankAccountDto);
    });

    it('should return a bank account on success', async () => {
      const createBankAcountSpy = jest.spyOn(bankAccountsService, 'create');
      await bankAccountsController.addBankAccount(
        response,
        createBankAccountDto,
      );
      expect(createBankAcountSpy).toHaveBeenCalledWith(createBankAccountDto);
    });
  });

  describe('updateBankAccount()', () => {
    it('should call method update in BankAccountsService with correct values', async () => {
      const updateSpy = jest.spyOn(bankAccountsService, 'update');
      await bankAccountsController.updateBankAccount(
        response,
        'anyid',
        updateBankAccountDto,
      );
      expect(updateSpy).toHaveBeenCalledWith('anyid', updateBankAccountDto);
    });
  });

  describe('deleteBankAccount()', () => {
    it('should call method remove in BankAccountsService with correct value', async () => {
      const deleteSpy = jest.spyOn(bankAccountsService, 'remove');
      await bankAccountsController.deleteBankAccount(response, 'anyid');
      expect(deleteSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw error if id in BankAccountsService not exists', async () => {
      jest
        .spyOn(bankAccountsService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        bankAccountsController.deleteBankAccount(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });
  });
});
