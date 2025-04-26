import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsController } from '../proposals.controller';
import { ProposalsService } from '../proposals.service';

describe('ProposalsController', () => {
  let controller: ProposalsController;
  let service: ProposalsService;

  const mockUser = { id: 1 } as any;

  const mockProposalsService = {
    findAll: jest.fn(),
    findAllRefused: jest.fn(),
    aproveProposal: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalsController],
      providers: [
        { provide: ProposalsService, useValue: mockProposalsService },
      ],
    }).compile();

    controller = module.get<ProposalsController>(ProposalsController);
    service = module.get<ProposalsService>(ProposalsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with user id', async () => {
      const result = [{ id: 1 }];
      mockProposalsService.findAll.mockResolvedValue(result);
      const req = { user: mockUser };
      await expect(controller.findAll(req)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findAllRefused', () => {
    it('should call service.findAllRefused with user id', async () => {
      const result = [{ id: 2 }];
      mockProposalsService.findAllRefused.mockResolvedValue(result);
      const req = { user: mockUser };
      await expect(controller.findAllRefused(req)).resolves.toEqual(result);
      expect(service.findAllRefused).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('aproveProposal', () => {
    it('should call service.aproveProposal with id and user id', async () => {
      const result = { id: 3, status: 'approved' };
      mockProposalsService.aproveProposal.mockResolvedValue(result);
      const req = { user: mockUser };
      await expect(controller.aproveProposal(3, req)).resolves.toEqual(result);
      expect(service.aproveProposal).toHaveBeenCalledWith(3, mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and user id', async () => {
      const result = { id: 4 };
      mockProposalsService.findOne.mockResolvedValue(result);
      const req = { user: mockUser };
      await expect(controller.findOne(4, req)).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(4, mockUser.id);
    });
  });
});
