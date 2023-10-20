import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('rz_media')
export class Media {
  @PrimaryGeneratedColumn()
  media_id: number;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @ManyToOne(() => User, (user) => user.user_id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
