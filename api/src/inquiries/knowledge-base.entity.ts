import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('knowledge_base')
  export class KnowledgeBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @Column({ type: 'text', nullable: true })
    category: string;
  
    @Column({ type: 'jsonb', nullable: true })
    embedding: number[];
  
    @Column({ type: 'text', nullable: true })
    sourceLabel: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }