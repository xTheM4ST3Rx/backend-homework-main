import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private dataSource: DataSource,
  ) {}

  //RETORNA TODAS AS PROPOSTAS DO USUÁRIO (user_id)
  async findAll(user_id: number) {
    return await this.proposalRepository.find({
      where: { userCreator: { id: user_id } },
      relations: {
        userCreator: true,
        customer: true,
      },
    });
  }

  //RETORNA A PROPOSTA DO USUÁRIO (user_id) COM O ID ESPECIFICADO
  async findOne(id: number, user_id: number) {
    return await this.proposalRepository.findOneBy({
      id,
      userCreator: { id: user_id },
    });
  }

  async findAllRefused(user_id: number) {
    return await this.proposalRepository.find({
      where: { status: ProposalStatus.REFUSED, userCreator: { id: user_id } },
    });
  }

  async aproveProposal(id: number, userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const proposal = await manager.findOneBy(Proposal, {
        id,
        userCreator: { id: userId },
      });
      if (!proposal) {
        throw new BadRequestException('Proposta não encontrada');
      }
      switch (proposal.status) {
        case ProposalStatus.PENDING:
          if (proposal.profit && proposal.profit > 0) {
            const user = await manager.findOneBy(User, { id: userId });
            if (!user) {
              throw new BadRequestException('Usuário não encontrado');
            }
            if ((user.balance || 0) < proposal.profit) {
              throw new BadRequestException(
                'Saldo insuficiente para aprovar a proposta',
              );
            }
            // Debita do saldo do usuário, não permitindo saldo negativo
            user.balance = (user.balance || 0) - proposal.profit;
            await manager.save(User, user);
          }

          proposal.status = ProposalStatus.SUCCESSFUL;
          const savedProposal = await manager.save(Proposal, proposal);
          return savedProposal;

        case ProposalStatus.SUCCESSFUL:
          throw new BadRequestException('A proposta já foi aprovada');
        case ProposalStatus.REFUSED:
          throw new BadRequestException('A proposta já foi recusada');
        case ProposalStatus.ERROR:
          throw new BadRequestException('A proposta já foi cancelada');
        default:
          throw new BadRequestException('A proposta não pode ser aprovada');
      }
    });
  }
}
