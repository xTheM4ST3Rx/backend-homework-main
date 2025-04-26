import { Controller, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiHeader({
  name: 'user_id',
  description: 'ID do usuário necessário para autenticação',
  required: true,
})
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: '🔑 Listar clientes' })
  findAll() {
    return this.customersService.findAll();
  }
}
