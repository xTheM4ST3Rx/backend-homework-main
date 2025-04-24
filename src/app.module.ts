import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './configs/ormconfig';
import { UserMiddleware } from './middlewares/get-user-middleware';
import { UsersModule } from './modules/users/users.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    ProposalsModule,
    CustomersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*'); // Apply it for all routes or specify routes
  }
}

// @Get('/proposals/:id')
// async getProposalById(
//   @Param('id') proposalId: number,
//   @Req() req: { user: User },
// ): Promise<Proposal> {
//   return await this.proposalRepository.findOne({ where: { id: proposalId } });
// }
