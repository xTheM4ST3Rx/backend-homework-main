import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Customer, (customer) => customer.userCreator)
  createdCustomers: Customer[];

  @OneToMany(() => Proposal, (proposal) => proposal.userCreator)
  proposals: Proposal[];

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance: number;

  @CreateDateColumn({
    type: process.env.DB_TYPE === 'postgres' ? 'timestamp' : 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: process.env.DB_TYPE === 'postgres' ? 'timestamp' : 'datetime',
  })
  updatedAt: Date;
}
