import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rz_role')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
