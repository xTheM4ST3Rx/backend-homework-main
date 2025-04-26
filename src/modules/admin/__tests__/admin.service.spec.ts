import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import {
  Proposal,
  ProposalStatus,
} from '../../proposals/entities/proposal.entity';
import { Repository } from 'typeorm';

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Proposal),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findProfitByStatus', () => {
    it('should return grouped profit by status', async () => {
      const mockQueryBuilder: any = {
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            userId: 1,
            userName: 'User 1',
            status: 'approved',
            totalProfit: 1000,
          },
        ]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.findProfitByStatus();
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(result).toEqual([
        {
          userId: 1,
          userName: 'User 1',
          status: 'approved',
          totalProfit: 1000,
        },
      ]);
    });
  });

  describe('findBestUsers', () => {
    it('should return users with the highest profit in successful proposals within date range', async () => {
      const mockQueryBuilder: any = {
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([
            { userId: 2, userName: 'User 2', totalProfit: 2000 },
          ]),
      };
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const start = new Date('2024-01-01');
      const end = new Date('2024-06-01');
      const result = await service.findBestUsers(start, end);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'user.proposals',
        'proposal',
        `proposal.status = :status AND proposal.createdAt BETWEEN :start AND :end`,
        {
          status: ProposalStatus.SUCCESSFUL,
          start: start.toISOString(),
          end: end.toISOString(),
        },
      );
      expect(result).toEqual([
        { userId: 2, userName: 'User 2', totalProfit: 2000 },
      ]);
    });
  });
});
