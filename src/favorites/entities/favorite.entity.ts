import { Session } from 'src/sessions/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('rz_favorite')
export class Favorite {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  session_id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Session, (session) => session.favorites)
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
