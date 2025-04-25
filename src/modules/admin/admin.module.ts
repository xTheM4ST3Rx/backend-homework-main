import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from '../proposals/entities/proposal.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
