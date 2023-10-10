import { Category } from 'src/categories/entities/category.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rz_session')
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'time', nullable: false })
  duration: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sound_file: string;

  @Column({ type: 'timestamp', nullable: false })
  date_added: Date;

  @ManyToOne(() => Category, (category) => category.sessions)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Favorite, (favorite) => favorite.session)
  favorites: Favorite[];
}
