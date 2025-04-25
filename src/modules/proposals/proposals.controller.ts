import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('Propostas')
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar propostas' })
  findAll() {
    return this.proposalsService.findAll();
  }

  @Get('refused')
  @ApiOperation({ summary: 'Listar propostas recusadas' })
  findAllRefused() {
    return this.proposalsService.findAllRefused();
  }

  @Post('refused/:id/aprove')
  @ApiOperation({ summary: 'Aprovar proposta pendente' })
  aproveProposal(@Param('id') id: number, @Req() req: { user: User }) {
    console.log(id);
    return this.proposalsService.aproveProposal(id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar proposta por ID' })
  findOne(@Param('id') id: number, @Req() req: { user: User }) {
    return this.proposalsService.findOne(id);
  }
}
