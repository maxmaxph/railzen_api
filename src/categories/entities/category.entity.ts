import { Session } from 'src/sessions/entities/session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rz_category')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @OneToMany(() => Session, (session) => session.category)
  sessions: Session[];
}
