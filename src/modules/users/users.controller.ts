import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiHeader({
  name: 'user_id',
  description: 'ID do usuário necessário para autenticação',
  required: true,
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '🔑 Listar usuários' })
  findAll() {
    return this.usersService.findAll();
  }
}
