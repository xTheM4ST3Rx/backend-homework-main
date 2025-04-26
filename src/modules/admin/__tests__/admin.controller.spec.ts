import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { AdminService } from '../admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            findProfitByStatus: jest.fn(),
            findBestUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findProfitByStatus', () => {
    it('should call service.findProfitByStatus and return its result', async () => {
      const mockResult = [{ status: 'approved', profit: 1000 }];
      (service.findProfitByStatus as jest.Mock).mockReturnValue(mockResult);

      const result = controller.findProfitByStatus();
      expect(service.findProfitByStatus).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('findBestUsers', () => {
    it('should call service.findBestUsers with start and end dates and return its result', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-06-01');
      const mockResult = [{ userId: 1, success: 10 }];
      (service.findBestUsers as jest.Mock).mockReturnValue(mockResult);

      const result = controller.findBestUsers(start, end);
      expect(service.findBestUsers).toHaveBeenCalledWith(start, end);
      expect(result).toBe(mockResult);
    });
  });
});
