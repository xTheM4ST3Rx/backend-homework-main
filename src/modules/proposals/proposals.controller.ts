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
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('Propostas')
@ApiHeader({
  name: 'user_id',
  description: 'ID do usuário necessário para autenticação',
  required: true,
})
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @ApiOperation({ summary: '🔑 Listar propostas' })
  findAll(@Req() req: { user: User }) {
    return this.proposalsService.findAll(req.user.id);
  }

  @Get('refused')
  @ApiOperation({ summary: '🔑 Listar recusadas' })
  findAllRefused(@Req() req: { user: User }) {
    return this.proposalsService.findAllRefused(req.user.id);
  }

  @Post('refused/:id/aprove')
  @ApiOperation({ summary: '🔑 Aprovar pendente' })
  aproveProposal(@Param('id') id: number, @Req() req: { user: User }) {
    return this.proposalsService.aproveProposal(id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '🔑 Buscar proposta por ID' })
  findOne(@Param('id') id: number, @Req() req: { user: User }) {
    return this.proposalsService.findOne(id, req.user.id);
  }
}
