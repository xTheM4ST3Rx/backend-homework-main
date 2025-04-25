import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal, ProposalStatus } from './entities/proposal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
  ) {}

  async findAll() {
    return await this.proposalRepository.find({});
  }

  async findOne(id: number) {
    return await this.proposalRepository.findOne({ where: { id } });
  }

  async findAllRefused() {
    return await this.proposalRepository.find({
      where: { status: ProposalStatus.REFUSED },
    });
  }

  async aproveProposal(id: number, userId: number) {
    const proposal = await this.proposalRepository.findOneBy({
      id,
    });
    if (!proposal) {
      throw new BadRequestException('Proposta não encontrada');
    }
    switch (proposal.status) {
      case ProposalStatus.PENDING:
        proposal.status = ProposalStatus.SUCCESSFUL;
        return await this.proposalRepository.save(proposal);
      case ProposalStatus.SUCCESSFUL:
        throw new BadRequestException('A proposta já foi aprovada');
      case ProposalStatus.REFUSED:
        throw new BadRequestException('A proposta já foi recusada');
      case ProposalStatus.ERROR:
        throw new BadRequestException('A proposta já foi cancelada');
      default:
        throw new BadRequestException('A proposta não pode ser aprovada');
    }
  }
}
