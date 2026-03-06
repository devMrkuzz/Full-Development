import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'auto' })
  language!: 'auto' | 'en' | 'fil' | 'bik';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ChatMessage, (message) => message.session)
  messages!: ChatMessage[];
}