import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Administração')
@ApiHeader({
  name: 'user_id',
  description: 'ID do usuário necessário para autenticação',
  required: true,
})
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profit-by-status')
  @ApiOperation({ summary: '🔑 Listar as propostas por status' })
  findProfitByStatus() {
    return this.adminService.findProfitByStatus();
  }

  @Get('best-users')
  @ApiOperation({ summary: '🔑 Listar os melhores usuários com sucesso' })
  findBestUsers(@Query('start') start: Date, @Query('end') end: Date) {
    return this.adminService.findBestUsers(start, end);
  }
}
