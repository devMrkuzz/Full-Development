import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'auto' })
  language!: string;

  @Column({ default: false })
  isRequestFlow!: boolean;

  @Column({ type: 'varchar', nullable: true })
  requestStep!: string | null;

  @Column({ type: 'varchar', nullable: true })
  pendingDocumentType!: string | null;

  @Column({ type: 'varchar', nullable: true })
  requesterFullName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  requesterPurpose!: string | null;

  @Column({ type: 'varchar', nullable: true })
  requesterContact!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ChatMessage, (message) => message.session)
  messages!: ChatMessage[];
}