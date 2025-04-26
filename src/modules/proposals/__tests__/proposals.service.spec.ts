import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsService } from '../proposals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Proposal, ProposalStatus } from '../entities/proposal.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

const mockProposalRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
});

const mockDataSource = () => ({
  transaction: jest.fn(),
});

describe('ProposalsService', () => {
  let service: ProposalsService;
  let proposalRepository: jest.Mocked<Repository<Proposal>>;
  let dataSource: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalsService,
        {
          provide: getRepositoryToken(Proposal),
          useFactory: mockProposalRepository,
        },
        { provide: DataSource, useFactory: mockDataSource },
      ],
    }).compile();

    service = module.get<ProposalsService>(ProposalsService);
    proposalRepository = module.get(getRepositoryToken(Proposal));
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all proposals for a user', async () => {
      const proposals = [{ id: 1 }, { id: 2 }] as Proposal[];
      proposalRepository.find.mockResolvedValue(proposals);
      const result = await service.findAll(1);
      expect(result).toBe(proposals);
      expect(proposalRepository.find).toHaveBeenCalledWith({
        where: { userCreator: { id: 1 } },
        relations: { userCreator: true, customer: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a proposal by id and user_id', async () => {
      const proposal = { id: 1 } as Proposal;
      proposalRepository.findOneBy.mockResolvedValue(proposal);
      const result = await service.findOne(1, 2);
      expect(result).toBe(proposal);
      expect(proposalRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        userCreator: { id: 2 },
      });
    });
  });

  describe('findAllRefused', () => {
    it('should return all refused proposals for a user', async () => {
      const proposals = [{ id: 3 }] as Proposal[];
      proposalRepository.find.mockResolvedValue(proposals);
      const result = await service.findAllRefused(5);
      expect(result).toBe(proposals);
      expect(proposalRepository.find).toHaveBeenCalledWith({
        where: { status: ProposalStatus.REFUSED, userCreator: { id: 5 } },
      });
    });
  });

  describe('aproveProposal', () => {
    it('should approve a pending proposal and debit user balance', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.PENDING,
        profit: 100,
        userCreator: { id: 2 },
      } as Proposal;
      const user = { id: 2, balance: 200 } as User;
      const savedProposal = { ...proposal, status: ProposalStatus.SUCCESSFUL };

      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest
            .fn()
            .mockImplementationOnce(() => proposal)
            .mockImplementationOnce(() => user),
          save: jest
            .fn()
            .mockImplementationOnce(() => user)
            .mockImplementationOnce(() => savedProposal),
        });
      });

      const result = await service.aproveProposal(1, 2);
      expect(result).toEqual(savedProposal);
    });

    it('should throw if proposal not found', async () => {
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest.fn().mockResolvedValue(undefined),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if proposal already approved', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.SUCCESSFUL,
        userCreator: { id: 2 },
      } as Proposal;
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest.fn().mockResolvedValue(proposal),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        'A proposta já foi aprovada',
      );
    });

    it('should throw if proposal already refused', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.REFUSED,
        userCreator: { id: 2 },
      } as Proposal;
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest.fn().mockResolvedValue(proposal),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        'A proposta já foi recusada',
      );
    });

    it('should throw if proposal already canceled', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.ERROR,
        userCreator: { id: 2 },
      } as Proposal;
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest.fn().mockResolvedValue(proposal),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        'A proposta já foi cancelada',
      );
    });

    it('should throw if user not found', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.PENDING,
        profit: 100,
        userCreator: { id: 2 },
      } as Proposal;
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest
            .fn()
            .mockImplementationOnce(() => proposal)
            .mockImplementationOnce(() => undefined),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });

    it('should throw if user has insufficient balance', async () => {
      const proposal = {
        id: 1,
        status: ProposalStatus.PENDING,
        profit: 100,
        userCreator: { id: 2 },
      } as Proposal;
      const user = { id: 2, balance: 50 } as User;
      dataSource.transaction.mockImplementation(async (cb: any) => {
        return cb({
          findOneBy: jest
            .fn()
            .mockImplementationOnce(() => proposal)
            .mockImplementationOnce(() => user),
        });
      });
      await expect(service.aproveProposal(1, 2)).rejects.toThrow(
        'Saldo insuficiente para aprovar a proposta',
      );
    });
  });
});
