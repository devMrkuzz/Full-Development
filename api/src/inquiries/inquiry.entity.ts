import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity('inquiry_sessions')
  export class InquirySession {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    sessionToken: string;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => InquiryMessage, (message) => message.session)
    messages: InquiryMessage[];
  
    @CreateDateColumn()
    startedAt: Date;
  
    @Column({ nullable: true })
    endedAt: Date;
  }
  
  @Entity('inquiry_messages')
  export class InquiryMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => InquirySession, (session) => session.messages)
    @JoinColumn({ name: 'session_id' })
    session: InquirySession;
  
    @Column()
    role: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @Column({ type: 'jsonb', nullable: true })
    ragSources: Record<string, any>[];
  
    @CreateDateColumn()
    sentAt: Date;
  }