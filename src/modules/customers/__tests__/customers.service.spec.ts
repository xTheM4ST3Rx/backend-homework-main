import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Repository } from 'typeorm';

describe('CustomersService', () => {
  let service: CustomersService;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const mockCustomerRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'Cliente 1' }];
      (customerRepository.find as jest.Mock).mockResolvedValue(mockCustomers);

      const result = await service.findAll();
      expect(customerRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockCustomers);
    });

    it('should return empty array if no customers found', async () => {
      (customerRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });
});
