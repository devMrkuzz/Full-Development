import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('visitor_logs')
  export class VisitorLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    fullName: string;
  
    @Column()
    purpose: string;
  
    @Column({ nullable: true })
    contact: string;
  
    @Column({ nullable: true })
    department: string;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;
  
    @CreateDateColumn()
    loggedAt: Date;
  }