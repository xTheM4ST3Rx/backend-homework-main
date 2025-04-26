import { User } from '../../users/entities/user.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.proposals)
  userCreator: User;

  @OneToMany(() => Proposal, (proposal) => proposal.customer)
  proposals: Proposal[];

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  cpf: string;

  @CreateDateColumn({
    type: process.env.DB_TYPE === 'postgres' ? 'timestamp' : 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: process.env.DB_TYPE === 'postgres' ? 'timestamp' : 'datetime',
  })
  updatedAt: Date;
}
