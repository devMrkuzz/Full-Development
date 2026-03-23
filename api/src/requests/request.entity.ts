import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  export enum RequestStatus {
    PENDING = 'PENDING',
    ON_PROCESS = 'ON_PROCESS',
    COMPLETED = 'COMPLETED',
  }
  
  export enum DocumentType {
    TRANSCRIPT = 'TRANSCRIPT',
    DIPLOMA = 'DIPLOMA',
    ENROLLMENT = 'ENROLLMENT',
    CLEARANCE = 'CLEARANCE',
    GOOD_MORAL = 'GOOD_MORAL',
    OTHER = 'OTHER',
  }
  
  @Entity('document_requests')
  export class DocumentRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    trackingCode: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'requester_id' })
    requester: User;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: User;
  
    @Column({
      type: 'enum',
      enum: DocumentType,
    })
    documentType: DocumentType;
  
    @Column({
      type: 'enum',
      enum: RequestStatus,
      default: RequestStatus.PENDING,
    })
    status: RequestStatus;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;
  
    @Column({ nullable: true })
    notes: string;
  
    @CreateDateColumn()
    submittedAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ nullable: true })
    completedAt: Date;
  }