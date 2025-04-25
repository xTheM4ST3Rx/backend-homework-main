import { Controller, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  findAll() {
    return this.customersService.findAll();
  }
}
