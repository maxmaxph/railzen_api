import { Session } from 'src/sessions/entities/session.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rz_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'char', length: 60, nullable: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_in: Date;

  @Column({ type: 'int', nullable: false })
  role_id: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
