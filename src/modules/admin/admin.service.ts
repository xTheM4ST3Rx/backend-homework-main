import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Proposal,
  ProposalStatus,
} from '../proposals/entities/proposal.entity';
import { Between, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //Retorna a soma do profit de todas as propostas por usuario agrupada por status.
  async findProfitByStatus() {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.proposals', 'proposal')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('proposal.status', 'status')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .addGroupBy('proposal.status')
      .getRawMany();
  }

  //Retorna os users que possuem o maior profit de propostas em sucesso vinculado.
  async findBestUsers(start: Date, end: Date) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.proposals',
        'proposal',
        `proposal.status = :status AND proposal.createdAt BETWEEN :start AND :end`,
        {
          status: ProposalStatus.SUCCESSFUL,
          start,
          end,
        },
      )
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('SUM(proposal.profit)', 'totalProfit')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .orderBy('totalProfit', 'DESC')
      .getRawMany();
  }
}
