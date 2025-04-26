import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from '../customers.controller';
import { CustomersService } from '../customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const mockCustomersService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call customersService.findAll and return its result', () => {
      const mockResult = [{ id: 1, name: 'Cliente 1' }];
      (service.findAll as jest.Mock).mockReturnValue(mockResult);

      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });

    it('should return empty array if service returns empty', () => {
      (service.findAll as jest.Mock).mockReturnValue([]);
      const result = controller.findAll();
      expect(result).toEqual([]);
    });
  });
});
